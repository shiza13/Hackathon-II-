# Quickstart Guide: Authentication & User Identity

## Overview
This guide provides instructions to quickly set up and run the authentication system for the Todo Full-Stack Web Application.

## Prerequisites
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- pip (Python package manager)
- npm or yarn (Node package manager)
- Neon PostgreSQL account and connection details

## Environment Setup
1. Create a `.env` file in the project root:
```
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here
DATABASE_URL=your-neon-postgres-connection-string
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

2. Generate a strong secret for BETTER_AUTH_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install fastapi uvicorn python-multipart python-jose[cryptography] passlib[bcrypt] sqlmodel
```

3. Start the backend server:
```bash
uvicorn src.api.main:app --reload --port 8000
```

## Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

## Running the Authentication System
1. Ensure both backend (port 8000) and frontend (port 3000) servers are running
2. Visit http://localhost:3000 to access the application
3. Use the signup/login forms to create an account or sign in
4. Once authenticated, JWT tokens will be automatically included in API requests

## Testing Authentication
1. Register a new user via the signup form
2. Verify login works by signing in with the registered credentials
3. Access protected endpoints that require authentication
4. Test unauthorized access by removing/corrupting the JWT token

## Troubleshooting
- If JWT verification fails, ensure BETTER_AUTH_SECRET is identical between frontend and backend
- Check that the Authorization header format is "Bearer <token>"
- Verify that token expiration is handled correctly
- Confirm that the database connection for user storage is working