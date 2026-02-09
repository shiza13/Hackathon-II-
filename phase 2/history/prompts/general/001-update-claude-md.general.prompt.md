---
id: 001
title: Update CLAUDE MD with Project Requirements
stage: general
date: 2026-01-09
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: user
command: Update CLAUDE.md file with project requirements
labels: [claude-md, project-requirements, todo-app, fullstack]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - C:\\Gov house Quarter 4\\Hackathon II\\phase 2\\CLAUDE.md
tests:
---

## Prompt

Update the claude.md file based on my project requirements. In this file:

Use Auth Agent for authentication
Use Frontend Agent for frontend development (e.g., Next.js)
Use DB Agent for database design and operations
Use Backend Agent for FastAPI development
Below are my project requirements:
'''
Phase II: Todo Full-Stack Web Application
Basic Level Functionality
Objective: Using Claude Code and Spec-Driven transform the console app into a modern
multi-user web application with persistent storage.
Requirements
• Implement all 5 Basic Level features as a web application
• Create RESTful API endpoints
• Build responsive frontend interface
• Store data in Neon Serverless PostgreSQL database
• Authentication – Implement user signup/signin using Better Auth
Technology Stack
Layer Technology
Frontend Next.js 16+ (App Router)
Backend Python FastAPI
ORM SQLModel
Database Neon Serverless PostgreSQL
Spec-Driven Claude Code + Spec-Kit Plus
Authentication Better Auth

Better Auth can be configured to issue JWT (JSON Web Token) tokens when users log in.
These tokens are self-contained credentials that include user information and can be verified
by any service that knows the secret key.
How It Works
● User logs in on Frontend → Better Auth creates a session and issues a JWT token
● Frontend makes API call → Includes the JWT token in the Authorization: Bearer
<token> header
● Backend receives request → Extracts token from header, verifies signature using
shared secret
● Backend identifies user → Decodes token to get user ID, email, etc. and matches it
with the user ID in the URL
● Backend filters data → Returns only tasks belonging to that user'''

## Response snapshot

I've successfully updated the CLAUDE.md file to include your project requirements for the Phase II Todo Full-Stack Web Application. The updated file now contains:

1. **Technology Stack** - A table showing the tech stack (Next.js, FastAPI, SQLModel, Neon PostgreSQL, Better Auth)
2. **Specialized Agents** - Clear definitions of which agent to use for which purpose:
   - Auth Agent for authentication with Better Auth
   - Frontend Agent for Next.js development
   - DB Agent for database operations with Neon PostgreSQL
   - Backend Agent for FastAPI development
3. **Project Requirements** - Details about the basic level functionality needed
4. **Authentication Flow** - Explanation of how Better Auth JWT tokens work with the frontend/backend interaction

The file maintains all the original Claude Code Rules structure while incorporating your specific project requirements and guidelines for using the specialized agents.

## Outcome

- ✅ Impact: Updated CLAUDE.md with project requirements and agent usage guidelines
- 🧪 Tests: none
- 📁 Files: Updated CLAUDE.md with project requirements and technology stack
- 🔁 Next prompts: Create project structure based on requirements
- 🧠 Reflection: Successfully incorporated project requirements into the main configuration file

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Create initial project structure