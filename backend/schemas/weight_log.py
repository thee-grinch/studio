from pydantic import BaseModel
from datetime import date
from typing import Optional

class WeightLogBase(BaseModel):
    date: date
    weight: float

class WeightLogCreate(WeightLogBase):
    pregnancy_id: int

class WeightLog(WeightLogBase):
    id: int
    user_id: int
    pregnancy_id: int

    class Config:
        orm_mode = True