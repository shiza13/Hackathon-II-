# Quickstart Guide: Console Todo Application

## Prerequisites
- Python 3.13+ installed
- Terminal/command-line access

## Setup
1. Clone or navigate to the project directory
2. Ensure Python 3.13+ is available in your environment
3. No additional dependencies required (uses only standard library)

## Running the Application
```bash
cd src/cli
python todo_app.py
```

## Basic Usage
1. Launch the application - you'll see a menu with options
2. Choose an option by entering the corresponding number:
   - 1: Add a new todo
   - 2: View all todos
   - 3: Update a todo
   - 4: Delete a todo
   - 5: Mark todo as completed
   - 6: Quit the application
3. Follow the prompts for each operation
4. Use Ctrl+C to exit at any time if needed

## Example Workflow
1. Add a new todo: Select option 1, enter description
2. View todos: Select option 2 to see all items with status
3. Mark as completed: Select option 5, enter todo number
4. Update description: Select option 3, enter todo number and new description
5. Delete: Select option 4, enter todo number

## Troubleshooting
- If you enter an invalid number, you'll get an error message and can try again
- Empty todo lists will show a message indicating no items
- Invalid inputs are handled gracefully without crashing the application