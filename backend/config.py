from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str
    REDIS_HOST: str
    REDIS_PORT: str
    REDIS_TIMEOUT: int
    SMTP_SERVER: str
    SMTP_PORT: int
    SMTP_USER: str
    SMTP_DISPLAY_NAME: str
    SMTP_PASSWORD: str
    STORAGE_URL: str
    STORAGE_ACCESS_KEY: str
    STORAGE_SECRET_KEY: str

    model_config = SettingsConfigDict(
        env_file=Path(__file__).parent / ".env",
        env_file_encoding='utf-8',
        extra='ignore'
    )

    def get_async_db_url(self) -> str:
        if self.DB_HOST == 'localhost':
            return f'sqlite+aiosqlite:///./{self.DB_NAME}.db'
        return (f"mssql+aioodbc://{self.DB_USER}:{self.DB_PASSWORD}@"
                f"{self.DB_HOST}/{self.DB_NAME}?"
                f"driver=ODBC+Driver+17+for+SQL+Server")


    def get_redis_url(self) -> str:
        return f'redis://{self.REDIS_HOST}:{self.REDIS_PORT}'


    def get_redis_timeout(self) -> int:
        return self.REDIS_TIMEOUT


    def get_aiosmtp_settings(self) -> dict:
        return {
            'hostname': self.SMTP_SERVER,
            'port': self.SMTP_PORT,
            'username': self.SMTP_USER,
            'password': self.SMTP_PASSWORD,
        }


    def get_smtp_display_name(self) -> str:
        return self.SMTP_DISPLAY_NAME


    def get_storage_settings(self) -> dict:
        return {
            'endpoint': self.STORAGE_URL,
            'access_key': self.STORAGE_ACCESS_KEY,
            'secret_key': self.STORAGE_SECRET_KEY,
            'secure': False,
        }


settings = Settings()