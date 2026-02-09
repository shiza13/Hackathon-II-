# Research: Backend API & Database Layer

**Feature**: Backend API & Database Layer for Todo Full-Stack Web Application
**Date**: 2026-01-10
**Branch**: 02-backend-api-database

## Overview

This research document addresses all technical unknowns and decisions required for implementing the JWT-protected REST API with Neon PostgreSQL storage for the todo application backend.

## Decision Log

### 1. SQLModel Task Model Implementation

**Decision**: Use SQLModel with Pydantic validation for the Task model with proper indexing on owner_id.

**Rationale**: SQLModel combines Pydantic validation with SQLAlchemy ORM capabilities, fitting perfectly with the required technology stack. Indexing on owner_id ensures efficient queries for user-specific tasks.

**Fields**:
- id: UUID primary key (auto-generated)
- title: String (max 255 chars, required)
- description: String (max 1000 chars, optional)
- completed: Boolean (default false)
- owner_id: String/UUID (foreign key reference to user, indexed)
- created_at: DateTime (auto-set on creation)
- updated_at: DateTime (auto-update on modification)

**Alternatives considered**:
- Pure SQLAlchemy ORM: More verbose than needed
- Tortoise ORM: Would require different async patterns
- Manual validation: Would bypass Pydantic benefits

### 2. Neon PostgreSQL Connection Strategy

**Decision**: Use SQLModel's built-in engine/session pattern with connection pooling and environment-based configuration.

**Rationale**: This follows SQLModel best practices and provides proper connection management for production use. Environment variables ensure secure credential handling.

**Implementation**:
- Use `SQLModelEngine` with connection pooling
- Store database URL in environment variable
- Implement session dependency for FastAPI routes
- Handle connection lifecycle properly

**Alternatives considered**:
- Direct psycopg2 connections: Would bypass ORM benefits
- Manual connection management: Would risk connection leaks

### 3. JWT Verification Dependency Integration

**Decision**: Create a reusable FastAPI dependency that validates JWT tokens and extracts user identity.

**Rationale**: FastAPI dependencies provide elegant way to inject authentication context into routes. Following the spec requirement to integrate with JWT verification from Spec 1.

**Implementation**:
- Create `get_current_user` dependency
- Validate JWT using shared secret from environment
- Return user identity for route handlers
- Raise 401 for invalid/missing tokens

**Alternatives considered**:
- Middleware approach: Would complicate request processing
- Decorator pattern: Less idiomatic for FastAPI

### 4. Task Ownership Enforcement Strategy

**Decision**: Implement ownership checks in each route handler by comparing JWT user ID with route/user ID and database owner_id.

**Rationale**: Provides maximum security by ensuring every access is validated at runtime. Prevents both URL manipulation and direct database access attempts.

**Implementation**:
- Extract user_id from JWT in dependency
- Compare with user_id in route path
- Filter all queries by owner_id
- Return 403 for mismatched access attempts

**Alternatives considered**:
- Database-level constraints: Would be insufficient for API layer
- Application-level caching: Would add complexity without security gain

### 5. API Response Format Standardization

**Decision**: Use consistent response patterns with proper HTTP status codes and standardized error format.

**Rationale**: Provides predictable API behavior for frontend integration and consistent error handling.

**Implementation**:
- Success responses: Return resource objects or count
- Error responses: Follow format `{"error": {"code": "...", "message": "..."}}`
- Status codes: Follow REST conventions (200, 201, 204, 400, 401, 403, 404, 500)

**Alternatives considered**:
- Inconsistent formats: Would complicate frontend error handling
- Framework-specific formats: Would limit interoperability

### 6. Database Migration Strategy

**Decision**: Use Alembic for database migrations with automated generation capability.

**Rationale**: Alembic is the standard migration tool for SQLAlchemy/SQLModel projects and integrates well with the ecosystem.

**Implementation**:
- Set up Alembic with SQLModel metadata
- Create initial migration for Task table
- Configure for automatic migration generation
- Implement startup hook to run migrations

**Alternatives considered**:
- Manual schema management: Would be error-prone
- Raw SQL scripts: Would lack versioning capability

### 7. Error Handling Patterns

**Decision**: Implement comprehensive error handling with specific status codes and meaningful messages.

**Rationale**: Proper error handling is essential for security and user experience, especially in a multi-user system with strict access controls.

**Implementation**:
- Authentication errors: 401 Unauthorized
- Authorization errors: 403 Forbidden
- Resource not found: 404 Not Found
- Validation errors: 400 Bad Request
- Server errors: 500 Internal Server Error

**Alternatives considered**:
- Generic error responses: Would hide important debugging information
- Overly detailed errors: Would risk exposing system internals

## Architecture Patterns

### Dependency Injection Pattern
FastAPI's dependency injection system will be used to inject database sessions, authentication context, and other shared resources into route handlers. This promotes loose coupling and testability.

### Repository Pattern
Though SQLModel simplifies data access, we'll implement a light repository pattern to encapsulate database operations and maintain separation of concerns between API routes and data access logic.

### Security-First Approach
All routes will require authentication by default, with explicit authorization checks performed before any data access. This prevents accidental exposure of protected resources.

## Technology Integration Points

### Better Auth Integration
The JWT verification will integrate with the authentication system from Spec 1, using the same secret key for token validation. This ensures consistent authentication across the entire application.

### Neon PostgreSQL Features
Leverage Neon's serverless capabilities including smart connection pooling and auto-scaling to handle varying load patterns efficiently.

### FastAPI Features
Utilize FastAPI's automatic OpenAPI schema generation, Pydantic validation, and async request handling to build a robust, well-documented API.

## Risk Mitigation

### Security Risks
- SQL injection: Mitigated by using ORM with parameterized queries
- JWT tampering: Mitigated by proper secret validation and signature verification
- Data leakage: Mitigated by ownership enforcement and access controls
- Timing attacks: Mitigated by consistent response patterns

### Performance Risks
- Database query performance: Mitigated by proper indexing and query optimization
- Connection exhaustion: Mitigated by proper connection pooling
- Memory leaks: Mitigated by proper resource cleanup

### Scalability Risks
- Single-user bottleneck: Mitigated by proper indexing and efficient queries
- Concurrent access conflicts: Mitigated by database transaction management