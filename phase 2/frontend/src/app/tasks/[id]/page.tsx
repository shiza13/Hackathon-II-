// src/app/tasks/[id]/page.tsx
// Individual task page for the application

'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTasks } from '../../../hooks/useTasks';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { formatDate } from '../../../lib/utils';

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { tasks, loading, error, deleteTask } = useTasks();

  // Find the specific task
  const task = tasks.find(t => t.id === id);

  const handleDelete = async () => {
    if (task && confirm('Are you sure you want to delete this task?')) {
      const success = await deleteTask(task.id);

      if (success) {
        router.push('/tasks');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse-slow rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 h-8 w-3/4 rounded bg-muted"></div>
          <div className="mb-2 h-4 w-full rounded bg-muted"></div>
          <div className="mb-2 h-4 w-2/3 rounded bg-muted"></div>
          <div className="mt-6 flex space-x-2">
            <div className="h-10 w-20 rounded bg-muted"></div>
            <div className="h-10 w-20 rounded bg-muted"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg bg-red-50 p-6 text-red-700">
          <p>Error: {error}</p>
          <Button variant="outline" className="mt-2" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg bg-card p-6 text-center">
          <h2 className="text-xl font-bold text-foreground">Task Not Found</h2>
          <p className="text-muted-foreground">The task you're looking for doesn't exist or may have been deleted.</p>
          <Button className="mt-4" onClick={() => router.push('/tasks')}>
            Back to Tasks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Task Details</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => router.push(`/tasks/${task.id}/edit`)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h2 className={`text-xl font-bold ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task.title}
            </h2>
          </div>

          {task.description && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
              <p className={`${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {task.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  task.completed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Priority</h3>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  task.priority === 'high'
                    ? 'bg-red-100 text-red-800'
                    : task.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>

            {task.category && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Category</h3>
                <div>
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                    {task.category}
                  </span>
                </div>
              </div>
            )}

            {task.dueDate && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Due Date</h3>
                <div className="text-foreground">
                  {formatDate(task.dueDate)}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Created: {formatDate(task.createdAt)}
            </div>
            <div className="text-sm text-muted-foreground">
              Updated: {formatDate(task.updatedAt)}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={() => router.push('/tasks')}>
          Back to Tasks
        </Button>
      </div>
    </div>
  );
}