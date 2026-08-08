from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, validator, field_validator


class Settings(BaseSettings):
    PROJECT_NAME: str = "Disaster Intelligence & Emergency Response Coordination Platform"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"

    # Security
    SECRET_KEY: str = "disaster-intelligence-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # Database
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "disaster_intelligence_db"

    # AI & Integrations
    AI_PROVIDER: str = "mock"  # gemini, openai, or mock
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    ANTIGRAVITY_AI_API_KEY: str = "mock-antigravity-key"
    ANTIGRAVITY_AI_ENDPOINT: str = "https://api.antigravity.ai/v1/analyze"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
