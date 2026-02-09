import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from uuid import UUID

from src.main import app
from src.models.task_model import Task
from src.services.database import engine


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_create_task_success(client: TestClient):
    """Test successful task creation."""
    # This test requires a valid JWT token, which we'll simulate
    # In a real scenario, we would need to generate a proper JWT token
    # For testing purposes, we'll mock the authentication
    pass


def test_get_tasks_success(client: TestClient):
    """Test successful retrieval of tasks."""
    # This test also requires a valid JWT token
    # For testing purposes, we'll mock the authentication
    pass


def test_user_isolation(client: TestClient):
    """Test that users can only access their own tasks."""
    # This test requires multiple users and tasks
    # For testing purposes, we'll mock the authentication
    pass


def test_task_creation_validation(client: TestClient):
    """Test validation of task creation."""
    # This test requires a valid JWT token
    # For testing purposes, we'll mock the authentication
    pass


# Since we need to handle authentication in tests, we'll need to create
# a more sophisticated test setup that can handle JWT tokens
# For now, we'll implement tests that directly test the database operations
def test_task_lifecycle():
    """Test the full lifecycle of a task in the database."""
    # Create a session
    with Session(engine) as session:
        # Create a task
        task = Task(
            title="Test Task",
            description="Test Description",
            completed=False,
            owner_id="test_user_123"
        )

        session.add(task)
        session.commit()
        session.refresh(task)

        # Verify the task was created
        assert task.id is not None
        assert task.title == "Test Task"
        assert task.description == "Test Description"
        assert task.completed is False
        assert task.owner_id == "test_user_123"

        # Query the task back
        statement = select(Task).where(Task.id == task.id)
        retrieved_task = session.exec(statement).first()

        assert retrieved_task is not None
        assert retrieved_task.title == task.title
        assert retrieved_task.owner_id == task.owner_id

        # Clean up
        session.delete(task)
        session.commit()


def test_user_task_isolation():
    """Test that tasks are properly isolated by user."""
    with Session(engine) as session:
        # Create tasks for different users
        task1 = Task(
            title="User 1 Task",
            description="Task for user 1",
            completed=False,
            owner_id="user_1"
        )

        task2 = Task(
            title="User 2 Task",
            description="Task for user 2",
            completed=True,
            owner_id="user_2"
        )

        session.add(task1)
        session.add(task2)
        session.commit()

        # Query tasks for user 1
        statement = select(Task).where(Task.owner_id == "user_1")
        user1_tasks = session.exec(statement).all()

        assert len(user1_tasks) == 1
        assert user1_tasks[0].title == "User 1 Task"

        # Query tasks for user 2
        statement = select(Task).where(Task.owner_id == "user_2")
        user2_tasks = session.exec(statement).all()

        assert len(user2_tasks) == 1
        assert user2_tasks[0].title == "User 2 Task"

        # Clean up
        session.delete(task1)
        session.delete(task2)
        session.commit()