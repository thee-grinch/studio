from sqlalchemy.orm import Session
from sqlalchemy import and_
from ..models.pregnancy import Pregnancy
from ..schemas.pregnancy import PregnancyCreate, PregnancyUpdate, PregnancyWithCalculatedFields
from datetime import date
from ..schemas.pregnancy import PregnancyCreate, PregnancyUpdate

def create_pregnancy(db: Session, pregnancy: PregnancyCreate, user_id: int):
    db_pregnancy = Pregnancy(
        user_id=user_id,
        due_date=pregnancy.due_date,
        start_date=pregnancy.start_date,
        active=True  # New pregnancies are active by default
    )
    db.add(db_pregnancy)
    db.commit()
    db.refresh(db_pregnancy)
    return db_pregnancy

def get_active_pregnancy_by_user_id(db: Session, user_id: int):
    db_pregnancy = db.query(Pregnancy).filter(and_(Pregnancy.user_id == user_id, Pregnancy.active == True)).first()
    if db_pregnancy:
        # Calculate current week and trimester
        today = date.today()
        time_since_start = today - db_pregnancy.start_date
        current_week = time_since_start.days // 7 + 1 # Add 1 because week 1 starts on day 0

        if current_week <= 13:
            trimester = 1
        elif current_week <= 26:
            trimester = 2
        else:
            trimester = 3

        # Return data with calculated fields
        return PregnancyWithCalculatedFields.model_validate(db_pregnancy, update={"current_week": current_week, "trimester": trimester})
    return None

def update_pregnancy(db: Session, pregnancy_id: int, pregnancy: PregnancyUpdate):
    db_pregnancy = db.query(Pregnancy).filter(Pregnancy.id == pregnancy_id).first()
    if db_pregnancy:
        update_data = pregnancy.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_pregnancy, key, value)
        db.commit()
        db.refresh(db_pregnancy)
    return db_pregnancy

def deactivate_pregnancy(db: Session, pregnancy_id: int):
    db_pregnancy = db.query(Pregnancy).filter(Pregnancy.id == pregnancy_id).first()
    if db_pregnancy:
        db_pregnancy.active = False
        db.commit()
        db.refresh(db_pregnancy)
    return db_pregnancy

def get_pregnancy_by_id(db: Session, pregnancy_id: int):
    return db.query(Pregnancy).filter(Pregnancy.id == pregnancy_id).first()