from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Annotated
from passlib.context import CryptContext
from dotenv import load_dotenv
import os

from src.models.user import User, UserCreate
from src.models.auth import LoginRequest, SignupRequest, LoginResponse, SignupResponse
from src.services.database import get_session
from src.services.jwt_service import create_access_token
from src.services.auth_service import authenticate_user, get_password_hash
from src.api.deps import get_current_user, get_current_user_id
from src.middleware.jwt_verification import require_authenticated_user

# Load environment variables
load_dotenv()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Initialize router
auth_router = APIRouter()

@auth_router.post("/signup", response_model=SignupResponse)
async def signup(user_data: SignupRequest, session: Annotated[Session, Depends(get_session)]):
    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    # Hash the password
    hashed_password = get_password_hash(user_data.password)

    # Create new user
    db_user = User(
        email=user_data.email,
        hashed_password=hashed_password
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    # Create access token
    access_token = create_access_token(
        data={"user_id": str(db_user.id), "email": db_user.email}
    )

    return SignupResponse(
        user_id=str(db_user.id),
        email=db_user.email,
        message="User created successfully"
    )

@auth_router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest, session: Annotated[Session, Depends(get_session)]):
    user = authenticate_user(session, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"user_id": str(user.id), "email": user.email}
    )

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=str(user.id),
        email=user.email
    )

@auth_router.post("/logout")
async def logout():
    # In a stateless JWT system, logout is typically handled on the client side
    # by removing the token from storage. Here we just return a success message.
    return {"message": "Logged out successfully"}

@auth_router.get("/me")
async def get_current_user_data(current_user: dict = Depends(get_current_user)):
    # This endpoint is protected by JWT middleware
    # The user identity is extracted from the token via the dependency
    return {
        "id": current_user["user_id"],
        "email": current_user["email"]
    }