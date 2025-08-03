from pydantic import BaseModel
from datetime import date, time
from typing import Optional

class AppointmentBase(BaseModel):
    type: str
    date: date
    time: time
    doctor: str
    status: str
    location: Optional[str] = None
    summary: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: int
    user_id: int
    pregnancy_id: Optional[int] = None

    class Config:
        orm_mode = True