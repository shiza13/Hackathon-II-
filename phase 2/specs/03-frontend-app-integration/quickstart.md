# Quickstart Guide: Frontend Application & Integration

**Feature**: Frontend Application & Integration for Todo Full-Stack Web Application
**Date**: 2026-02-05
**Branch**: 03-frontend-app-integration

## Overview

This quickstart guide provides the essential information needed to begin implementing the responsive, auth-aware frontend that integrates with the JWT-secured FastAPI backend for the todo application.

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Next.js 16+ installed globally
- Access to the JWT-secured FastAPI backend
- Environment variables configured for API URLs

## Setup Instructions

### 1. Initialize Next.js Project

```bash
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd frontend
```

### 2. Install Dependencies

```bash
npm install @types/node @types/react @types/react-dom better-auth swr
```

### 3. Environment Variables

Create a `.env.local` file with the following variables:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_AUTH_BASE_URL=http://localhost:8000/auth
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-for-local-development
```

### 4. Project Structure

```
frontend/
├── public/
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── layout.tsx           # Root layout with global styles
│   │   ├── page.tsx             # Homepage/landing page
│   │   ├── auth/
│   │   │   ├── login/page.tsx   # Login page
│   │   │   ├── signup/page.tsx  # Signup page
│   │   │   └── layout.tsx       # Auth-specific layout
│   │   ├── tasks/
│   │   │   ├── page.tsx         # Task list page
│   │   │   ├── create/page.tsx  # Task creation page
│   │   │   ├── [id]/page.tsx    # Individual task page
│   │   │   └── layout.tsx       # Tasks section layout
│   │   └── globals.css          # Global styles
│   ├── components/              # Reusable UI components
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── tasks/
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskList.tsx
│   │   │   └── TaskActions.tsx
│   │   ├── ui/                  # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── auth.ts              # Authentication utilities
│   │   ├── api.ts               # API client and utilities
│   │   ├── types.ts             # TypeScript types and interfaces
│   │   └── utils.ts             # General utility functions
│   ├── hooks/
│   │   ├── useAuth.ts           # Authentication state management
│   │   ├── useTasks.ts          # Task data management
│   │   └── useApi.ts            # Generic API hook
│   └── contexts/
│       └── AuthContext.tsx      # Authentication state context
├── styles/
├── next.config.js
├── tsconfig.json
└── package.json
```

## Core Implementation Steps

### 1. Set Up Authentication Context

Create `src/contexts/AuthContext.tsx`:

```tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Implementation to authenticate with backend
    // On success, store token and user info
  };

  const signup = async (email: string, password: string, name?: string) => {
    // Implementation to register new user
    // On success, store token and user info
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/auth/login');
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    isAuthenticated: !!token,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 2. Create Protected Route Component

Create `src/components/auth/ProtectedRoute.tsx`:

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
};
```

### 3. Set Up API Client Utility

Create `src/lib/api.ts`:

```ts
import { useAuth } from '@/contexts/AuthContext';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error?.message || 'Request failed',
          status: response.status,
        };
      }

      return { data, status: response.status };
    } catch (error) {
      return {
        error: 'Network error',
        status: 500,
      };
    }
  }

  async get<T>(endpoint: string, token?: string) {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.request<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  async post<T>(endpoint: string, data: any, token?: string) {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any, token?: string) {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.request<T>(endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, token?: string) {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }
}

export const apiClient = new ApiClient();
```

### 4. Create Task Hook

Create `src/hooks/useTasks.ts`:

```ts
import useSWR from 'swr';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface UseTasksReturn {
  tasks: Task[] | undefined;
  isLoading: boolean;
  isError: any;
  createTask: (taskData: Partial<Task>) => Promise<void>;
  updateTask: (id: string, taskData: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
  const { token } = useAuth();
  const { data, error, mutate } = useSWR<Task[]>(
    token ? ['/tasks', token] : null,
    ([_, authToken]) => fetchTasks(authToken)
  );

  const fetchTasks = async (authToken: string) => {
    const response = await apiClient.get<Task[]>('/tasks', authToken);
    if (response.error) throw new Error(response.error);
    return response.data || [];
  };

  const createTask = async (taskData: Partial<Task>) => {
    if (!token) throw new Error('No authentication token');

    const response = await apiClient.post<Task>('/tasks', taskData, token);
    if (response.error) throw new Error(response.error);

    // Optimistically update the cache
    mutate([...(data || []), response.data!], false);
  };

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    if (!token) throw new Error('No authentication token');

    const response = await apiClient.put<Task>(`/tasks/${id}`, taskData, token);
    if (response.error) throw new Error(response.error);

    // Update the cache
    mutate(
      data?.map((task) =>
        task.id === id ? { ...task, ...response.data } : task
      ),
      false
    );
  };

  const deleteTask = async (id: string) => {
    if (!token) throw new Error('No authentication token');

    const response = await apiClient.delete(`/tasks/${id}`, token);
    if (response.error) throw new Error(response.error);

    // Remove from cache
    mutate(data?.filter((task) => task.id !== id), false);
  };

  const toggleTaskCompletion = async (id: string) => {
    if (!data || !token) return;

    const task = data.find((t) => t.id === id);
    if (!task) return;

    // Optimistically update
    const updatedTasks = data.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    mutate(updatedTasks, false);

    try {
      await updateTask(id, { completed: !task.completed });
    } catch (error) {
      // Rollback on error
      mutate(data, false);
    }
  };

  return {
    tasks: data,
    isLoading: !error && !data,
    isError: error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  };
};
```

### 5. Create Task List Component

Create `src/components/tasks/TaskList.tsx`:

```tsx
import { Task } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { useTasks } from '@/hooks/useTasks';

interface TaskListProps {
  filter?: 'all' | 'active' | 'completed';
}

export const TaskList = ({ filter = 'all' }: TaskListProps) => {
  const { tasks, isLoading, isError, toggleTaskCompletion, deleteTask } = useTasks();

  if (isLoading) return <div>Loading tasks...</div>;
  if (isError) return <div>Error loading tasks: {isError.message}</div>;

  const filteredTasks = tasks?.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="space-y-4">
      {filteredTasks?.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={() => toggleTaskCompletion(task.id)}
          onDelete={() => deleteTask(task.id)}
        />
      ))}
      {filteredTasks && filteredTasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No tasks found. Create your first task!
        </div>
      )}
    </div>
  );
};
```

## Running the Application

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Production Preview
```bash
npm run start
```

## Testing the Application

### Manual Testing Flow
1. Navigate to the homepage
2. Click "Sign Up" and create a new account
3. Log in with your credentials
4. Create a new task using the form
5. Verify the task appears in your task list
6. Toggle task completion status
7. Update task details
8. Delete a task
9. Verify proper error handling when not authenticated

### API Integration Testing
1. Verify JWT tokens are properly attached to requests
2. Confirm user isolation (users can't see others' tasks)
3. Test 401 unauthorized handling
4. Test offline scenarios and loading states

## Key Integration Points

The frontend connects to the backend API using the following endpoints:
- `GET /api/{user_id}/tasks` - Fetch user's tasks
- `POST /api/{user_id}/tasks` - Create new task
- `GET /api/{user_id}/tasks/{id}` - Fetch specific task
- `PUT /api/{user_id}/tasks/{id}` - Update task
- `DELETE /api/{user_id}/tasks/{id}` - Delete task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion

JWT tokens obtained during authentication are automatically attached to requests via the API client.