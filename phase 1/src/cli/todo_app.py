"""
Console-based Todo Application
"""

from src.services.todo_service import TodoService


class TodoApp:
    """
    Main console application for managing todos.
    """

    def __init__(self):
        """
        Initialize the TodoApp with a TodoService.
        """
        self.service = TodoService()
        self.running = True

    def display_menu(self):
        """
        Display the main menu options to the user.
        """
        print("\n" + "="*40)
        print("         TODO APPLICATION")
        print("="*40)
        print("1. Add a new todo")
        print("2. View all todos")
        print("3. Update a todo")
        print("4. Delete a todo")
        print("5. Mark todo as completed")
        print("6. Quit")
        print("="*40)

    def get_user_choice(self) -> str:
        """
        Get the user's menu choice.

        Returns:
            The user's choice as a string
        """
        try:
            choice = input("Enter your choice (1-6): ").strip()
            return choice
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye!")
            return "6"  # Return quit option

    def run(self):
        """
        Run the main application loop.
        """
        print("Welcome to the Todo Application!")

        while self.running:
            self.display_menu()
            choice = self.get_user_choice()

            if choice == "1":
                self.handle_add_todo()
            elif choice == "2":
                self.handle_view_todos()
            elif choice == "3":
                self.handle_update_todo()
            elif choice == "4":
                self.handle_delete_todo()
            elif choice == "5":
                self.handle_mark_completed()
            elif choice == "6":
                self.handle_quit()
            else:
                print("Invalid choice. Please enter a number between 1 and 6.")

    def handle_add_todo(self):
        """
        Handle adding a new todo.
        """
        description = input("Enter the todo description: ").strip()
        result = self.service.add_todo(description)

        if result:
            print(f"✓ Todo added successfully with ID {result.id}")
        else:
            print("✗ Error: Todo description cannot be empty.")

    def handle_view_todos(self):
        """
        Handle viewing all todos.
        """
        todos = self.service.get_all_todos()

        if not todos:
            print("\nNo todos available.")
        else:
            print("\nYour Todos:")
            for todo in todos:
                print(f"  {todo}")

    def handle_update_todo(self):
        """
        Handle updating a todo.
        """
        if not self.service.get_all_todos():
            print("No todos available to update.")
            return

        self.handle_view_todos()

        try:
            todo_id = int(input("Enter the ID of the todo to update: "))
            new_description = input("Enter the new description: ").strip()

            if self.service.update_todo(todo_id, new_description):
                print("✓ Todo updated successfully.")
            else:
                print("✗ Error: Todo with that ID not found or invalid description.")
        except ValueError:
            print("✗ Error: Please enter a valid ID number.")

    def handle_delete_todo(self):
        """
        Handle deleting a todo.
        """
        if not self.service.get_all_todos():
            print("No todos available to delete.")
            return

        self.handle_view_todos()

        try:
            todo_id = int(input("Enter the ID of the todo to delete: "))

            if self.service.delete_todo(todo_id):
                print("✓ Todo deleted successfully.")
            else:
                print("✗ Error: Todo with that ID not found.")
        except ValueError:
            print("✗ Error: Please enter a valid ID number.")

    def handle_mark_completed(self):
        """
        Handle marking a todo as completed.
        """
        if not self.service.get_all_todos():
            print("No todos available to mark as completed.")
            return

        self.handle_view_todos()

        try:
            todo_id = int(input("Enter the ID of the todo to mark as completed: "))

            if self.service.mark_completed(todo_id):
                print("✓ Todo marked as completed successfully.")
            else:
                print("✗ Error: Todo with that ID not found.")
        except ValueError:
            print("✗ Error: Please enter a valid ID number.")

    def handle_quit(self):
        """
        Handle quitting the application.
        """
        print("Thank you for using the Todo Application. Goodbye!")
        self.running = False


def main():
    """
    Main function to start the application.
    """
    app = TodoApp()
    app.run()


if __name__ == "__main__":
    main()