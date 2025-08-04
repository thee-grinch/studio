from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, models, schemas
from ..dependencies import get_db, get_current_user

router = APIRouter(
    prefix="/chat",
    tags=["chat"],
    responses={404: {"description": "Not found"}},
)


@router.post("/", response_model=schemas.ChatMessage)
def create_chat_message(
    message: schemas.ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Create a new chat message.
    """
    return crud.create_chat_message(db=db, message=message, user_id=current_user.id)


@router.get("/", response_model=List[schemas.ChatMessage])
def list_chat_messages(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    List all chat messages for the current user.
    """
    return crud.get_chat_messages_by_user(db=db, user_id=current_user.id)