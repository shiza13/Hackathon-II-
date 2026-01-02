# Data Model: Console Todo Application

## TodoItem Entity

**Attributes**:
- `id`: Unique identifier (integer, auto-generated)
- `description`: Text description of the task (string)
- `completed`: Boolean indicating completion status (boolean, default: False)
- `created_at`: Timestamp when item was added (datetime)

**Validation Rules**:
- Description must be non-empty (min 1 character)
- ID must be unique within the collection
- Completed status is boolean (True/False only)

**State Transitions**:
- `pending` → `completed`: When user marks item as completed
- `completed` → `pending`: When user unmarks item (if this feature is implemented)

## Todo Collection

**Structure**: List of TodoItem objects stored in memory
**Operations**:
- Add: Append new TodoItem to the list
- Get All: Return all TodoItem objects
- Get by ID: Return specific TodoItem by unique ID
- Update: Modify existing TodoItem properties
- Delete: Remove TodoItem from the list
- Mark Complete: Update completed status of TodoItem

**Constraints**:
- All operations happen in-memory only
- No persistence to files or databases
- Collection resets when application restarts