from fastapi import APIRouter, Depends
from typing import List
from pydantic import BaseModel

from ..dependencies import get_current_user
from .. import models

router = APIRouter(
    prefix="/health-alerts",
    tags=["health alerts"],
)

class HealthAlert(BaseModel):
    id: int
    title: str
    description: str
    severity: str # e.g., "info", "warning", "danger"

    class Config:
        orm_mode = True

@router.get("/", response_model=List[HealthAlert])
def get_health_alerts(
    current_user: models.User = Depends(get_current_user)
):
    # For now, return hardcoded mock alerts
    mock_alerts = [
        HealthAlert(
            id=1,
            title="Upcoming Glucose Screening",
            description="Your glucose screening is coming up in weeks 24-28.",
            severity="info"
        ),
        HealthAlert(
            id=2,
            title="Weight Gain Alert",
            description="AI analysis suggests your weight gain is slightly above average.",
            severity="warning"
        ),
    ]
    return mock_alerts
