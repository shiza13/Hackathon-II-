// src/app/tasks/create/page.tsx
// Task creation page for the application

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTasks } from '../../../hooks/useTasks';
import { TaskForm } from '../../../components/tasks/TaskForm';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';

export default function CreateTaskPage() {
  const router = useRouter();
  const { createTask, loading: isSubmitting } = useTasks();

  const handleSubmit = async (taskData) => {
    const createdTask = await createTask(taskData);

    if (createdTask) {
      // Navigate back to the tasks list after successful creation
      router.push('/tasks');
      router.refresh(); // Refresh to show the new task
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Create New Task</h1>
        <Button variant="outline" asChild>
          <Link href="/tasks">Back to Tasks</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Task</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/tasks')}
            submitButtonText={isSubmitting ? 'Creating...' : 'Create Task'}
            isLoading={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}