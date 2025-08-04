from sqlalchemy.orm import Session
from .. import models, schemas
from typing import List
from datetime import datetime

def create_chat_message(db: Session, chat_message: schemas.ChatMessageCreate, user_id: int):
    db_chat_message = models.ChatMessage(**chat_message.model_dump(), user_id=user_id, timestamp=datetime.utcnow())
    db.add(db_chat_message)
    db.commit()
    db.refresh(db_chat_message)
    return db_chat_message

def get_chat_messages(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.ChatMessage).filter(models.ChatMessage.user_id == user_id).offset(skip).limit(limit).all()