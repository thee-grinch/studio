from fastapi import APIRouter, Depends
from pydantic import BaseModel

router = APIRouter(
    prefix="/contact",
    tags=["contact"],
)

class ContactForm(BaseModel):
    name: str
    email: str
    subject: str
    message: str

@router.post("/")
async def submit_contact_form(form_data: ContactForm):
    """
    Receives and processes contact form submissions.
    For now, just prints the received data.
    """
    print("Received contact form submission:")
    print(f"Name: {form_data.name}")
    print(f"Email: {form_data.email}")
    print(f"Subject: {form_data.subject}")
    print(f"Message: {form_data.message}")

    # TODO: Add logic here to store the data in the database, send an email, etc.

    return {"message": "Contact form submitted successfully (data printed to console)."}