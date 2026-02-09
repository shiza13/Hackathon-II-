from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Annotated

from src.models.user import User
from src.services.database import get_session
from src.api.deps import get_current_user_id, get_current_user
from src.services.auth_service import verify_user_owns_resource

user_router = APIRouter()

@user_router.get("/users/{user_id}")
async def get_user_profile(
    user_id: str,
    session: Annotated[Session, Depends(get_session)],
    current_user_id: str = Depends(get_current_user_id)
):
    # Verify that the current user is trying to access their own profile
    if not verify_user_owns_resource(current_user_id, user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You can only access your own profile"
        )

    # Get the user from the database
    user = session.exec(select(User).where(User.id == user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {
        "id": user.id,
        "email": user.email,
        "created_at": user.created_at,
        "updated_at": user.updated_at
    }

@user_router.put("/users/{user_id}")
async def update_user_profile(
    user_id: str,
    session: Annotated[Session, Depends(get_session)],
    current_user_id: str = Depends(get_current_user_id)
):
    # Verify that the current user is trying to update their own profile
    if not verify_user_owns_resource(current_user_id, user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You can only update your own profile"
        )

    # Get the user from the database
    user = session.exec(select(User).where(User.id == user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Update logic would go here
    return {"message": "Profile updated successfully", "user_id": user.id}