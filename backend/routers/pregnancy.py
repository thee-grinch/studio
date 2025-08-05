
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import schemas, crud, dependencies
from ..database import SessionLocal
from backend.schemas.pregnancy import PregnancyCreate, Pregnancy
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

@router.post("/", response_model=Pregnancy)
def create_pregnancy(
    pregnancy: PregnancyCreate, db: Session = Depends(get_db)
):
    return crud.create_pregnancy(db=db, pregnancy=pregnancy)

@router.get("/{user_id}", response_model=Pregnancy)
def get_active_pregnancy_for_user(user_id: int, db: Session = Depends(get_db)):
    db_pregnancy = crud.get_active_pregnancy_by_user_id(db, user_id=user_id)
    if db_pregnancy is None:
        raise HTTPException(status_code=404, detail="Active pregnancy not found for this user")
    return db_pregnancy

@router.put("/{pregnancy_id}", response_model=Pregnancy)
def update_pregnancy(
    pregnancy_id: int, pregnancy: PregnancyCreate, db: Session = Depends(get_db)
):
    db_pregnancy = crud.update_pregnancy(db=db, pregnancy_id=pregnancy_id, pregnancy=pregnancy)
    if db_pregnancy is None:
        raise HTTPException(status_code=404, detail="Pregnancy not found")
    return db_pregnancy