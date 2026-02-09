from sqlmodel import Session, select
from passlib.context import CryptContext
from src.models.user import User

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def authenticate_user(session: Session, email: str, password: str) -> User:
    user = session.exec(select(User).where(User.email == email)).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

def extract_user_identity_from_token_payload(token_payload: dict) -> dict:
    """
    Extract user identity information from JWT token payload
    """
    return {
        "user_id": token_payload.get("user_id"),
        "email": token_payload.get("email")
    }

def verify_user_owns_resource(user_id: str, resource_user_id: str) -> bool:
    """
    Verify that the authenticated user owns the resource they're trying to access
    """
    return user_id == resource_user_id