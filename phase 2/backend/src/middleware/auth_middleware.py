"""
Stateless authentication middleware implementation.
This module ensures that authentication is stateless (no server-side session storage)
and that JWT tokens are properly verified for each request.
"""

from fastapi import HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Optional
from jose import JWTError, jwt
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# JWT configuration
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "your-super-secret-jwt-key-here")
ALGORITHM = "HS256"

security = HTTPBearer()

async def verify_jwt_token(credentials: HTTPAuthorizationCredentials = None) -> Optional[Dict]:
    """
    Verify JWT token and return user data if valid.
    Returns None if token is invalid or missing.
    """
    if not credentials:
        return None

    token = credentials.credentials

    try:
        # Decode the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id: str = payload.get("user_id")
        email: str = payload.get("email")

        if user_id is None or email is None:
            return None

        # Check if token is expired
        exp = payload.get("exp")
        if exp and jwt.get_unverified_claims(token).get("exp", 0) < jwt.JWTClaimsSet().current_timestamp():
            return None

        return {"user_id": user_id, "email": email}

    except JWTError:
        return None
    except Exception:
        return None

async def require_authenticated_user(credentials: HTTPAuthorizationCredentials = security) -> Dict:
    """
    Dependency that requires an authenticated user.
    Raises HTTPException if no valid token is provided.
    """
    user_data = await verify_jwt_token(credentials)

    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_data

def configure_stateless_auth():
    """
    Configure stateless authentication settings.
    This function is a placeholder to document that authentication is stateless.
    """
    # The stateless nature is enforced by using JWT tokens that contain all necessary user data
    # and are verified on each request without server-side session storage
    pass