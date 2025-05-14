from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    MONGO_DB_URI: str
    PPLX_API_KEY: str
    JWT_HASH_KEY: str
    SENDGRID_API_KEY: str
    ENABLE_LOGGING: str
    AWS_ACCESS_KEY_ID: str
    AWS_ACCESS_KEY: str
    ENVIRONMENT: str = "development"

    model_config = SettingsConfigDict(env_file=".env") 

settings = Settings()
