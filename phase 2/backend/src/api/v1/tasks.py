from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from uuid import UUID
from pydantic import ValidationError

from ...models.task_model import Task, TaskCreate, TaskRead, TaskUpdate, TaskComplete
from ...services.database import get_session
from ...services.auth import get_current_user
from ...api.deps import validate_user_owns_resource


# Define error response format
def create_error_response(code: str, message: str, details: str = None):
    error_response = {
        "error": {
            "code": code,
            "message": message
        }
    }
    if details:
        error_response["error"]["details"] = details
    return error_response


router = APIRouter()


@router.post("/{user_id}/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    user_id: str,
    task_data: TaskCreate,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new task for the specified user.

    The user_id in the URL must match the authenticated user's ID from the JWT token.
    """
    try:
        # Validate that the authenticated user is the same as the one in the URL
        authenticated_user_id = current_user.get("sub")
        if authenticated_user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User ID in token does not match URL user ID"
            )

        # Create the task with the owner_id set to the authenticated user
        task = Task(
            title=task_data.title,
            description=task_data.description,
            completed=task_data.completed,
            owner_id=user_id
        )

        session.add(task)
        session.commit()
        session.refresh(task)

        return task
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=create_error_response("VALIDATION_ERROR", str(e))
        )
    except HTTPException:
        # Re-raise HTTP exceptions as they are
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=create_error_response("INTERNAL_ERROR", "An unexpected error occurred")
        )


@router.get("/{user_id}/tasks", response_model=List[TaskRead])
async def get_tasks(
    user_id: str,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Get all tasks for the specified user.

    Only returns tasks that belong to the authenticated user.
    """
    try:
        # Validate that the authenticated user is the same as the one in the URL
        authenticated_user_id = current_user.get("sub")
        if authenticated_user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User ID in token does not match URL user ID"
            )

        # Query only tasks owned by this user
        statement = select(Task).where(Task.owner_id == user_id)
        tasks = session.exec(statement).all()

        return tasks
    except HTTPException:
        # Re-raise HTTP exceptions as they are
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=create_error_response("INTERNAL_ERROR", "An unexpected error occurred")
        )


@router.get("/{user_id}/tasks/{task_id}", response_model=TaskRead)
async def get_task(
    user_id: str,
    task_id: UUID,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Get a specific task by ID for the specified user.

    Validates that the task belongs to the authenticated user.
    """
    try:
        # Validate that the authenticated user is the same as the one in the URL
        authenticated_user_id = current_user.get("sub")
        if authenticated_user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User ID in token does not match URL user ID"
            )

        # Query for the specific task owned by this user
        statement = select(Task).where(Task.id == task_id, Task.owner_id == user_id)
        task = session.exec(statement).first()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=create_error_response("TASK_NOT_FOUND", f"Task with ID {task_id} not found for user {user_id}")
            )

        return task
    except HTTPException:
        # Re-raise HTTP exceptions as they are
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=create_error_response("INTERNAL_ERROR", "An unexpected error occurred")
        )


@router.put("/{user_id}/tasks/{task_id}", response_model=TaskRead)
async def update_task(
    user_id: str,
    task_id: UUID,
    task_data: TaskUpdate,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Update a specific task by ID for the specified user.

    Validates that the task belongs to the authenticated user.
    """
    try:
        # Validate that the authenticated user is the same as the one in the URL
        authenticated_user_id = current_user.get("sub")
        if authenticated_user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User ID in token does not match URL user ID"
            )

        # Query for the specific task owned by this user
        statement = select(Task).where(Task.id == task_id, Task.owner_id == user_id)
        task = session.exec(statement).first()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=create_error_response("TASK_NOT_FOUND", f"Task with ID {task_id} not found for user {user_id}")
            )

        # Update the task with provided data
        for field, value in task_data.dict(exclude_unset=True).items():
            setattr(task, field, value)

        session.add(task)
        session.commit()
        session.refresh(task)

        return task
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=create_error_response("VALIDATION_ERROR", str(e))
        )
    except HTTPException:
        # Re-raise HTTP exceptions as they are
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=create_error_response("INTERNAL_ERROR", "An unexpected error occurred")
        )


@router.delete("/{user_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    user_id: str,
    task_id: UUID,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a specific task by ID for the specified user.

    Validates that the task belongs to the authenticated user.
    """
    try:
        # Validate that the authenticated user is the same as the one in the URL
        authenticated_user_id = current_user.get("sub")
        if authenticated_user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User ID in token does not match URL user ID"
            )

        # Query for the specific task owned by this user
        statement = select(Task).where(Task.id == task_id, Task.owner_id == user_id)
        task = session.exec(statement).first()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=create_error_response("TASK_NOT_FOUND", f"Task with ID {task_id} not found for user {user_id}")
            )

        session.delete(task)
        session.commit()

        # Return 204 No Content as per HTTP standards
        return
    except HTTPException:
        # Re-raise HTTP exceptions as they are
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=create_error_response("INTERNAL_ERROR", "An unexpected error occurred")
        )


@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=TaskRead)
async def update_task_completion(
    user_id: str,
    task_id: UUID,
    completion_data: TaskComplete,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Update the completion status of a specific task by ID for the specified user.

    Validates that the task belongs to the authenticated user.
    """
    try:
        # Validate that the authenticated user is the same as the one in the URL
        authenticated_user_id = current_user.get("sub")
        if authenticated_user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User ID in token does not match URL user ID"
            )

        # Query for the specific task owned by this user
        statement = select(Task).where(Task.id == task_id, Task.owner_id == user_id)
        task = session.exec(statement).first()

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=create_error_response("TASK_NOT_FOUND", f"Task with ID {task_id} not found for user {user_id}")
            )

        # Update the completion status
        task.completed = completion_data.completed

        session.add(task)
        session.commit()
        session.refresh(task)

        return task
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=create_error_response("VALIDATION_ERROR", str(e))
        )
    except HTTPException:
        # Re-raise HTTP exceptions as they are
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=create_error_response("INTERNAL_ERROR", "An unexpected error occurred")
        )