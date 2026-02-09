# Data Model: Frontend Application & Integration

**Feature**: Frontend Application & Integration for Todo Full-Stack Web Application
**Date**: 2026-02-05
**Branch**: 03-frontend-app-integration

## Entity Models

### User Entity (Frontend Representation)

**Definition**: Represents the authenticated user state in the frontend application

**Fields**:
- `id`: String, unique identifier from authentication provider
- `email`: String, user's email address
- `name`: String, optional user's full name
- `isLoggedIn`: Boolean, authentication status
- `token`: String, JWT token for API authentication
- `expiresAt`: DateTime, token expiration time

**State Transitions**:
- Unauthenticated → Authenticating (login process begins)
- Authenticating → Authenticated (successful login)
- Authenticated → Unauthenticated (logout or token expiry)

### Task Entity (Frontend Representation)

**Definition**: Represents a task as consumed and managed by the frontend

**Fields**:
- `id`: String/UUID, unique identifier from backend
- `title`: String, max 255 characters, required field
- `description`: String, max 1000 characters, optional field
- `completed`: Boolean, completion status
- `createdAt`: DateTime, timestamp from backend
- `updatedAt`: DateTime, timestamp from backend
- `userId`: String/UUID, ID of the user who owns this task

**Validation Rules**:
- Title must be 1-255 characters
- Description must be 0-1000 characters if provided
- completed must be a boolean value
- userId must match authenticated user's ID for access

**State Transitions**:
- New task: creation process → saved in backend
- Existing task: pending update → updated in backend
- Existing task: pending deletion → removed from backend

## API Data Contracts

### Request/Response Objects

#### User Authentication Requests
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### User Response Object
```json
{
  "id": "user-uuid-string",
  "email": "user@example.com",
  "name": "Full Name",
  "token": "jwt-token-string"
}
```

#### Task Creation Request
```json
{
  "title": "string (1-255 chars)",
  "description": "string (0-1000 chars, optional)",
  "completed": "boolean (default false)"
}
```

#### Task Response Object
```json
{
  "id": "UUID string",
  "title": "string",
  "description": "string or null",
  "completed": "boolean",
  "userId": "UUID string",
  "createdAt": "ISO 8601 datetime",
  "updatedAt": "ISO 8601 datetime"
}
```

#### Task Update Request
```json
{
  "title": "string (1-255 chars)",
  "description": "string (0-1000 chars, optional)",
  "completed": "boolean"
}
```

#### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Optional technical details"
  }
}
```

## Frontend State Management

### Application State Structure
```
{
  auth: {
    user: { id, email, name },
    isLoggedIn: boolean,
    token: string,
    isLoading: boolean,
    error: string
  },
  tasks: {
    items: [ { id, title, description, completed, userId, createdAt, updatedAt } ],
    isLoading: boolean,
    error: string,
    currentFilter: "all" | "active" | "completed"
  }
}
```

### Component State Patterns
- Form states (input values, validation errors, submission status)
- UI states (modal open/close, loading indicators, success/error messages)
- Navigation states (current route, sidebar open/closed)

## Validation Rules

### Input Validation
1. Email format validation using standard regex
2. Password strength requirements (min 8 characters)
3. Task title length validation (1-255 characters)
4. Task description length validation (0-1000 characters)

### Business Logic Validation
1. Only authenticated users can access task-related features
2. Users can only modify tasks that belong to them
3. Task completion status can be toggled without server validation
4. Task creation requires both title and authentication

### Security Validation
1. JWT token must be present and valid for API requests
2. User ID from token matches the expected user for resource access
3. API responses are validated before updating UI state
4. Error responses are sanitized before showing to users

## UI State Transitions

### Task Creation Flow
1. User initiates task creation → Show creation form
2. User fills form and submits → Show loading state
3. API request sent → Handle success/error response
4. Success → Update task list and show confirmation
5. Error → Show error message and allow retry

### Authentication Flow
1. Unauthenticated user visits app → Redirect to login
2. User enters credentials → Submit to auth service
3. Service validates credentials → Create session and token
4. Successful auth → Redirect to dashboard
5. Failed auth → Show error and allow retry

### Task Operation States
- Loading: API request in progress
- Success: Operation completed successfully
- Error: Operation failed with specific error
- Optimistic: UI updated immediately, waiting for server confirmation