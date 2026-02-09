'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import apiClient from '../../../lib/api';
import { Task } from '../../../lib/types';

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [editingTask, setEditingTask] = useState<{ id: string; title: string; description: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { user: authUser, logout, isAuthenticated } = useAuth();

  // Handle authentication state changes
  useEffect(() => {
    if (!isAuthenticated) {
      if (!loading) { // Only redirect if loading has completed
        router.push('/auth/login');
      }
    } else if (authUser) {
      setUser(authUser);
    }
  }, [isAuthenticated, authUser, router, loading]);

  // Fetch user data and tasks when user is set
  useEffect(() => {
    if (user && user.id) {
      fetchUserData();
      fetchTasks();
      setLoading(false);
    }
  }, [user]); // Only run when user changes

  const fetchUserData = async () => {
    if (!user?.id) return; // Guard clause

    try {
      // This would fetch user-specific data using the API client
      // which automatically includes the JWT token
      const response = await apiClient.get(`/api/users/${user.id}`);
      setUserData(response.data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data');
    }
  };

  const fetchTasks = async () => {
    if (!user?.id) return; // Guard clause

    setTasksLoading(true);
    try {
      // Fetch tasks for the logged-in user
      const response = await apiClient.get(`/api/v1/${user.id}/tasks`);
      setTasks(response.data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks');
    } finally {
      setTasksLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim() || !user?.id) return;

    try {
      const response = await apiClient.post(`/api/v1/${user.id}/tasks`, {
        title: newTaskTitle,
        description: newTaskDescription,
        completed: false
      });

      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
      setNewTaskDescription('');
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task');
    }
  };

  const updateTask = async () => {
    if (!editingTask || !editingTask.title.trim() || !user?.id) return;

    try {
      const response = await apiClient.put(`/api/v1/${user.id}/tasks/${editingTask.id}`, {
        title: editingTask.title,
        description: editingTask.description
      });

      setTasks(tasks.map(task =>
        task.id === editingTask.id ? response.data : task
      ));
      setEditingTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    if (!user?.id) return;

    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const response = await apiClient.patch(`/api/v1/${user.id}/tasks/${taskId}/complete`, {
        completed: !task.completed
      });

      setTasks(tasks.map(task =>
        task.id === taskId ? response.data : task
      ));
    } catch (err) {
      console.error('Error updating task completion:', err);
      setError('Failed to update task completion');
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user?.id) return;

    try {
      await apiClient.delete(`/api/v1/${user.id}/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
    }
  };

  const handleLogout = async () => {
    try {
      logout();
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Todo Dashboard</h1>
            </div>
            <div className="flex items-center">
              <div className="mr-4 text-sm text-gray-700">
                Welcome, {user?.email}
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Welcome to your dashboard!</h2>
              <p className="mt-2 text-gray-600">Your user ID: {user?.id}</p>
              <p className="text-gray-600">Email: {user?.email}</p>
              <div className="mt-4">
                <button
                  onClick={fetchUserData}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Fetch User Profile
                </button>
              </div>
              {userData && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                  <h3 className="font-medium text-gray-900">User Profile:</h3>
                  <p>ID: {userData.id}</p>
                  <p>Email: {userData.email}</p>
                  <p>Created: {userData.created_at}</p>
                </div>
              )}
            </div>

            {/* Task Management Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Manage Your Tasks</h3>

              {/* Add Task Form */}
              <div className="mb-6">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Task title..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    onClick={addTask}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Add Task
                  </button>
                </div>
                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Task description..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={2}
                />
              </div>

              {/* Tasks List */}
              {tasksLoading ? (
                <div className="text-center py-4">Loading tasks...</div>
              ) : (
                <div className="space-y-3">
                  {tasks.length === 0 ? (
                    <div className="text-center py-4 text-gray-600">No tasks yet. Add your first task!</div>
                  ) : (
                    tasks.map((task) => (
                      <div key={task.id} className="p-4 bg-white rounded-md shadow-sm border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => toggleTaskCompletion(task.id)}
                              className="mt-1 h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <div className="flex-1">
                              {editingTask?.id === task.id ? (
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    value={editingTask.title}
                                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    autoFocus
                                  />
                                  <textarea
                                    value={editingTask.description}
                                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows={2}
                                  />
                                </div>
                              ) : (
                                <div>
                                  <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                    {task.title}
                                  </h4>
                                  {task.description && (
                                    <p className={`mt-1 text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                                      {task.description}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            {editingTask?.id === task.id ? (
                              <>
                                <button
                                  onClick={updateTask}
                                  className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingTask(null)}
                                  className="px-3 py-1 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => setEditingTask({ id: task.id, title: task.title, description: task.description || '' })}
                                  className="px-3 py-1 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}