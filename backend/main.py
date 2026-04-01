from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
import shutil
import os
import uuid

from crud import init_db, get_db, create_document, list_documents, get_document, update_document
from models import OPDDocumentCreate, OPDDocumentResponse
from whisper_stt import transcribe_audio
from translator import translate_to_english
from ner_extractor import extract_medical_entities
from doc_generator import generate_opd_document

app = FastAPI(title="OPD Document System")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    await init_db()
    # Create temp dir for uploads if not exists
    os.makedirs("temp_audio", exist_ok=True)

@app.post("/api/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    temp_file: str = f"temp_audio/{uuid.uuid4()}_{audio.filename}"
    with open(temp_file, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)
        
    try:
        # 1. Transcribe
        result = transcribe_audio(temp_file)
        transcript = result['text']
        lang = result['language']
        
        # 2. Translate if not english
        english_transcript = translate_to_english(transcript, lang)
        
        # 3. Extract Medical Entities
        entities_data = extract_medical_entities(english_transcript)
        entities = entities_data.get("entities", [])
        
        return {
            "transcript": transcript,
            "language": lang,
            "translated_transcript": english_transcript,
            "entities": entities
        }
    finally:
        # Clean up
        if os.path.exists(temp_file):
            os.remove(temp_file)

from pydantic import BaseModel
from typing import List

class DocumentRequest(BaseModel):
    transcript: str
    entities: List[str]
    language_detected: str = "en"

@app.post("/api/generate-document")
async def generate_document(req: DocumentRequest):
    # Pass to Gemini
    doc_data = generate_opd_document(req.transcript, req.entities)
    # Give back to frontend to review
    return {
        "status": "success",
        "document": doc_data,
        "raw_transcript": req.transcript,
        "language_detected": req.language_detected
    }

@app.post("/api/documents", response_model=OPDDocumentResponse)
async def save_document(doc: OPDDocumentCreate, session: AsyncSession = Depends(get_db)):
    db_item = await create_document(session, doc.model_dump())
    return db_item

@app.put("/api/documents/{doc_id}", response_model=OPDDocumentResponse)
async def update_existing_document(doc_id: int, doc: OPDDocumentCreate, session: AsyncSession = Depends(get_db)):
    db_item = await update_document(session, doc_id, doc.model_dump())
    if not db_item:
        raise HTTPException(status_code=404, detail="Document not found")
    return db_item

@app.get("/api/documents", response_model=List[OPDDocumentResponse])
async def get_all_documents(session: AsyncSession = Depends(get_db)):
    return await list_documents(session)

@app.get("/api/documents/{doc_id}", response_model=OPDDocumentResponse)
async def get_single_document(doc_id: int, session: AsyncSession = Depends(get_db)):
    doc = await get_document(session, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
