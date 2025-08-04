from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message_text = Column(String, nullable=False)
    sender = Column(String, nullable=False)  # e.g., "user", "ai"
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User")