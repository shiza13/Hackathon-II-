// src/app/tasks/[id]/edit/page.tsx
// Task editing page for the application

'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTasks } from '../../../../hooks/useTasks';
import { TaskForm } from '../../../../components/tasks/TaskForm';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';

export default function EditTaskPage() {
  const { id } = useParams();
  const router = useRouter();
  const { tasks, loading, error, updateTask } = useTasks();

  // Find the specific task
  const task = tasks.find(t => t.id === id);

  const handleSubmit = async (taskData) => {
    const updatedTask = await updateTask(id, taskData);

    if (updatedTask) {
      // Navigate back to the task detail page after successful update
      router.push(`/tasks/${id}`);
      router.refresh(); // Refresh to show the updated task
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse-slow rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 h-8 w-3/4 rounded bg-muted"></div>
          <div className="mb-2 h-4 w-full rounded bg-muted"></div>
          <div className="mb-2 h-4 w-2/3 rounded bg-muted"></div>
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

  // Format task data for the form
  const taskFormData = {
    title: task.title,
    description: task.description || '',
    dueDate: task.dueDate || '',
    priority: task.priority || 'medium',
    category: task.category || ''
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Edit Task</h1>
        <Button variant="outline" onClick={() => router.push(`/tasks/${id}`)}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Task</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm
            initialData={taskFormData}
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/tasks/${id}`)}
            submitButtonText="Update Task"
          />
        </CardContent>
      </Card>
    </div>
  );
}