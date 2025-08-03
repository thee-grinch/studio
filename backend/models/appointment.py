from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    pregnancy_id = Column(Integer, ForeignKey("pregnancies.id"), nullable=True)
    type = Column(String, index=True)
    date = Column(Date)
    time = Column(Time)
    doctor = Column(String)
    status = Column(String, default="Upcoming")  # e.g., Upcoming, Completed, Missed
    location = Column(String, nullable=True)
    summary = Column(String, nullable=True)

    user = relationship("User")
    pregnancy = relationship("Pregnancy")