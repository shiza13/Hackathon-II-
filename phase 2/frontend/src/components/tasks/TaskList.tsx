// src/components/tasks/TaskList.tsx
// Task list component for the application

import React from 'react';
import { Task } from '../../lib/types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, loading }) => {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse-slow rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="mb-2 h-4 w-3/4 rounded bg-muted"></div>
            <div className="mb-2 h-3 w-full rounded bg-muted"></div>
            <div className="mb-2 h-3 w-2/3 rounded bg-muted"></div>
            <div className="flex justify-between">
              <div className="h-6 w-16 rounded bg-muted"></div>
              <div className="h-6 w-6 rounded bg-muted"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-lg text-muted-foreground">No tasks yet. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};