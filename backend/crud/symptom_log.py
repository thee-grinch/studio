from sqlalchemy.orm import Session
from . import models, schemas
from typing import List

def create_symptom_log(db: Session, symptom_log: schemas.SymptomLogCreate, user_id: int, pregnancy_id: int):
    db_symptom_log = models.SymptomLog(**symptom_log.model_dump(), user_id=user_id, pregnancy_id=pregnancy_id)
    db.add(db_symptom_log)
    db.commit()
    db.refresh(db_symptom_log)
    return db_symptom_log

def get_symptom_logs(db: Session, user_id: int, pregnancy_id: int):
    return db.query(models.SymptomLog).filter(models.SymptomLog.user_id == user_id, models.SymptomLog.pregnancy_id == pregnancy_id).all()

def get_symptom_log(db: Session, symptom_log_id: int, user_id: int):
    return db.query(models.SymptomLog).filter(models.SymptomLog.id == symptom_log_id, models.SymptomLog.user_id == user_id).first()

def update_symptom_log(db: Session, symptom_log_id: int, symptom_log_update: schemas.SymptomLogCreate, user_id: int):
    db_symptom_log = get_symptom_log(db, symptom_log_id=symptom_log_id, user_id=user_id)
    if db_symptom_log:
        for key, value in symptom_log_update.model_dump().items():
            setattr(db_symptom_log, key, value)
        db.commit()
        db.refresh(db_symptom_log)
    return db_symptom_log

def delete_symptom_log(db: Session, symptom_log_id: int, user_id: int):
    db_symptom_log = get_symptom_log(db, symptom_log_id=symptom_log_id, user_id=user_id)
    if db_symptom_log:
        db.delete(db_symptom_log)
        db.commit()
    return db_symptom_log