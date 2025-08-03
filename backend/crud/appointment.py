from sqlalchemy.orm import Session
from typing import List, Optional

from .. import models, schemas

def create_appointment(db: Session, appointment: schemas.AppointmentCreate, user_id: int):
    db_appointment = models.Appointment(**appointment.model_dump(), user_id=user_id)
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

def get_appointment(db: Session, appointment_id: int):
    return db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()

def get_appointments(db: Session, user_id: int, status: Optional[str] = None, skip: int = 0, limit: int = 100):
    query = db.query(models.Appointment).filter(models.Appointment.user_id == user_id)
    if status:
        query = query.filter(models.Appointment.status == status)
    return query.offset(skip).limit(limit).all()

def update_appointment(db: Session, appointment_id: int, appointment: schemas.AppointmentUpdate):
    db_appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if db_appointment:
        for key, value in appointment.model_dump(exclude_unset=True).items():
            setattr(db_appointment, key, value)
        db.commit()
        db.refresh(db_appointment)
    return db_appointment

def delete_appointment(db: Session, appointment_id: int):
    db_appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if db_appointment:
        db.delete(db_appointment)
        db.commit()
    return db_appointment