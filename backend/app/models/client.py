from pydantic import BaseModel

class Client(BaseModel):
    id: str
    first_name: str
    last_name: str
    date_of_birth: str
    age_at_assessment: int
    gender: str
    grade: str
    school: str
    referral_reason: str