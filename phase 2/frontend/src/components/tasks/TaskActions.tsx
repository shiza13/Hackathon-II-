// src/components/tasks/TaskActions.tsx
// Task actions component for the application

import React from 'react';
import Link from 'next/link';
import { Task } from '../../lib/types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface TaskActionsProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskActions: React.FC<TaskActionsProps> = ({ task, onEdit, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(task);
    setShowDeleteModal(false);
  };

  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
        Edit
      </Button>
      <Button variant="destructive" size="sm" onClick={handleDeleteClick}>
        Delete
      </Button>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
        showCloseButton={true}
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to delete the task "{task.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};