from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
import uuid

from ..models import Assessment, AssessmentResponse, NoteCreate, ClinicalNote, NarrativeResponse
from ..db import assessments
from ..services.narrative_service import generate_narrative

router = APIRouter()

@router.get("/assessments", response_model=List[AssessmentResponse])
def get_assessments(
    status: Optional[str] = Query(None, description="Filter assessments by status", alias="status"),
    assessment_type: Optional[str] = Query(None, description="Filter assessments by type", alias="type")
):
    """
    List all assessments with optional filtering by status or type.
    """
    filtered_assessments = assessments

    # Apply filters if provided
    if status:
        filtered_assessments = [a for a in filtered_assessments if a.assessment.status.lower() == status.lower()]
    
    if assessment_type:
        filtered_assessments = [a for a in filtered_assessments if a.assessment.type.lower() == assessment_type.lower()]

    # Map to the the simplified list view model
    return [
        AssessmentResponse(
            id=a.id,
            client_name=f"{a.client.first_name} {a.client.last_name}",
            assessment_type=a.assessment.type,
            date_administered=a.assessment.date_administered,
            status=a.assessment.status
        )
        for a in filtered_assessments
    ]

@router.get("/assessments/{id}", response_model=Assessment)
def get_assessment_detail(id: str):
    """
    Get full details for a specific assessment.
    """
    assessment = next((a for a in assessments if a.id == id), None)

    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    return assessment

@router.post("/assessments/{id}/notes", response_model=Assessment)
def add_note(id: str, note: NoteCreate):
    """
    Add a clinical note to an assessment.
    """

    assessment = next((a for a in assessments if a.id == id), None)

    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Create the note object
    new_note = ClinicalNote(
        id=f"note_{uuid.uuid4().hex[:8]}",
        content=note.content,
        author=note.author,
        created_at=datetime.utcnow().isoformat() + "Z"
    )

    assessment.clinical_notes.append(new_note)

    return assessment

@router.get("/assessments/{id}/narrative", response_model=NarrativeResponse)
def get_narrative(id: str):
    """
    Generate a narrative summary based on score rules.
    """

    assessment = next((a for a in assessments if a.id == id), None)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    narrative_text = generate_narrative(assessment)

    return NarrativeResponse(narrative=narrative_text)
