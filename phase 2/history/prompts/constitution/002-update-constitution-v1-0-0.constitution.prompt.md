---
id: 002
title: Update Constitution with Todo App Principles
stage: constitution
date: 2026-01-09
surface: agent
model: claude-sonnet-4-5-20250929
feature: todo-fullstack-app
branch: master
user: user
command: sp.constitution
labels: [constitution, security, authentication, jwt, fullstack]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
 - .specify/templates/plan-template.md
 - .specify/templates/spec-template.md
 - .specify/templates/tasks-template.md
tests:
---

## Prompt

Project: Todo Full-Stack Web Application

Specs Covered:
1. Authentication & User Identity (Better Auth + JWT)
2. Backend API & Database Layer (FastAPI + SQLModel + Neon PostgreSQL)
3. Frontend Application & Integration (Next.js App Router)

Core principles:
- Security-first design (authentication, authorization, user isolation)
- Correctness and data integrity across frontend and backend
- Clear separation of concerns between specs
- Reproducibility (environment-based configuration and deterministic behavior)
- Production-oriented engineering practices

Key standards:
- All API endpoints must enforce JWT-based authentication
- No endpoint may access or  mutate data without verifying task ownership
- Authentication logic must be stateless on the backend
- Frontend and backend must share JWT verification rules via a common secret
- All specs must integrate cleanly without implicit dependencies

Constraints:
- Frontend: Next.js 16+ using App Router
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth with JWT plugin
- JWT secret shared via environment variable (BETTER_AUTH_SECRET)
- REST API only (no server actions for data mutation)

Success criteria:
- Users can sign up and sign in securely
- JWT token is issued, transmitted, and verified correctly
- Each user can only see and modify their own tasks
- All CRUD operations persist correctly in the database
- Unauthorized requests consistently return 401 errors
- System behaves correctly across all three specs when integrated

## Response snapshot

Successfully updated the project constitution and aligned dependent templates:

1. Created new constitution at `.specify/memory/constitution.md` with version 1.0.0 containing:
   - Six core principles: Security-First Design, Correctness and Data Integrity, Clear Separation of Concerns, Reproducibility, Production-Oriented Engineering, and Stateless Authentication
   - Technology Stack Constraints section
   - Success Criteria section
   - Governance section with compliance requirements

2. Updated dependent templates to align with new constitution:
   - Modified `.specify/templates/plan-template.md` to include constitution checks for security and authentication requirements
   - Updated `.specify/templates/spec-template.md` to include functional requirements related to security, data integrity, and authentication
   - Enhanced `.specify/templates/tasks-template.md` with foundational tasks for authentication, user isolation, and JWT implementation

## Outcome

- ✅ Impact: Created initial project constitution with security-first principles
- 🧪 Tests: none
- 📁 Files: Updated constitution.md and aligned 3 template files
- 🔁 Next prompts: Create feature specifications based on constitution
- 🧠 Reflection: Successfully established governance framework for secure full-stack application

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Create first feature spec based on constitution