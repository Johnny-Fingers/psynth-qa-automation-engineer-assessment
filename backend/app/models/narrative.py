from pydantic import BaseModel

class NarrativeResponse(BaseModel):
    narrative: str