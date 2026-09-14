from pydantic import BaseModel

class ClinicalNote(BaseModel):
    id: str
    content: str
    author: str
    created_at: str

class NoteCreate(BaseModel):
    """Schema for POST /api/assessments/{id}/notes"""
    content: str
    author: str