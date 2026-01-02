---
description: "Task list for console todo application implementation"
---

# Tasks: Console Todo Application

**Input**: Design documents from `/specs/1-console-todo-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 [P] Create project structure per implementation plan: src/models/, src/services/, src/cli/, src/lib/
- [X] T002 Initialize Python project with standard library dependencies
- [X] T003 [P] Configure linting and formatting tools (if any Python standard tools available)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create TodoItem model in src/models/todo_item.py
- [X] T005 [P] Create TodoService in src/services/todo_service.py (depends on T004)
- [X] T006 Setup basic CLI application structure in src/cli/todo_app.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add Todo Items (Priority: P1) 🎯 MVP

**Goal**: Allow users to add new todo items with descriptions to an in-memory list

**Independent Test**: Can be fully tested by adding a new todo item and verifying it appears in the list of todos.

### Implementation for User Story 1

- [X] T007 [US1] Implement add todo functionality in TodoService (src/services/todo_service.py)
- [X] T008 [US1] Create TodoItem with unique ID, description, and pending status in TodoService
- [X] T009 [US1] Add CLI interface for adding todo in src/cli/todo_app.py
- [X] T010 [US1] Add input validation for empty descriptions in src/services/todo_service.py
- [X] T011 [US1] Add confirmation message display after successful add

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View Todo Items (Priority: P1)

**Goal**: Display all todo items with their current status (completed/pending)

**Independent Test**: Can be fully tested by adding some todo items and then viewing the complete list.

### Implementation for User Story 2

- [X] T012 [US2] Implement get all todos functionality in TodoService (src/services/todo_service.py)
- [X] T013 [US2] Implement formatted display of todos in CLI (src/cli/todo_app.py)
- [X] T014 [US2] Add visual indicators for completed vs pending status
- [X] T015 [US2] Handle empty list case with appropriate message
- [X] T016 [US2] Integrate with User Story 1 components (depends on T007, T008)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Mark Todo as Completed (Priority: P2)

**Goal**: Allow users to mark existing todo items as completed

**Independent Test**: Can be fully tested by marking a todo item as completed and verifying the status change is reflected when viewing the list.

### Implementation for User Story 3

- [X] T017 [US3] Implement mark complete functionality in TodoService (src/services/todo_service.py)
- [X] T018 [US3] Add CLI interface for marking todo as complete in src/cli/todo_app.py
- [X] T019 [US3] Add validation for valid todo IDs in TodoService
- [X] T020 [US3] Add error handling for invalid todo IDs
- [X] T021 [US3] Integrate with User Story 1 and 2 components (depends on T007, T012)

**Checkpoint**: User Stories 1, 2, and 3 should now be independently functional

---

## Phase 6: User Story 4 - Update Todo Items (Priority: P3)

**Goal**: Allow users to update the description of existing todo items

**Independent Test**: Can be fully tested by updating a todo item and verifying the changes are reflected when viewing the list.

### Implementation for User Story 4

- [X] T022 [US4] Implement update todo functionality in TodoService (src/services/todo_service.py)
- [X] T023 [US4] Add CLI interface for updating todo in src/cli/todo_app.py
- [X] T024 [US4] Add validation for valid todo IDs and non-empty descriptions
- [X] T025 [US4] Add error handling for invalid inputs
- [X] T026 [US4] Integrate with previous user stories (depends on T007, T012)

**Checkpoint**: User Stories 1, 2, 3, and 4 should now be independently functional

---

## Phase 7: User Story 5 - Delete Todo Items (Priority: P3)

**Goal**: Allow users to delete existing todo items from the list

**Independent Test**: Can be fully tested by deleting a todo item and verifying it no longer appears in the list.

### Implementation for User Story 5

- [ ] T027 [US5] Implement delete todo functionality in TodoService (src/services/todo_service.py)
- [ ] T028 [US5] Add CLI interface for deleting todo in src/cli/todo_app.py
- [ ] T029 [US5] Add validation for valid todo IDs
- [ ] T030 [US5] Add error handling for invalid inputs
- [ ] T031 [US5] Integrate with previous user stories (depends on T007, T012)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T032 [P] Add comprehensive error handling throughout the application
- [ ] T033 [P] Improve user prompts and console output formatting
- [ ] T034 Add main menu interface in src/cli/todo_app.py
- [ ] T035 [P] Add graceful exit functionality
- [ ] T036 [P] Code cleanup and refactoring
- [ ] T037 [P] Documentation updates in docstrings
- [ ] T038 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3 but should be independently testable
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3/US4 but should be independently testable

### Within Each User Story

- Models before services
- Services before CLI interface
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Different user stories can be worked on sequentially by priority
- Tasks within each user story should be completed in dependency order

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Add Todo)
4. Complete Phase 4: User Story 2 (View Todos)
5. **STOP and TEST**: Verify add/view functionality works independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Add functionality!)
3. Add User Story 2 → Test independently → Deploy/Demo (View functionality!)
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Sequential Team Strategy

With a single developer:
1. Team completes Setup + Foundational
2. Once Foundational is done:
   - Complete User Story 1 (P1)
   - Complete User Story 2 (P1)
   - Complete User Story 3 (P2)
   - Complete User Story 4 (P3)
   - Complete User Story 5 (P3)
3. Stories integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify functionality after each completed user story
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence