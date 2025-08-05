from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from ..dependencies import get_db, get_current_user
from backend.schemas.appointment import Appointment, AppointmentCreate, AppointmentUpdate
from backend.models.user import User

router = APIRouter(
    prefix="/appointments",
    tags=["appointments"],
    responses={404: {"description": "Not found"}},
)


@router.post("/", response_model=Appointment)
def create_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return crud.create_appointment(db=db, appointment=appointment, user_id=current_user.id)


@router.get("/", response_model=List[Appointment])
def list_appointments(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return crud.get_appointments(db=db, user_id=current_user.id, status=status)


@router.get("/{appointment_id}", response_model=Appointment)
def read_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_appointment = crud.get_appointment(db=db, appointment_id=appointment_id, user_id=current_user.id)
    if db_appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return db_appointment


@router.put("/{appointment_id}", response_model=Appointment)
def update_appointment(
    appointment_id: int,
    appointment_update: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_appointment = crud.update_appointment(
        db=db, appointment_id=appointment_id, appointment_update=appointment_update, user_id=current_user.id
    )
    if db_appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return db_appointment


@router.delete("/{appointment_id}", response_model=Appointment)
def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_appointment = crud.delete_appointment(db=db, appointment_id=appointment_id, user_id=current_user.id)
    if db_appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return db_appointment