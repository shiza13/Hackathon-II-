// src/lib/types.ts
// TypeScript interfaces for the application

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  success: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name?: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TaskFilter {
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}