from pydantic import BaseModel
from typing import List, Optional
from . import weight_log, symptom_log, health_alert

class ChatMessageRequest(BaseModel):
    message: str

class ChatMessageResponse(BaseModel):
    response: str

class HealthDataRequest(BaseModel):
    recent_symptoms: list = []
    recent_weight_logs: List[weight_log.WeightLog] = []
    recent_symptom_logs: List[symptom_log.SymptomLog] = []
    current_week: Optional[int] = None

class AIHealthAlert(health_alert.HealthAlert):
    source: Optional[str] = "AI"

class HealthAlertResponse(AIHealthAlert):
    pass