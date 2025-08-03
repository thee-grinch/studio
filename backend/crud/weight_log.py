from sqlalchemy.orm import Session
from datetime import date

from backend.models.weight_log import WeightLog
from backend.schemas.weight_log import WeightLogCreate

def create_weight_log(db: Session, weight_log: WeightLogCreate, user_id: int, pregnancy_id: int | None = None):
    """Creates a new weight log entry."""
    db_weight_log = WeightLog(
        user_id=user_id,
        pregnancy_id=pregnancy_id,
        date=weight_log.date,
        weight=weight_log.weight
    )
    db.add(db_weight_log)
    db.commit()
    db.refresh(db_weight_log)
    return db_weight_log

def get_weight_logs_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    """Retrieves all weight logs for a specific user."""
    return db.query(WeightLog).filter(WeightLog.user_id == user_id).offset(skip).limit(limit).all()

def get_weight_logs_by_pregnancy(db: Session, pregnancy_id: int, skip: int = 0, limit: int = 100):
    """Retrieves all weight logs for a specific pregnancy."""
    return db.query(WeightLog).filter(WeightLog.pregnancy_id == pregnancy_id).offset(skip).limit(limit).all()

def get_weight_log_by_id(db: Session, weight_log_id: int):
    """Retrieves a specific weight log by its ID."""
    return db.query(WeightLog).filter(WeightLog.id == weight_log_id).first()

# Add update and delete functions if needed based on frontend requirements
# def update_weight_log(db: Session, weight_log_id: int, weight_log_update: WeightLogCreate):
#     """Updates an existing weight log entry."""
#     db_weight_log = get_weight_log_by_id(db, weight_log_id)
#     if db_weight_log:
#         db_weight_log.date = weight_log_update.date
#         db_weight_log.weight = weight_log_log_update.weight
#         db.commit()
#         db.refresh(db_weight_log)
#     return db_weight_log

# def delete_weight_log(db: Session, weight_log_id: int):
#     """Deletes a weight log entry."""
#     db_weight_log = get_weight_log_by_id(db, weight_log_id)
#     if db_weight_log:
#         db.delete(db_weight_log)
#         db.commit()
#         return True
#     return False