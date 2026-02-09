"""Unit tests for authentication service functions"""

import pytest
from unittest.mock import Mock, MagicMock
from sqlmodel import Session, select
from src.models.user import User
from src.services.auth_service import authenticate_user, verify_password, get_password_hash

def test_get_password_hash():
    """Test that password hashing works correctly"""
    password = "test_password"
    hashed = get_password_hash(password)

    # Verify it's not the same as original
    assert hashed != password

    # Verify it can be verified
    assert verify_password(password, hashed) == True

def test_verify_password_invalid():
    """Test that invalid passwords are rejected"""
    password = "test_password"
    wrong_password = "wrong_password"
    hashed = get_password_hash(password)

    assert verify_password(wrong_password, hashed) == False

def test_authenticate_user_success(mocker):
    """Test successful user authentication"""
    # Mock the database session
    mock_session = Mock(spec=Session)

    # Create a mock user
    mock_user = User(
        id="test-id",
        email="test@example.com",
        hashed_password=get_password_hash("valid_password")
    )

    # Mock the exec method to return our mock user
    mock_exec_result = Mock()
    mock_exec_result.first.return_value = mock_user
    mock_session.exec.return_value = mock_exec_result

    # Test authentication
    result = authenticate_user(mock_session, "test@example.com", "valid_password")

    assert result is not None
    assert result.email == "test@example.com"

def test_authenticate_user_wrong_password(mocker):
    """Test authentication with wrong password"""
    mock_session = Mock(spec=Session)

    mock_user = User(
        id="test-id",
        email="test@example.com",
        hashed_password=get_password_hash("valid_password")
    )

    mock_exec_result = Mock()
    mock_exec_result.first.return_value = mock_user
    mock_session.exec.return_value = mock_exec_result

    # Test with wrong password
    result = authenticate_user(mock_session, "test@example.com", "wrong_password")

    assert result is None

def test_authenticate_user_not_found(mocker):
    """Test authentication with non-existent user"""
    mock_session = Mock(spec=Session)

    mock_exec_result = Mock()
    mock_exec_result.first.return_value = None  # User not found
    mock_session.exec.return_value = mock_exec_result

    result = authenticate_user(mock_session, "nonexistent@example.com", "any_password")

    assert result is None