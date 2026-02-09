// src/components/tasks/TaskForm.tsx
// Task form component for the application

import React, { useState } from 'react';
import { TaskFormData } from '../../lib/types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';

interface TaskFormProps {
  initialData?: TaskFormData;
  onSubmit: (data: TaskFormData) => void;
  onCancel?: () => void;
  submitButtonText?: string;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialData = {
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: ''
  },
  onSubmit,
  onCancel,
  submitButtonText = 'Save Task',
  isLoading = false
}) => {
  const [formData, setFormData] = useState<TaskFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePriorityChange = (value: string) => {
    setFormData(prev => ({ ...prev, priority: value as 'low' | 'medium' | 'high' }));

    // Clear error when user selects a value
    if (errors.priority) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.priority;
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title *
        </label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task title"
          required
        />
        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Task description"
        />
        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="dueDate" className="text-sm font-medium">
            Due Date
          </label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="priority" className="text-sm font-medium">
            Priority
          </label>
          <Select value={formData.priority} onValueChange={handlePriorityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Task category"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : submitButtonText}
        </Button>
      </div>
    </form>
  );
};