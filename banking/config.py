from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Manages application configuration."""
    DATABASE_URL: str = "sqlite:///./smartbank.db"
    SECRET_KEY: str = "your-super-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
