from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud, models, schemas
from ..dependencies import get_db, get_current_user

router = APIRouter(
    prefix="/symptom-logs",
    tags=["symptom logs"],
    responses={404: {"description": "Not found"}},
)


@router.post("/", response_model=schemas.SymptomLog)
def create_symptom_log(
    symptom_log: schemas.SymptomLogCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Associate symptom log with the active pregnancy
    active_pregnancy = crud.get_active_pregnancy_by_user_id(db=db, user_id=current_user.id)
    if active_pregnancy is None:
        raise HTTPException(status_code=400, detail="No active pregnancy found for this user.")

    symptom_log.pregnancy_id = active_pregnancy.id

    return crud.create_symptom_log(db=db, symptom_log=symptom_log, user_id=current_user.id)


@router.get("/", response_model=List[schemas.SymptomLog])
def list_symptom_logs(
    pregnancy_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # By default, list symptom logs for the active pregnancy if no pregnancy_id is provided
    return crud.get_symptom_logs(db=db, user_id=current_user.id, pregnancy_id=pregnancy_id)


@router.get("/{symptom_log_id}", response_model=schemas.SymptomLog)
def read_symptom_log(
    symptom_log_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_symptom_log = crud.get_symptom_log(db=db, symptom_log_id=symptom_log_id, user_id=current_user.id)
    if db_symptom_log is None:
        raise HTTPException(status_code=404, detail="Symptom log not found")
    return db_symptom_log
