from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from . import database, models, crud, schemas # Adjust imports based on your structure
from .config import settings # Assuming you have a settings file for JWT secret key

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login") # Adjust the tokenUrl if needed

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Replace with your actual JWT decoding logic and secret key from settings
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        # Assuming you have a user CRUD function to get user by email
        user = crud.user.get_user_by_email(db, email=email) # Adjust crud.user based on your structure
        if user is None:
            raise credentials_exception
        # You might want to return a Pydantic model here instead of the SQLAlchemy model
        return user # Or schemas.UserPublic.model_validate(user) if using Pydantic
    except JWTError:
        raise credentials_exception
