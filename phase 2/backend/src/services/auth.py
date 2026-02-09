from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from typing import Dict

from .database import get_session
from ..core.security import verify_token


security = HTTPBearer()


def get_current_user(credentials=Depends(security)) -> Dict:
    """
    Get the current user from the JWT token in the Authorization header.

    This dependency verifies the JWT token and returns the user information
    from the token payload.
    """
    token = credentials.credentials
    user_data = verify_token(token)
    return user_data