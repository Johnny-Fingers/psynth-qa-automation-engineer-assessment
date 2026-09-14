from typing import List, Optional
from pydantic import BaseModel

class ScoreItem(BaseModel):
    """Represents a single score (FSIQ, Index, etc)"""
    name: Optional[str] = None
    abbreviation: Optional[str] = None
    score: int
    percentile: int
    confidence_interval: Optional[str] = None
    classification: str

class Subtest(BaseModel):
    name: str
    scaled_score: int
    index: str

class Scores(BaseModel):
    full_scale_iq: ScoreItem
    primary_indices: List[ScoreItem]
    subtests: List[Subtest]