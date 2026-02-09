from fastapi import HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from fastapi import Depends

from src.services.jwt_service import verify_token

security = HTTPBearer()

async def user_isolation_middleware(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Middleware to verify that a user can only access their own resources
    """
    token = credentials.credentials
    user_data = verify_token(token)

    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_data

async def verify_user_owns_resource(user_data: dict, resource_user_id: str):
    """
    Verify that the authenticated user owns the resource they're trying to access
    """
    if user_data["user_id"] != resource_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You can only access your own resources"
        )