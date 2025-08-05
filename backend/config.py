from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "fhjrtjhfghgfjhngjnyyhy"
    ALGORITHM: str = "HS256" # Default algorithm

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()