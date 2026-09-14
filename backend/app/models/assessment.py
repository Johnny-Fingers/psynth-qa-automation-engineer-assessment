from typing import List
from pydantic import BaseModel

from .client import Client
from .score import Scores
from .note import ClinicalNote

class AssessmentInfo(BaseModel):
    type: str
    full_name: str
    date_administered: str
    examiner: str
    status: str

class Assessment(BaseModel):
    id: str
    client: Client
    assessment: AssessmentInfo
    scores: Scores
    clinical_notes: List[ClinicalNote]

class AssessmentResponse(BaseModel):
    id: str
    client_name: str
    assessment_type: str
    date_administered: str
    status: str