# Data Model: Backend API & Database Layer

**Feature**: Backend API & Database Layer for Todo Full-Stack Web Application
**Date**: 2026-01-10
**Branch**: 02-backend-api-database

## Entity Models

### Task Entity

**Definition**: Represents a user's todo item with core properties and metadata

**Fields**:
- `id`: UUID/string, unique identifier (primary key)
- `title`: String, max 255 characters, required field
- `description`: String, max 1000 characters, optional field
- `completed`: Boolean, default false
- `owner_id`: String/UUID, foreign key reference to user, indexed
- `created_at`: DateTime, automatically set on creation
- `updated_at`: DateTime, automatically updated on modification

**Relationships**:
- One-to-Many: User → Tasks (one user owns many tasks)
- Foreign Key: owner_id references user identifier from JWT

**Validation Rules**:
- Title must be 1-255 characters
- Description must be 0-1000 characters if provided
- owner_id must match authenticated user's ID for all operations
- created_at and updated_at are automatically managed by the system

**Indexing**:
- Primary key: id
- Secondary index: owner_id (for efficient user-specific queries)

**State Transitions**:
- New task: completed = false (default)
- Task completion: completed = true (via PATCH /complete endpoint)
- Task reversion: completed = false (via PATCH /complete endpoint)

## API Data Contracts

### Request/Response Objects

#### Task Creation Request
```json
{
  "title": "string (1-255 chars)",
  "description": "string (0-1000 chars, optional)"
}
```

#### Task Response Object
```json
{
  "id": "UUID string",
  "title": "string",
  "description": "string or null",
  "completed": "boolean",
  "owner_id": "UUID string",
  "created_at": "ISO 8601 datetime",
  "updated_at": "ISO 8601 datetime"
}
```

#### Task Update Request
```json
{
  "title": "string (1-255 chars)",
  "description": "string (0-1000 chars, optional)",
  "completed": "boolean (optional)"
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

## Database Schema

### Task Table
```
Table: tasks
- id: UUID (PRIMARY KEY, auto-generated)
- title: VARCHAR(255) NOT NULL
- description: TEXT (optional)
- completed: BOOLEAN DEFAULT FALSE
- owner_id: VARCHAR/UUID NOT NULL (INDEXED)
- created_at: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
- updated_at: TIMESTAMP WITH TIME ZONE DEFAULT NOW() ON UPDATE
```

## Validation Rules

### Business Logic Validation
1. All task operations require user authentication via JWT
2. All task operations require owner_id to match authenticated user
3. Title length must be between 1-255 characters
4. Description length must be between 0-1000 characters
5. Task completion state can be toggled via dedicated endpoint

### Security Validation
1. User ID from JWT must match user_id in URL path
2. All queries must filter by owner_id
3. Users cannot access tasks owned by other users
4. Invalid JWT tokens result in 401 Unauthorized

## State Management

### Task Lifecycle
1. **Creation**: POST /api/{user_id}/tasks → New task with completed=false
2. **Retrieval**: GET /api/{user_id}/tasks → List of user's tasks
3. **Update**: PUT /api/{user_id}/tasks/{id} → Full task update
4. **Completion**: PATCH /api/{user_id}/tasks/{id}/complete → Toggle completion status
5. **Deletion**: DELETE /api/{user_id}/tasks/{id} → Remove task permanently

### Data Integrity
- Foreign key constraints ensure referential integrity
- Database-level indexing for efficient user-specific queries
- Automatic timestamp management for audit trail
- Validation at both API and database layers