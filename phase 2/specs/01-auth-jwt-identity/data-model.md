# Data Model: Authentication & User Identity for Todo Full-Stack Web Application

## Overview
This document defines the data entities and structures required for the authentication system.

## JWT Token Structure
The JWT token issued by Better Auth will contain the following claims:

- **Header**:
  - alg: "HS256" (algorithm)
  - typ: "JWT" (token type)

- **Payload**:
  - sub: user_id (subject - unique identifier for the user)
  - email: user_email (email address associated with the account)
  - iat: issued_at_timestamp (issued at time)
  - exp: expiration_timestamp (expiration time)
  - jti: token_id (JWT ID for token identification if needed)

## User Identity Claims
When decoded, the JWT token provides the following user identity information:

- **user_id**: String - Unique identifier for the authenticated user
- **email**: String - Email address of the authenticated user
- **expires_at**: DateTime - When the token expires

## API Request Structure
For authenticated requests, the following header will be included:

- **Authorization**: "Bearer <jwt_token>"

## Validation Rules
- JWT tokens must be properly formatted with valid header, payload, and signature
- Tokens must not be expired at the time of verification
- Signature must match the shared secret (BETTER_AUTH_SECRET)
- Required claims (user_id, email) must be present in the payload

## Security Considerations
- JWT secret (BETTER_AUTH_SECRET) must be stored in environment variables
- Tokens should be transmitted over HTTPS only
- Token payload should not contain sensitive information beyond user identification
- Token expiration should be validated on each request