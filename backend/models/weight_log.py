from sqlalchemy import Column, Integer, Date, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from .database import Base

class WeightLog(Base):
    __tablename__ = "weight_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    pregnancy_id = Column(Integer, ForeignKey("pregnancies.id"), nullable=True)
    date = Column(Date)
    weight = Column(Float)

    user = relationship("User")


class WeightLog(Base):
    __tablename__ = "weight_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    pregnancy_id = Column(Integer, ForeignKey("pregnancies.id"), nullable=True)
    date = Column(Date)
    weight = Column(Float)

    user = relationship("User")
    pregnancy = relationship("Pregnancy")
    pregnancy = relationship("Pregnancy")