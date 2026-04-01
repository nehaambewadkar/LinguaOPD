from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class OPDDocumentBase(BaseModel):
    patient_name: Optional[str] = "Unknown Patient"
    age: Optional[str] = "Unknown"
    gender: Optional[str] = "Unknown"
    date: Optional[str] = ""
    chief_complaint: Optional[str] = ""
    history: Optional[str] = ""
    examination: Optional[str] = ""
    diagnosis: Optional[str] = ""
    prescription: Optional[str] = ""
    advice: Optional[str] = ""
    follow_up: Optional[str] = ""
    raw_transcript: Optional[str] = ""
    language_detected: Optional[str] = ""

class OPDDocumentCreate(OPDDocumentBase):
    pass

class OPDDocumentResponse(OPDDocumentBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
