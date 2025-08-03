from datetime import date
from typing import Optional
from pydantic import BaseModel

class SymptomLogBase(BaseModel):
    date: date
    symptom: str
    mood: str
    severity: str
    pregnancy_id: Optional[int] = None

class SymptomLogCreate(SymptomLogBase):
    pass

class SymptomLog(SymptomLogBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True