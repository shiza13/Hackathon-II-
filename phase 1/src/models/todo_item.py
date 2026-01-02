"""
TodoItem model representing a single todo task.
"""

from datetime import datetime
from typing import Optional


class TodoItem:
    """
    Represents a single todo item with ID, description, completion status, and creation time.
    """

    def __init__(self, item_id: int, description: str, completed: bool = False):
        """
        Initialize a TodoItem.

        Args:
            item_id: Unique identifier for the todo item
            description: Text description of the task
            completed: Boolean indicating whether the task is completed (default: False)
        """
        self.id = item_id
        self.description = description
        self.completed = completed
        self.created_at = datetime.now()

    def __str__(self) -> str:
        """
        String representation of the TodoItem.

        Returns:
            Formatted string showing the todo item with status
        """
        status = "✓" if self.completed else "○"
        return f"[{status}] {self.id}: {self.description} (Created: {self.created_at.strftime('%Y-%m-%d %H:%M:%S')})"

    def mark_completed(self) -> None:
        """
        Mark the todo item as completed.
        """
        self.completed = True

    def mark_pending(self) -> None:
        """
        Mark the todo item as pending.
        """
        self.completed = False