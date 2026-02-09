# Authentication System Documentation

## Overview
This document describes the authentication system for the Todo Full-Stack Web Application. The system implements a secure, stateless JWT-based authentication flow using Better Auth principles.

## Architecture

### Backend (FastAPI)
- **Framework**: FastAPI
- **Authentication**: JWT tokens with HS256 algorithm
- **Database**: SQLModel with Neon PostgreSQL
- **Password Hashing**: bcrypt via passlib

### Frontend (Next.js)
- **Framework**: Next.js 16+ with App Router
- **Authentication Client**: Custom implementation with automatic JWT handling
- **Token Storage**: Local storage with security considerations

## JWT Token Structure
When a user successfully authenticates, a JWT token is issued containing:
- `user_id`: The unique identifier for the user
- `email`: The user's email address
- `exp`: Token expiration timestamp
- `iat`: Token issued at timestamp

## API Endpoints

### Authentication Endpoints
- `POST /auth/signup` - Create a new user account
- `POST /auth/login` - Authenticate a user and return JWT token
- `POST /auth/logout` - Logout the current user
- `GET /auth/me` - Get information about the currently authenticated user

### Protected Endpoints
- `GET /api/users/{user_id}` - Get user profile (requires authentication and user ID verification)
- `PUT /api/users/{user_id}` - Update user profile (requires authentication and user ID verification)

## Security Features

### Stateless Authentication
The system implements stateless authentication where:
- No server-side session storage is used
- All necessary user data is contained within the JWT token
- Tokens are verified using a shared secret (BETTER_AUTH_SECRET)

### User Data Isolation
- Each user can only access their own data
- Resource endpoints verify that the authenticated user owns the requested resource
- 403 Forbidden responses for unauthorized access attempts

### Password Security
- Passwords are hashed using bcrypt with configurable work factor
- Plain text passwords are never stored in the database
- Secure password comparison using constant-time algorithms

## Frontend Integration

### Automatic Token Handling
The frontend API client automatically:
- Attaches JWT tokens to requests in the Authorization header
- Handles 401 Unauthorized responses by redirecting to login
- Stores tokens securely in local storage

### Validation
- Email format validation using standard regex
- Password strength validation (minimum 6 characters)
- Error handling for various authentication failure scenarios

## Configuration

### Environment Variables
The system requires the following environment variables:

Backend (.env):
```
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here
DATABASE_URL=postgresql://username:password@host:port/database_name
```

Frontend (next.config.js):
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Error Handling

### Common Error Responses
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid or missing authentication credentials
- `403 Forbidden`: Valid authentication but insufficient permissions
- `404 Not Found`: Requested resource does not exist

## Testing Considerations

### Security Testing
- Verify JWT tokens cannot be forged
- Confirm that user data isolation prevents cross-user access
- Test that expired tokens are properly rejected
- Validate that authentication is required for protected endpoints

### Integration Testing
- End-to-end authentication flow (signup → login → protected access → logout)
- Token refresh/rotation scenarios (if implemented)
- Error condition handling