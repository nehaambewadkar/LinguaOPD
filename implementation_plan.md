# Multilingual OPD Documentation System — Implementation Plan

A **robot secretary** for Indian hospital OPDs that listens to doctor-patient conversations in any Indian language and auto-generates structured medical documents.

## User Review Required

> [!IMPORTANT]
> **API Keys**: The OPD document generation step uses an LLM. For the MVP, we'll use **Google Gemini API** (free tier available). You'll need to provide an API key. Alternatively, we can use a local model via **Ollama** — let me know your preference.

> [!IMPORTANT]
> **Database Choice**: For the MVP, I'll use **SQLite** (zero setup, file-based). We can migrate to PostgreSQL/MongoDB later. Is that OK?

> [!IMPORTANT]
> **IndicTrans2 vs Google Translate**: IndicTrans2 requires heavy GPU resources to run locally. For the MVP, I recommend using **Google Translate API** (via `googletrans` free library) for translation. We can swap in IndicTrans2 later for production. Agree?

---

## Proposed Changes

### Project Structure

```
OPD_Project/
├── backend/
│   ├── main.py                 # FastAPI server + API routes
│   ├── whisper_stt.py          # Whisper speech-to-text
│   ├── translator.py           # Translation logic
│   ├── ner_extractor.py        # spaCy medical NER
│   ├── doc_generator.py        # LLM-based OPD doc generation
│   ├── crud.py                 # SQLAlchemy models + CRUD
│   ├── models.py               # Pydantic schemas
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # API keys (not committed)
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Main app layout
│   │   ├── App.css             # Styles
│   │   ├── components/
│   │   │   ├── Recorder.jsx    # Mic recording button
│   │   │   ├── Transcript.jsx  # Live transcript display
│   │   │   ├── OPDDocument.jsx # Generated doc preview/editor
│   │   │   └── PatientList.jsx # Saved documents list
│   │   └── main.jsx            # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md
```

---

### Backend (Python FastAPI)

#### [NEW] [requirements.txt](file:///c:/Users/ASUS/Desktop/OPD_Project/backend/requirements.txt)
- FastAPI, uvicorn, python-multipart
- openai-whisper, torch
- spacy, scispacy (medical NER)
- googletrans==4.0.0-rc1 (free translation)
- google-generativeai (Gemini API for doc generation)
- sqlalchemy, aiosqlite
- python-dotenv, pydantic

#### [NEW] [main.py](file:///c:/Users/ASUS/Desktop/OPD_Project/backend/main.py)
- `POST /api/transcribe` — Accept audio file → return transcription + detected language
- `POST /api/generate-document` — Accept transcription → return structured OPD document
- `GET /api/documents` — List all saved OPD documents
- `GET /api/documents/{id}` — Get a specific document
- `POST /api/documents` — Save a finalized OPD document
- `DELETE /api/documents/{id}` — Delete a document
- CORS middleware for React frontend

#### [NEW] [whisper_stt.py](file:///c:/Users/ASUS/Desktop/OPD_Project/backend/whisper_stt.py)
- Load Whisper `base` model (small enough to run on CPU, good accuracy)
- Function: `transcribe_audio(file_path) → {text, language}`
- Auto-detects language from 90+ languages including all major Indian languages

#### [NEW] [translator.py](file:///c:/Users/ASUS/Desktop/OPD_Project/backend/translator.py)
- Translate non-English text to English using `googletrans`
- Function: `translate_to_english(text, source_lang) → english_text`
- Passthrough if already English

#### [NEW] [ner_extractor.py](file:///c:/Users/ASUS/Desktop/OPD_Project/backend/ner_extractor.py)
- Load spaCy with `en_core_sci_sm` (scientific/medical model)
- Extract: symptoms, body parts, medications, dosages, diagnoses, durations
- Function: `extract_medical_entities(text) → {symptoms, medications, diagnoses, ...}`

#### [NEW] [doc_generator.py](file:///c:/Users/ASUS/Desktop/OPD_Project/backend/doc_generator.py)
- Use Google Gemini API with a structured medical prompt
- Input: raw transcript + extracted entities
- Output: formatted OPD document with sections (Chief Complaint, History, Examination, Diagnosis, Prescription, Follow-up)
- Function: `generate_opd_document(transcript, entities) → OPDDocument`

#### [NEW] [crud.py](file:///c:/Users/ASUS/Desktop/OPD_Project/backend/crud.py)
- SQLAlchemy with SQLite
- Table: `opd_documents` (id, patient_name, age, gender, date, chief_complaint, history, examination, diagnosis, prescription, advice, follow_up, raw_transcript, language_detected, created_at)

#### [NEW] [models.py](file:///c:/Users/ASUS/Desktop/OPD_Project/backend/models.py)
- Pydantic models for request/response validation

---

### Frontend (React + Vite)

#### [NEW] [Recorder.jsx](file:///c:/Users/ASUS/Desktop/OPD_Project/frontend/src/components/Recorder.jsx)
- Browser `MediaRecorder` API for mic capture
- Record/Stop button with visual waveform animation
- Sends audio blob to backend `/api/transcribe`

#### [NEW] [Transcript.jsx](file:///c:/Users/ASUS/Desktop/OPD_Project/frontend/src/components/Transcript.jsx)
- Displays live transcript text
- Shows detected language badge
- Shows extracted entities highlighted

#### [NEW] [OPDDocument.jsx](file:///c:/Users/ASUS/Desktop/OPD_Project/frontend/src/components/OPDDocument.jsx)
- Renders the auto-generated OPD document
- Editable fields so doctor can make corrections
- Save & Export as PDF buttons

#### [NEW] [PatientList.jsx](file:///c:/Users/ASUS/Desktop/OPD_Project/frontend/src/components/PatientList.jsx)
- Lists all saved OPD documents
- Search and filter by date/name
- Click to view full document

#### [NEW] [App.jsx](file:///c:/Users/ASUS/Desktop/OPD_Project/frontend/src/App.jsx)
- Main layout with sidebar navigation
- Three views: Record → Review Document → History
- Dark/light theme, premium medical UI design

---

## Verification Plan

### Automated Tests
1. **Backend API test**: Run `python -m pytest backend/tests/` — Test each API endpoint with mock audio
2. **NER test**: Verify entity extraction on sample medical sentences
3. **Frontend build**: Run `npm run build` in `frontend/` to verify no build errors

### Manual Verification
1. **Speech-to-Text test**: 
   - Start backend with `uvicorn backend.main:app --reload`
   - Start frontend with `npm run dev` in `frontend/`
   - Click Record, speak a sample sentence in Hindi like *"Mujhe 2 din se pet mein dard ho raha hai"*
   - Verify transcript appears with language detected as Hindi
2. **Document generation test**:
   - After recording, click "Generate Document"
   - Verify OPD document is generated with correct sections
   - Verify extracted medical entities are highlighted
3. **Save & retrieve test**:
   - Save the document, go to History tab, verify it appears
   - Click on it to view full details
