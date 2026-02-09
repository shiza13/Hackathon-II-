import pytest
from uuid import UUID
from datetime import datetime
from src.models.task_model import Task, TaskCreate, TaskRead, TaskUpdate


def test_task_creation():
    """Test creating a Task instance."""
    task = Task(
        title="Test Task",
        description="Test Description",
        completed=False,
        owner_id="user123"
    )

    assert task.title == "Test Task"
    assert task.description == "Test Description"
    assert task.completed is False
    assert task.owner_id == "user123"
    assert isinstance(task.id, UUID)
    assert isinstance(task.created_at, datetime)
    assert isinstance(task.updated_at, datetime)


def test_task_default_values():
    """Test default values for Task."""
    task = Task(
        title="Test Task",
        owner_id="user123"
    )

    assert task.title == "Test Task"
    assert task.description is None
    assert task.completed is False
    assert task.owner_id == "user123"


def test_task_create_schema():
    """Test TaskCreate schema."""
    task_create = TaskCreate(
        title="Test Task",
        description="Test Description",
        completed=True
    )

    assert task_create.title == "Test Task"
    assert task_create.description == "Test Description"
    assert task_create.completed is True


def test_task_create_required_fields():
    """Test that TaskCreate requires title."""
    with pytest.raises(ValueError):
        TaskCreate()


def test_task_read_schema():
    """Test TaskRead schema."""
    from uuid import uuid4

    task_read = TaskRead(
        id=uuid4(),
        title="Test Task",
        description="Test Description",
        completed=True,
        owner_id="user123",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    assert task_read.title == "Test Task"
    assert task_read.description == "Test Description"
    assert task_read.completed is True
    assert task_read.owner_id == "user123"


def test_task_update_schema():
    """Test TaskUpdate schema."""
    task_update = TaskUpdate(
        title="Updated Task",
        description="Updated Description",
        completed=True
    )

    assert task_update.title == "Updated Task"
    assert task_update.description == "Updated Description"
    assert task_update.completed is True


def test_task_update_partial():
    """Test partial updates with TaskUpdate."""
    task_update = TaskUpdate(title="Updated Title")

    assert task_update.title == "Updated Title"
    assert task_update.description is None
    assert task_update.completed is None


def test_task_field_validation():
    """Test field validation for Task."""
    # Test title length validation
    with pytest.raises(ValueError):
        Task(
            title="",  # Too short
            owner_id="user123"
        )

    # Test title length validation (too long)
    with pytest.raises(ValueError):
        Task(
            title="a" * 256,  # Too long
            owner_id="user123"
        )