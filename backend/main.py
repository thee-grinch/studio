from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from backend.routers import auth, pregnancy, weight_logs, appointments, symptom_logs

DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def create_tables():
    Base.metadata.create_all(bind=engine)

app = FastAPI(dependencies=[]) # Remove the router-level dependency

app.include_router(auth.router, prefix="/auth", tags=["auth"], dependencies=[]) # Ensure no dependency here either
app.include_router(pregnancy.router, prefix="/pregnancy", tags=["pregnancy"], dependencies=[])
app.include_router(weight_logs.router, prefix="/weight-logs", tags=["weight logs"], dependencies=[])
app.include_router(appointments.router, prefix="/appointments", tags=["appointments"], dependencies=[])
app.include_router(symptom_logs.router, prefix="/symptom-logs", tags=["symptom logs"], dependencies=[])

@app.on_event("startup")
def on_startup():
    create_tables()

@app.get("/")
def read_root():
    return {"Hello": "World"}