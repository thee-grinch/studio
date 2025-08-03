from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from . import models, crud, schemas
from .database import SessionLocal
from .config import settings # Assuming you have a settings file for JWT secret key

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token") # Your token endpoint

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Replace with your actual JWT decoding logic and secret key
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        user = crud.get_user_by_email(db, email=email)
        if user is None:
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import schemas, crud, dependencies
from ..database import SessionLocal

router = APIRouter(
    prefix="/pregnancy",
    tags=["pregnancy"],
    dependencies=[Depends(dependencies.get_db)],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Pregnancy)
def create_pregnancy(
    pregnancy: schemas.PregnancyCreate, db: Session = Depends(get_db)
):
    return crud.create_pregnancy(db=db, pregnancy=pregnancy)

@router.get("/{user_id}", response_model=schemas.Pregnancy)
def get_active_pregnancy_for_user(user_id: int, db: Session = Depends(get_db)):
    db_pregnancy = crud.get_active_pregnancy_by_user_id(db, user_id=user_id)
    if db_pregnancy is None:
        raise HTTPException(status_code=404, detail="Active pregnancy not found for this user")
    return db_pregnancy

@router.put("/{pregnancy_id}", response_model=schemas.Pregnancy)
def update_pregnancy(
    pregnancy_id: int, pregnancy: schemas.PregnancyCreate, db: Session = Depends(get_db)
):
    db_pregnancy = crud.update_pregnancy(db=db, pregnancy_id=pregnancy_id, pregnancy=pregnancy)
    if db_pregnancy is None:
        raise HTTPException(status_code=404, detail="Pregnancy not found")
    return db_pregnancy