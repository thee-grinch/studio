from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class SymptomLog(Base):
    __tablename__ = "symptom_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    pregnancy_id = Column(Integer, ForeignKey("pregnancies.id"), nullable=True)  # Optional: link to a specific pregnancy
    date = Column(Date, nullable=False)
    symptom = Column(String, nullable=False)
    mood = Column(String, nullable=True)
    severity = Column(String, nullable=True)

    user = relationship("User")
    pregnancy = relationship("Pregnancy")