from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api import auth_router
from src.api.user_routes import user_router
from src.api.v1.tasks import router as tasks_router
from dotenv import load_dotenv
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# your other imports...

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Todo App API",
    description="API for the Todo Full-Stack Web Application",
    version="1.0.0"
)
app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # <-- your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add CORS middleware to allow frontend at http://localhost:3000 to call backend endpoints
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import database to ensure tables are created on startup
from src.services import database

# Include authentication routes
app.include_router(auth_router, prefix="/auth", tags=["authentication"])

# Include user routes
app.include_router(user_router, prefix="/api", tags=["users"])

# Include task routes
app.include_router(tasks_router, prefix="/api/v1", tags=["tasks"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo App API"}
@app.get("/")
def read_root():
    return {"message": "Hello World"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
   

