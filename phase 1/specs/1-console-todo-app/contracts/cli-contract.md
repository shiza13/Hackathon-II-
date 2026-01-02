# CLI Contract: Console Todo Application

## Overview
This document defines the command-line interface contract for the todo application, specifying the expected user interactions and system responses.

## Input/Output Protocol

### Input
- **User Input**: Text-based commands via stdin (console input)
- **Command Format**: Menu selection (1-6) followed by any required parameters
- **Input Validation**: All inputs are validated with appropriate error messages

### Output
- **Standard Output**: Text-based responses via stdout (user messages, lists, confirmations)
- **Error Output**: Error messages via stderr (validation errors, operation failures)

## Operations

### 1. Add Todo
- **Input**: Menu selection "1" followed by todo description text
- **Success Output**: Confirmation message with new item details
- **Error Output**: Error message if description is empty

### 2. View Todos
- **Input**: Menu selection "2"
- **Success Output**: Numbered list of all todos with completion status
- **Error Output**: "No todos available" if list is empty

### 3. Update Todo
- **Input**: Menu selection "3" followed by item index and new description
- **Success Output**: Confirmation of update
- **Error Output**: Error message if index is invalid or description is empty

### 4. Delete Todo
- **Input**: Menu selection "4" followed by item index
- **Success Output**: Confirmation of deletion
- **Error Output**: Error message if index is invalid

### 5. Mark Complete
- **Input**: Menu selection "5" followed by item index
- **Success Output**: Confirmation of status change
- **Error Output**: Error message if index is invalid

### 6. Quit
- **Input**: Menu selection "6"
- **Success Output**: Goodbye message and application exit
- **Error Output**: N/A

## Error Handling
- All invalid inputs result in user-friendly error messages
- Application never crashes due to invalid user input
- All operations are validated before execution