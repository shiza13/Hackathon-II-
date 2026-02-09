# Quickstart Guide: Backend API & Database Layer

**Feature**: Backend API & Database Layer for Todo Full-Stack Web Application
**Date**: 2026-01-10
**Branch**: 02-backend-api-database

## Overview

This quickstart guide provides the essential information needed to begin implementing the secure, JWT-protected REST API for todo task management using FastAPI, SQLModel, and Neon PostgreSQL.

## Prerequisites

- Python 3.11+
- Neon PostgreSQL database instance
- JWT authentication system from Spec 1
- Environment variables configured for database connection and JWT secrets

## Setup Instructions

### 1. Install Dependencies

```bash
pip install fastapi sqlmodel uvicorn python-multipart python-jose[cryptography] passlib[bcrypt] psycopg2-binary
```

### 2. Environment Variables

Create a `.env` file with the following variables:

```bash
DATABASE_URL="postgresql://username:password@neon-host.region.neon.tech/dbname"
JWT_SECRET_KEY="your-super-secret-jwt-signing-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Project Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   └── task_model.py          # SQLModel Task entity
│   ├── services/
│   │   ├── __init__.py
│   │   ├── database.py            # Database connection and session management
│   │   └── auth.py                # JWT verification dependency
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py                # Dependency injection utilities
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── tasks.py           # Task CRUD endpoints
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py              # Configuration and environment variables
│   │   └── security.py            # Security utilities
│   └── main.py                    # FastAPI app entry point
├── alembic/
├── tests/
├── requirements.txt
└── pyproject.toml
```

## Core Implementation Steps

### 1. Define the Task Model

Create `src/models/task_model.py`:

```python
from sqlmodel import SQLModel, Field
from typing import Optional
import uuid
from datetime import datetime

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)

class Task(TaskBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: str = Field(index=True)  # User ID from JWT
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})
```

### 2. Set Up Database Connection

Create `src/services/database.py`:

```python
from sqlmodel import create_engine, Session
from sqlalchemy.pool import QueuePool
import os

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=300
)

def get_session():
    with Session(engine) as session:
        yield session
```

### 3. Create JWT Authentication Dependency

Create `src/services/auth.py`:

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from typing import Optional
import os

security = HTTPBearer()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return verify_token(credentials.credentials)
```

### 4. Implement Task Endpoints

Create `src/api/v1/tasks.py`:

```python
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlmodel import Session, select
from src.models.task_model import Task, TaskBase
from src.services.database import get_session
from src.services.auth import get_current_user

router = APIRouter(prefix="/api/{user_id}", tags=["tasks"])

@router.post("/tasks", response_model=Task, status_code=status.HTTP_201_CREATED)
async def create_task(user_id: str, task_data: TaskBase, current_user: dict = Depends(get_current_user), session: Session = Depends(get_session)):
    # Verify user ID matches JWT
    if current_user.get("sub") != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: User ID mismatch")

    task = Task(**task_data.dict(), owner_id=user_id)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.get("/tasks", response_model=List[Task])
async def get_tasks(user_id: str, current_user: dict = Depends(get_current_user), session: Session = Depends(get_session)):
    # Verify user ID matches JWT
    if current_user.get("sub") != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: User ID mismatch")

    # Query only tasks owned by this user
    statement = select(Task).where(Task.owner_id == user_id)
    tasks = session.exec(statement).all()
    return tasks

@router.get("/tasks/{id}", response_model=Task)
async def get_task(user_id: str, id: str, current_user: dict = Depends(get_current_user), session: Session = Depends(get_session)):
    # Verify user ID matches JWT
    if current_user.get("sub") != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: User ID mismatch")

    statement = select(Task).where(Task.id == id, Task.owner_id == user_id)
    task = session.exec(statement).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/tasks/{id}", response_model=Task)
async def update_task(user_id: str, id: str, task_data: TaskBase, current_user: dict = Depends(get_current_user), session: Session = Depends(get_session)):
    # Verify user ID matches JWT
    if current_user.get("sub") != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: User ID mismatch")

    statement = select(Task).where(Task.id == id, Task.owner_id == user_id)
    task = session.exec(statement).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    for key, value in task_data.dict(exclude_unset=True).items():
        setattr(task, key, value)

    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.delete("/tasks/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(user_id: str, id: str, current_user: dict = Depends(get_current_user), session: Session = Depends(get_session)):
    # Verify user ID matches JWT
    if current_user.get("sub") != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: User ID mismatch")

    statement = select(Task).where(Task.id == id, Task.owner_id == user_id)
    task = session.exec(statement).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    session.delete(task)
    session.commit()

@router.patch("/tasks/{id}/complete", response_model=Task)
async def complete_task(user_id: str, id: str, completed_data: dict, current_user: dict = Depends(get_current_user), session: Session = Depends(get_session)):
    # Verify user ID matches JWT
    if current_user.get("sub") != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: User ID mismatch")

    statement = select(Task).where(Task.id == id, Task.owner_id == user_id)
    task = session.exec(statement).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.completed = completed_data.get('completed', task.completed)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
```

### 5. Main Application Entry Point

Create `src/main.py`:

```python
from fastapi import FastAPI
from src.api.v1.tasks import router as tasks_router

app = FastAPI(title="Todo API", version="1.0.0")

# Include routers
app.include_router(tasks_router)

@app.get("/")
def read_root():
    return {"message": "Todo API is running"}

@app.on_event("startup")
def on_startup():
    # Initialize database tables
    from sqlmodel import SQLModel
    from src.services.database import engine
    SQLModel.metadata.create_all(bind=engine)
```

## Running the Application

### Development
```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### With Alembic for Migrations
```bash
alembic init alembic
alembic revision --autogenerate -m "Initial task table"
alembic upgrade head
```

## API Usage Examples

### Create a Task
```bash
curl -X POST http://localhost:8000/api/user123/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, bread, eggs"}'
```

### Get All Tasks
```bash
curl -X GET http://localhost:8000/api/user123/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update a Task
```bash
curl -X PUT http://localhost:8000/api/user123/tasks/task-id-here \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated task", "completed": true}'
```

## Security Considerations

- All endpoints require valid JWT authentication
- User ID in JWT is compared with user_id in URL path
- All database queries are filtered by owner_id
- Input validation is performed at API and database levels
- Error responses don't leak sensitive information