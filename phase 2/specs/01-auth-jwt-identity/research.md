# Research: Authentication & User Identity for Todo Full-Stack Web Application

## Overview
This document captures research findings for implementing secure, stateless authentication using Better Auth and JWT tokens for the Todo Full-Stack Web Application.

## Decision: Better Auth JWT Configuration
**Rationale:** Better Auth provides built-in JWT support that integrates well with Next.js applications. It allows customization of JWT payloads and handles the core authentication flows.
**Alternatives considered:**
- Custom JWT implementation with libraries like PyJWT
- Other authentication providers (Auth0, Firebase Auth)
- Session-based authentication

## Decision: FastAPI JWT Verification Approach
**Rationale:** Using FastAPI dependencies with JWT verification middleware provides clean integration with the framework and allows easy access to user identity in route handlers.
**Alternatives considered:**
- Standalone middleware approach
- Decorator-based verification
- Manual verification in each endpoint

## Decision: Token Storage Strategy
**Rationale:** Using httpOnly cookies for JWT storage provides better security against XSS attacks compared to localStorage. For client-side access, we'll use sessionStorage when needed.
**Alternatives considered:**
- localStorage (vulnerable to XSS)
- Regular cookies (accessible via JavaScript)
- Memory storage (lost on refresh)

## Decision: Token Expiration Policy
**Rationale:** 7-day expiration balances security and user experience. Short-lived tokens reduce exposure window while maintaining reasonable session duration.
**Alternatives considered:**
- Longer sessions (30+ days) - increased security risk
- Shorter sessions (1 day) - frequent re-authentication inconvenience
- Refresh token mechanism - adds complexity beyond scope

## Decision: Error Response Format
**Rationale:** Consistent 401 Unauthorized responses with standardized error messages help frontend handle authentication failures predictably.
**Alternatives considered:**
- Custom error codes
- Different HTTP status codes for different auth failures
- Generic error responses

## Technology Stack Confirmation
- **Frontend**: Next.js 16+ with App Router
- **Backend**: Python FastAPI
- **Authentication**: Better Auth with JWT plugin
- **Database**: Neon Serverless PostgreSQL
- **Environment**: BETTER_AUTH_SECRET for JWT signing

## Integration Patterns
- Frontend authentication flows managed by Better Auth
- JWT tokens automatically included in API requests via centralized API client
- Backend verifies JWT signature using shared secret
- User identity extracted from token claims and passed to route handlers