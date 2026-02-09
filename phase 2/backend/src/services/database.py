from sqlmodel import create_engine, Session, SQLModel
from sqlalchemy.pool import QueuePool
from typing import Generator

from ..core.config import settings


# Create the database engine
engine = create_engine(
    settings.database_url,
    poolclass=QueuePool,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=300,
)


def get_session() -> Generator[Session, None, None]:
    """Get a database session."""
    with Session(engine) as session:
        yield session

# Import all models to ensure they are registered with SQLModel before table creation
from ..models.user import User
from ..models.task_model import Task

# Create all tables
SQLModel.metadata.create_all(bind=engine)