from pydantic import BaseModel

class HealthAlert(BaseModel):
    id: int
    title: str
    description: str