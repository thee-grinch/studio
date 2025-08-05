from fastapi import APIRouter, Depends
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import google.generativeai as genai
import os

from sqlalchemy.orm import Session

from backend.crud import user as crud
from ..dependencies import get_current_user, get_db
from ..schemas.ai import ChatMessageRequest, ChatMessageResponse, HealthDataRequest, AIHealthAlert
from backend.models.user import User

router = APIRouter(
    prefix="/ai",
    tags=["ai"],
)

@router.post("/chat")
async def chat_with_ai(
    message_request: ChatMessageRequest,
    current_user: User = Depends(get_current_user), # Assuming crud.get_current_user returns a User model
    db: Session = Depends(get_db)
):
    try:
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel('gemini-pro')
        # In a real application, you'd likely pass conversation history for context
        response = model.generate_content(message_request.message)
        # Assuming the AI response is in response.text
        ai_response_text = response.text if response.text else "No response from AI."
        return {"response": ai_response_text}
    except Exception as e:
        # Log the error for debugging
        print(f"Error interacting with Gemini API: {e}")
        raise HTTPException(status_code=500, detail="Failed to get response from AI.")


from typing import List
import json


@router.post("/generate-alert")
async def generate_health_alert(
    health_data: HealthDataRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    promptT = f""""Analyze the following user health data for a pregnant individual and provide a concise health alert or insight.Focus on potential issues, recommendations, or interesting observations based on the provided data.If there are no significant issues, provide a positive reinforcement or general tip.Format the response as a JSON object with two fields: "title" (string, short title) and "description" string, brief explanation or recommendation).Current Week of Pregnancy: {health_data.current_week} Recent Symptoms: {health_data.recent_symptom_logs} Recent Weight Logs: {health_data.recent_weight_logs}"""
    try:
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel('gemini-pro')

        prompt = promptT

        response = model.generate_content(prompt)
        ai_response_text = response.text.strip() if response.text else "{}"

        try:
            # Attempt to parse the AI's JSON response
            ai_alert_data = json.loads(ai_response_text)
            ai_alert = AIHealthAlert(
                id=0,  # ID will be assigned when stored in DB or when returned
                title=ai_alert_data.get("title", "AI Insight"),
                description=ai_alert_data.get("description", "No specific insight generated."),
                source="AI"
            )
            return JSONResponse(content=ai_alert.model_dump())
        except json.JSONDecodeError:
            # Handle cases where the AI doesn't return valid JSON
            raise HTTPException(status_code=500, detail="AI did not return a valid alert format.")
    except Exception as e:
        # Log the error for debugging
        print(f"Error generating AI alert: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate AI alert.")
    # For now, returning a simple message
    return {"alert_message": "AI alert generation is being processed."}

@router.get("/health-alerts", response_model=List[AIHealthAlert])
def get_health_alerts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # This endpoint should ideally fetch *stored* or *dynamically generated* alerts.
    # For now, let's return a hardcoded mock alert as a placeholder
    # and the POST /generate-alert will be triggered separately.
    return [
        AIHealthAlert(id=1, title="Sample AI Alert", description="This is a placeholder AI-generated alert.", source="AI")
    ]