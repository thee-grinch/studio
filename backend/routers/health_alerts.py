from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session

from ..dependencies import get_current_user, get_db
from .. import models, crud
from ..schemas.ai import HealthDataRequest, AIHealthAlert
from ..schemas.symptom_log import SymptomLog
from ..schemas.weight_log import WeightLog
from ..schemas.health_alert import HealthAlert  # Assuming you created this schema

import google.generativeai as genai

router = APIRouter(
    prefix="/health-alerts",
    tags=["health alerts"],
)

def generate_ai_health_alert(
    db: Session,
    user_id: int,
    current_week: int,
    recent_weight_logs: List[WeightLog],
    recent_symptom_logs: List[SymptomLog]
) -> AIHealthAlert | None:
    """Generates a health alert using AI based on user data."""
    genai.configure(api_key=models.settings.gemini_api_key)
    model = genai.GenerativeModel('gemini-pro')

    # Refine the prompt for clarity and desired output format
    prompt = f"""Analyze the following health data for a pregnant user who is {current_week} weeks along and generate a concise health alert or insight.
    Include recent weight logs and symptom logs.
    If there are no significant insights, state that the data looks good.
    Format the output as:
    TITLE: [Concise Title]
    DESCRIPTION: [Brief Description]

    Recent Weight Logs: {[f'{log.date}: {log.weight} lbs' for log in recent_weight_logs]}
    Recent Symptom Logs: {[f'{log.date}: {log.symptom} (Severity: {log.severity}, Mood: {log.mood})' for log in recent_symptom_logs]}

    Based on this data, generate a health alert:
    """

    try:
        response = model.generate_content(prompt)
        text_response = response.text.strip()

        # Parse the AI's response
        title_line = next((line for line in text_response.split('\\n') if line.startswith("TITLE:")), None)
        description_line = next((line for line in text_response.split('\\n') if line.startswith("DESCRIPTION:")), None)

        if title_line and description_line:
            title = title_line.replace("TITLE:", "").strip()
            description = description_line.replace("DESCRIPTION:", "").strip()
            return AIHealthAlert(id=0, title=title, description=description, severity="info", source="AI") # Default severity for AI insights
        else:
             # Handle cases where AI doesn't follow format
             return AIHealthAlert(id=0, title="AI Insight Available", description=text_response, severity="info", source="AI")

    except Exception as e:
        print(f"Error generating AI alert: {e}")
        return None # Or return an error alert

@router.get("/", response_model=List[AIHealthAlert])
def get_health_alerts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    alerts: List[AIHealthAlert] = []

    # Rule-based alerts (add your logic here later)
    # Example: check for upcoming appointments
    # upcoming_appointments = crud.get_upcoming_appointments(...)
    # if upcoming_appointments:
    #     alerts.append(AIHealthAlert(id=..., title="Upcoming Appointment", description="You have an appointment soon.", severity="info", source="Rule"))

    # AI-generated alerts
    active_pregnancy = crud.get_active_pregnancy_by_user_id(db=db, user_id=current_user.id)
    if active_pregnancy:
        current_week = active_pregnancy.current_week # Assuming you have this field or can calculate it
        recent_weight_logs = crud.get_weight_logs(db=db, user_id=current_user.id, pregnancy_id=active_pregnancy.id) # You might want to fetch only recent logs
        recent_symptom_logs = crud.get_symptom_logs(db=db, user_id=current_user.id, pregnancy_id=active_pregnancy.id) # You might want to fetch only recent logs

        ai_alert = generate_ai_health_alert(
            db=db,
            user_id=current_user.id,
            current_week=current_week,
            recent_weight_logs=recent_weight_logs,
            recent_symptom_logs=recent_symptom_logs
        )
        if ai_alert:
            alerts.append(ai_alert)

    # You can combine rule-based and AI alerts and sort them if needed
    return alerts
