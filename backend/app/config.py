import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, List

# Explicitly discover and load .env files in priority order
_current_dir = Path(__file__).resolve().parent # backend/app
_backend_dir = _current_dir.parent            # backend
_root_dir = _backend_dir.parent               # project root

_candidate_env_files = [
    _backend_dir / ".env",
    _root_dir / ".env",
    _backend_dir / ".env.txt"
]

for _env_path in _candidate_env_files:
    if _env_path.exists():
        load_dotenv(dotenv_path=_env_path, override=True)

class Settings(BaseSettings):
    PROJECT_NAME: str = "PayPal ResolveAI Backend"
    API_V1_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{_backend_dir / 'resolveai.db'}")

    # Hosted AI Model Configuration
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)
    AI_MODEL_PROVIDER: str = os.getenv("AI_MODEL_PROVIDER", "gemini")
    AI_MODEL_NAME: str = os.getenv("AI_MODEL_NAME", "gemini-flash-lite-latest")

    # PayPal Sandbox Configuration (Server-Side)
    PAYPAL_ENV: str = os.getenv("PAYPAL_ENV", "sandbox")
    PAYPAL_CLIENT_ID: Optional[str] = os.getenv("PAYPAL_CLIENT_ID", None)
    PAYPAL_CLIENT_SECRET: Optional[str] = os.getenv("PAYPAL_CLIENT_SECRET", None)

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8000"
    ]

    @property
    def allowed_cors_origins(self) -> List[str]:
        origins = list(self.CORS_ORIGINS)
        custom_origins = os.getenv("ALLOWED_ORIGINS") or os.getenv("CORS_ORIGINS")
        if custom_origins:
            for o in custom_origins.split(","):
                o_clean = o.strip()
                if o_clean and o_clean not in origins:
                    origins.append(o_clean)
        return origins

    @property
    def PAYPAL_API_BASE(self) -> str:
        env = (self.PAYPAL_ENV or "sandbox").lower()
        return "https://api-m.sandbox.paypal.com" if env == "sandbox" else "https://api-m.paypal.com"

    def is_ai_configured(self) -> bool:
        return bool(self.GEMINI_API_KEY and len(self.GEMINI_API_KEY.strip()) > 5)

    def is_paypal_configured(self) -> bool:
        if not self.PAYPAL_CLIENT_ID or not self.PAYPAL_CLIENT_SECRET:
            return False
        cid = self.PAYPAL_CLIENT_ID.strip()
        csec = self.PAYPAL_CLIENT_SECRET.strip()
        if len(cid) < 5 or len(csec) < 5:
            return False
        if "PLACEHOLDER" in csec or "your_" in csec:
            return False
        return True

    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env", "backend/.env.txt"),
        extra="allow"
    )

settings = Settings()
