from fastapi import APIRouter, Depends, HTTPException
from typing import List
from backend.src.middleware.jwt_verification import require_authenticated_user

router = APIRouter(prefix="/api/v1")

# Fake in-memory database for demonstration
TASKS_DB = {}

@router.get("/{user_id}/tasks")
async def get_tasks(user: dict = Depends(require_authenticated_user)):
    user_id = user["user_id"]
    return TASKS_DB.get(user_id, [])

@router.post("/{user_id}/tasks")
async def create_task(task: dict, user: dict = Depends(require_authenticated_user)):
    user_id = user["user_id"]
    task_id = str(len(TASKS_DB.get(user_id, [])) + 1)
    new_task = {"id": task_id, "title": task["title"], "description": task.get("description", ""), "completed": False}
    TASKS_DB.setdefault(user_id, []).append(new_task)
    return new_task

@router.patch("/{user_id}/tasks/{task_id}/complete")
async def toggle_complete(task_id: str, user: dict = Depends(require_authenticated_user)):
    user_id = user["user_id"]
    tasks = TASKS_DB.get(user_id, [])
    for t in tasks:
        if t["id"] == task_id:
            t["completed"] = not t["completed"]
            return t
    raise HTTPException(status_code=404, detail="Task not found")

@router.delete("/{user_id}/tasks/{task_id}")
async def delete_task(task_id: str, user: dict = Depends(require_authenticated_user)):
    user_id = user["user_id"]
    tasks = TASKS_DB.get(user_id, [])
    TASKS_DB[user_id] = [t for t in tasks if t["id"] != task_id]
    return {"detail": "Task deleted"}
