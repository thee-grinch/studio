from pydantic import BaseModel
from datetime import datetime
from typing import Literal

class ChatMessageBase(BaseModel):
    message_text: str
    sender: Literal["user", "ai"]

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessage(ChatMessageBase):
    id: int
    user_id: int
    timestamp: datetime

    class Config:
        orm_mode = True