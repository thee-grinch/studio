from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Pregnancy(Base):
    __tablename__ = "pregnancies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    due_date = Column(Date)
    start_date = Column(Date)
    active = Column(Boolean, default=True)

    user = relationship("User", back_populates="pregnancies")

# Assuming you have a User model in database.py like this:
# class User(Base):
#     __tablename__ = "users"
#
#     id = Column(Integer, primary_key=True, index=True)
#     email = Column(String, unique=True, index=True)
#     password = Column(String)
#
#     pregnancies = relationship("Pregnancy", back_populates="user")