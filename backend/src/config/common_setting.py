import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_DB_URI: str
    PPLX_API_KEY: str
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env" 

settings = Settings()
