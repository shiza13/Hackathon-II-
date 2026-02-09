from pydantic_settings import BaseSettings
from pydantic import ConfigDict


class Settings(BaseSettings):
    # REQUIRED
    database_url: str
    jwt_secret_key: str
    

    # OPTIONAL (because they exist in .env.example)
    better_auth_secret: str | None = None
    next_public_better_auth_url: str | None = None

    model_config = ConfigDict(
        env_file=".env.example",
        extra="allow"   # this avoids crashes if extra env vars exist
    )


settings = Settings()
