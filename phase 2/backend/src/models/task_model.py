from sqlmodel import SQLModel, Field
from typing import Optional
import uuid
from datetime import datetime


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000, nullable=True)
    completed: bool = Field(default=False)


class Task(TaskBase, table=True):
    """
    Task model representing a user's todo item with core properties and metadata.
    """
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: str = Field(index=True)  # User ID from JWT, indexed for efficient queries
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TaskCreate(TaskBase):
    """Schema for creating a new task."""
    pass


class TaskRead(TaskBase):
    """Schema for reading a task with its metadata."""
    id: uuid.UUID
    owner_id: str
    created_at: datetime
    updated_at: datetime


class TaskUpdate(SQLModel):
    """Schema for updating a task."""
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = None


class TaskComplete(SQLModel):
    """Schema for updating task completion status."""
    completed: bool