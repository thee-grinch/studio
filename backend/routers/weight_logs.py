from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, schemas, models
from ..database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

router = APIRouter(
    prefix="/weight-logs",
    tags=["weight-logs"],
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.WeightLog)
def create_weight_log(
    weight_log: schemas.WeightLogCreate, db: Session = Depends(get_db)
):
    # In a real application, you would get the user_id from authentication
    user_id = 1 # Replace with actual user ID from authenticated user
    db_weight_log = crud.weight_log.create_weight_log(db=db, weight_log=weight_log, user_id=user_id)
    return db_weight_log

@router.get("/", response_model=List[schemas.WeightLog])
def list_weight_logs(db: Session = Depends(get_db)):
    # In a real application, you would get the user_id from authentication
    user_id = 1 # Replace with actual user ID from authenticated user
    weight_logs = crud.weight_log.get_weight_logs(db=db, user_id=user_id)
    return weight_logs