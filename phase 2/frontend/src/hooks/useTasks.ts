// src/hooks/useTasks.ts
// Custom hook for task management operations

import { useState, useEffect } from 'react';
import apiClient from '../lib/api';
import { Task, TaskFormData, TaskFilter } from '../lib/types';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: (filters?: TaskFilter) => Promise<void>;
  createTask: (taskData: TaskFormData) => Promise<Task | null>;
  updateTask: (id: string, taskData: Partial<TaskFormData>) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  toggleTaskCompletion: (id: string) => Promise<Task | null>;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from API
  const fetchTasks = async (filters?: TaskFilter) => {
    setLoading(true);
    setError(null);

    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';

      const response = await apiClient.get<{ data: Task[] }>(endpoint);
      setTasks(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async (taskData: TaskFormData): Promise<Task | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<{ data: Task }>('/tasks', taskData);
      const newTask = response.data;

      // Optimistically update the local state
      setTasks(prevTasks => [...prevTasks, newTask]);

      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      console.error('Error creating task:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update a task
  const updateTask = async (id: string, taskData: Partial<TaskFormData>): Promise<Task | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.put<{ data: Task }>(`/tasks/${id}`, taskData);
      const updatedTask = response.data;

      // Optimistically update the local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? updatedTask : task
        )
      );

      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      console.error('Error updating task:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (id: string): Promise<Task | null> => {
    setLoading(true);
    setError(null);

    try {
      // Find the current task to get its current completion status
      const currentTask = tasks.find(task => task.id === id);
      if (!currentTask) {
        throw new Error('Task not found');
      }

      const updatedTask = {
        ...currentTask,
        completed: !currentTask.completed
      };

      // Optimistically update the local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? { ...updatedTask } : task
        )
      );

      // Send the update to the server
      const response = await apiClient.patch<{ data: Task }>(`/tasks/${id}`, {
        completed: updatedTask.completed
      });

      // Update the state with the server response in case it differs
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? response.data : task
        )
      );

      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle task completion');
      console.error('Error toggling task completion:', err);

      // Revert optimistic update on error
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? { ...tasks.find(t => t.id === id)! } : task
        )
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await apiClient.delete(`/tasks/${id}`);

      // Optimistically update the local state
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      console.error('Error deleting task:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on initial load
  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  };
};