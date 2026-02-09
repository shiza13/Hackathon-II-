import pytest
from fastapi.testclient import TestClient
from sqlmodel import create_engine, Session
from sqlmodel.pool import StaticPool

from src.main import create_app
from src.services.database import engine as original_engine
from src.core.config import settings


@pytest.fixture(name="engine")
def fixture_engine():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    yield engine


@pytest.fixture(name="app")
def fixture_app(engine):
    # Override the database URL for tests
    settings.database_url = "sqlite:///:memory:"

    app = create_app()
    yield app


@pytest.fixture(name="client")
def fixture_client(app):
    with TestClient(app) as client:
        yield client


@pytest.fixture(name="session")
def fixture_session(engine):
    with Session(engine) as session:
        yield session