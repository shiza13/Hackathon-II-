---
id: 004
title: Create Auth JWT Identity Plan
stage: plan
date: 2026-01-09
surface: agent
model: claude-sonnet-4-5-20250929
feature: auth-jwt-identity
branch: 01-auth-jwt-identity
user: user
command: sp.plan
labels: [authentication, jwt, identity, better-auth, fastapi, planning]
links:
  spec: specs/01-auth-jwt-identity/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/01-auth-jwt-identity/plan.md
 - specs/01-auth-jwt-identity/research.md
 - specs/01-auth-jwt-identity/data-model.md
 - specs/01-auth-jwt-identity/contracts/auth-contract.yaml
 - specs/01-auth-jwt-identity/quickstart.md
tests:
---

## Prompt

Authentication & User Identity

Goal:
Establish a secure, stateless authentication flow that allows the FastAPI backend
to reliably identify the logged-in user using JWT tokens issued by Better Auth.

Steps:

1. Better Auth Configuration (Frontend)
   - Enable JWT plugin in Better Auth configuration
   - Configure JWT payload to include:
     - user_id
     - email
   - Set token expiry (e.g., 7 days)
   - Use BETTER_AUTH_SECRET from environmentvariables

2. Frontend Auth Flow Validation
   - Verify signup flow creates a valid user session
   - Verify login flow issues a JWT token
   - Confirm token is accessible on the client side
   - Store token securely (session-based, not localStorage if avoidable)

3. Frontend API Client Setup
   - Create a centralized API client
   - Automatically attach JWT token to every request:
     Authorization: Bearer <token>
   - Ensure unauthenticated requests do not send tokens

4. FastAPI JWT Verification Layer
   - Add JWT verification middleware or dependency
   - Extract token from Authorization header
   - Verify token signature using BETTER_AUTH_SECRET
   - Validate token expiry
   - Decode tokenpayload

5. User Identity Extraction
   - Extract authenticated user_id from token
   - Make user identity available to API routes
   - Reject requests where token user_id does not match route user_id

6. Error Handling & Security
   - Return 401 Unauthorized for:
     - Missing token
     - Invalid token
     - Expired token
   - Ensure no sensitive token data is logged

Deliverables:
- Working Better Auth JWT configuration
- Verified JWT issuance onlogin
- FastAPI JWT verification layer
- Authenticated user identity available for downstream specs
- Clear boundary between authentication (Spec 1) and authorization logic (Spec 2)

Exit Criteria:
- Backend can reliably identify the logged-in user
- Unauthorized access is impossible without a valid JWT
- Spec 2 can safely build task ownership on top of this spec

## Response snapshot

Successfully completed the implementation plan for Authentication & User Identity feature. Created the following artifacts:

1. Implementation Plan (plan.md): Detailed plan with technical context, constitution check, and project structure
2. Research Document (research.md): Researched and documented decisions on Better Auth configuration, FastAPI JWT verification, token storage, and error handling
3. Data Model (data-model.md): Defined JWT token structure, user identity claims, and validation rules
4. API Contracts (contracts/auth-contract.yaml): Specified authentication endpoints and JWT verification middleware
5. Quickstart Guide (quickstart.md): Provided setup instructions for the authentication system

The plan addresses all requirements from the prompt including:
- Better Auth JWT configuration with user_id and email in payload
- Frontend authentication flows and secure token handling
- FastAPI JWT verification layer with proper error handling
- User identity extraction from tokens
- 401 Unauthorized responses for invalid requests

## Outcome

- ✅ Impact: Complete implementation plan with all required artifacts
- 🧪 Tests: none
- 📁 Files: Created plan.md, research.md, data-model.md, contracts, and quickstart.md
- 🔁 Next prompts: Proceed to task creation with /sp.tasks
- 🧠 Reflection: Plan covers complete authentication flow from signup to protected API access

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Create implementation tasks