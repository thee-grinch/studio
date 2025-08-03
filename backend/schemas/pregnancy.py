from datetime import date
from typing import Optional

from pydantic import BaseModel

class PregnancyBase(BaseModel):
    due_date: date
    start_date: date
    active: Optional[bool] = True

class PregnancyCreate(PregnancyBase):
    pass

class Pregnancy(PregnancyBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True