from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.schemas.user import UserCreate, UserUpdate, UserPublic
from .. import  database
from fastapi.security import OAuth2PasswordRequestForm
from backend.crud import user as user_crud
from backend.dependencies import get_current_user
from datetime import timedelta

router = APIRouter()

@router.post("/register", response_model=UserPublic)
def register_user(user: UserCreate, db: Session = Depends(database.get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if user_crud.get_user_by_email(db, email=user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    return user_crud.create_user(db=db, user=user, hashed_password=hashed_password)

@router.post("/login")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = user_crud.get_user_by_email(db, email=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=database.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me", response_model=UserPublic)
def read_users_me(current_user: UserPublic = Depends(get_current_user)):
    return current_user


@router.put("/users/me", response_model=UserPublic)
def update_users_me(
    user_update: UserUpdate,
    db: Session = Depends(database.get_db),
    current_user: UserPublic = Depends(get_current_user),
):
    db_user = user_crud.update_user(db=db, user_id=current_user.id, user_update=user_update)
    # Assuming crud.update_user returns the updated user object
    return db_user