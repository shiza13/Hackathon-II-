// src/app/tasks/page.tsx
// Task list page for the application

'use client';

import React from 'react';
import Link from 'next/link';
import { useTasks } from '../../hooks/useTasks';
import { TaskList } from '../../components/tasks/TaskList';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function TasksPage() {
  const { tasks, loading, error, fetchTasks } = useTasks();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Your Tasks</h1>

        <Button asChild>
          <Link href="/tasks/create">Create New Task</Link>
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
          <p>Error: {error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => fetchTasks()}
          >
            Retry
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Task List</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskList tasks={tasks} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}