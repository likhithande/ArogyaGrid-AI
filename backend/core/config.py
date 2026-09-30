import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "ArogyaGrid AI"
    API_PREFIX: str = "/api"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    DEMO_MODE: bool = True

settings = Settings()
