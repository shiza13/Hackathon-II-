"""
TodoService handles all business logic for managing todo items.
"""

from typing import List, Optional
from src.models.todo_item import TodoItem


class TodoService:
    """
    Service class that handles all todo-related operations.
    """

    def __init__(self):
        """
        Initialize the TodoService with an empty list of todos.
        """
        self.todos: List[TodoItem] = []
        self._next_id = 1

    def add_todo(self, description: str) -> Optional[TodoItem]:
        """
        Add a new todo item with the given description.

        Args:
            description: The description of the new todo item

        Returns:
            The created TodoItem if successful, None if description is empty
        """
        if not description or not description.strip():
            return None

        todo = TodoItem(self._next_id, description.strip())
        self.todos.append(todo)
        self._next_id += 1
        return todo

    def get_all_todos(self) -> List[TodoItem]:
        """
        Get all todo items.

        Returns:
            List of all TodoItems
        """
        return self.todos

    def get_todo_by_id(self, todo_id: int) -> Optional[TodoItem]:
        """
        Get a specific todo item by its ID.

        Args:
            todo_id: The ID of the todo item to retrieve

        Returns:
            The TodoItem if found, None otherwise
        """
        for todo in self.todos:
            if todo.id == todo_id:
                return todo
        return None

    def mark_completed(self, todo_id: int) -> bool:
        """
        Mark a todo item as completed.

        Args:
            todo_id: The ID of the todo item to mark as completed

        Returns:
            True if the todo was found and marked, False otherwise
        """
        todo = self.get_todo_by_id(todo_id)
        if todo:
            todo.mark_completed()
            return True
        return False

    def mark_pending(self, todo_id: int) -> bool:
        """
        Mark a todo item as pending.

        Args:
            todo_id: The ID of the todo item to mark as pending

        Returns:
            True if the todo was found and marked, False otherwise
        """
        todo = self.get_todo_by_id(todo_id)
        if todo:
            todo.mark_pending()
            return True
        return False

    def update_todo(self, todo_id: int, new_description: str) -> bool:
        """
        Update the description of a todo item.

        Args:
            todo_id: The ID of the todo item to update
            new_description: The new description for the todo item

        Returns:
            True if the todo was found and updated, False otherwise
        """
        if not new_description or not new_description.strip():
            return False

        todo = self.get_todo_by_id(todo_id)
        if todo:
            todo.description = new_description.strip()
            return True
        return False

    def delete_todo(self, todo_id: int) -> bool:
        """
        Delete a todo item.

        Args:
            todo_id: The ID of the todo item to delete

        Returns:
            True if the todo was found and deleted, False otherwise
        """
        for i, todo in enumerate(self.todos):
            if todo.id == todo_id:
                del self.todos[i]
                return True
        return False

    def get_next_id(self) -> int:
        """
        Get the next available ID for a new todo item.

        Returns:
            The next available ID
        """
        return self._next_id