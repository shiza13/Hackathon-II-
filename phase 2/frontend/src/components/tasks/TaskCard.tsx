// src/components/tasks/TaskCard.tsx
// Individual task card component for the application

import React from 'react';
import { useRouter } from 'next/navigation';
import { Task } from '../../lib/types';
import { useTasks } from '../../hooks/useTasks';
import { formatDate } from '../../lib/utils';
import { TaskActions } from './TaskActions';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const router = useRouter();
  const { toggleTaskCompletion } = useTasks();

  const handleToggleCompletion = async () => {
    try {
      await toggleTaskCompletion(task.id);
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleEdit = (task: Task) => {
    router.push(`/tasks/${task.id}/edit`);
  };

  const handleDelete = async (taskToDelete: Task) => {
    // This will be handled by parent or in a more centralized way
    console.log('Delete task:', taskToDelete.id);
  };

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleCompletion}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <div className="flex-1">
            <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`mt-1 text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        <TaskActions
          task={task}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          {task.priority && (
            <span className={`px-2 py-1 rounded-full ${
              task.priority === 'high'
                ? 'bg-red-100 text-red-800'
                : task.priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
            }`}>
              {task.priority}
            </span>
          )}
          {task.category && (
            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
              {task.category}
            </span>
          )}
        </div>

        {task.dueDate && (
          <span className="text-muted-foreground">
            Due: {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      <div className="mt-3 text-xs text-muted-foreground">
        Created: {formatDate(task.createdAt)}
      </div>
    </div>
  );
};