---
id: 1
title: Backend API Database Spec
stage: spec
date: 2026-01-10
surface: agent
model: claude-sonnet-4-5-20250929
feature: backend-api-database
branch: 02-backend-api-database
user: claude
command: /sp.specify
labels: [backend,api,database,specification]
links:
  spec: specs/02-backend-api-database/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/02-backend-api-database/spec.md
  - specs/02-backend-api-database/checklists/requirements.md
tests:
  - specs/02-backend-api-database/checklists/requirements.md
---

## Prompt

Backend API & Database Layer for Todo Full-Stack Web Application

Target audience:
- Backend and full-stack developers implementing or reviewing the API
- Hackathon evaluators validating correctness, security, and data integrity

Focus:
- RESTful API implementation using FastAPI
- Persistent task storage using SQLModel and Neon PostgreSQL
- JWT-based authorization and task ownership enforcement
- Secure, multi-user task isolation

Success criteria:
- All required REST endpoints are implemented and functional
- CRUD operations persist correctly in Neon PostgreSQL
- Every API request requires a valid JWT token
- Authenticated user identity is derived from JWT (Spec 1 dependency)
- Users can only access and modify their own tasks
- Attempts to access another user's tasks return 403 Forbidden or 404 Not Found

Constraints:
- Backend framework: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- JWT verification logic provided by Spec 1
- User identity must be extracted from JWT, not request body
- All database queries must be filtered by authenticated user_id
- API must follow REST conventions and return proper HTTP status codes

API Scope:
- GET    /api/{user_id}/tasks
- POST   /api/{user_id}/tasks
- GET    /api/{user_id}/tasks/{id}
- PUT    /api/{user_id}/tasks/{id}
- DELETE /api/{user_id}/tasks/{id}
- PATCH  /api/{user_id}/tasks/{id}/complete

Not building:
- Frontend UI or API client
- Authentication issuance logic (Better Auth handled in Spec 1)
- Role-based access control
- Soft deletes or audit logs
- Pagination, filtering, or search (basic listing only)

## Response snapshot

Successfully created a feature specification for the Backend API & Database Layer for Todo Full-Stack Web Application. Created branch '02-backend-api-database' and specification document at 'specs/02-backend-api-database/spec.md'. The specification includes user scenarios, functional requirements, key entities, and success criteria as required by the template. Also created a quality checklist at 'specs/02-backend-api-database/checklists/requirements.md' to validate the specification completeness.

## Outcome

- ✅ Impact: Created complete feature specification for backend API with JWT-based authorization and task ownership enforcement
- 🧪 Tests: Validation checklist created to ensure specification quality
- 📁 Files: specs/02-backend-api-database/spec.md, specs/02-backend-api-database/checklists/requirements.md
- 🔁 Next prompts: Ready for /sp.clarify or /sp.plan to continue development
- 🧠 Reflection: Specification addresses all required API endpoints and security requirements with proper user isolation

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All specification requirements met
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed with planning phase