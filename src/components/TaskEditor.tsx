import { useState, useEffect, useRef } from 'react';
import { Task, CreateTaskInput, TaskStatus, TaskPriority } from '../types';

interface TaskEditorProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** The task to edit, or null for creating a new task */
  task: Task | null;
  /** The focus area ID this task belongs to */
  areaId: string;
  /** Callback when the modal should be closed */
  onClose: () => void;
  /** Callback when the task is saved */
  onSave: (taskData: CreateTaskInput) => void;
  /** Mode: 'modal' for full modal or 'inline' for inline editing */
  mode?: 'modal' | 'inline';
}

/**
 * Modal component for editing individual tasks
 */
export const TaskEditor: React.FC<TaskEditorProps> = ({
  isOpen,
  task,
  areaId,
  onClose,
  onSave,
  mode = 'modal'
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.PENDING);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [errors, setErrors] = useState<{title?: string; description?: string}>({});

  const titleInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen) {
      setTitle(task?.title || '');
      setDescription(task?.description || '');
      setStatus(task?.status || TaskStatus.PENDING);
      setPriority(task?.priority || TaskPriority.MEDIUM);
      setErrors({});

      // Focus title input when modal opens
      if (mode === 'modal') {
        setTimeout(() => titleInputRef.current?.focus(), 100);
      }
    }
  }, [isOpen, task, mode]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: {title?: string; description?: string} = {};

    // Validation
    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Task title must be 100 characters or less';
    }

    if (!description.trim()) {
      newErrors.description = 'Task description is required';
    } else if (description.length > 300) {
      newErrors.description = 'Task description must be 300 characters or less';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save the task
    onSave({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      areaId
    });

    onClose();
  };

  // Handle modal close (click outside or escape key)
  const handleClose = () => {
    setErrors({});
    onClose();
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && mode === 'modal') {
        handleClose();
      }
    };

    if (isOpen && mode === 'modal') {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, mode]);

  // Status options for dropdown
  const statusOptions = [
    { value: TaskStatus.PENDING, label: 'Not Started', color: 'bg-gray-100 text-gray-800' },
    { value: TaskStatus.IN_PROGRESS, label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    { value: TaskStatus.COMPLETED, label: 'Completed', color: 'bg-green-100 text-green-800' }
  ];

  const getStatusOption = (statusValue: TaskStatus) =>
    statusOptions.find(option => option.value === statusValue) || statusOptions[0];

  if (mode === 'inline') {
    // Inline editing mode
    return (
      <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-gray-50 rounded-lg border">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Title *
          </label>
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 ${
              errors.title ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Enter task title..."
            maxLength={100}
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className={`w-full px-2 py-1 text-sm border rounded resize-none focus:outline-none focus:ring-1 ${
              errors.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Describe what needs to be done..."
            maxLength={300}
          />
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value={TaskPriority.LOW}>Low Priority</option>
            <option value={TaskPriority.MEDIUM}>Medium Priority</option>
            <option value={TaskPriority.HIGH}>High Priority</option>
          </select>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {task ? 'Update' : 'Create'} Task
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  // Modal mode
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-editor-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2
            id="task-editor-title"
            className="text-xl font-semibold text-gray-900"
          >
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Field */}
          <div>
            <label
              htmlFor="task-title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Task Title *
            </label>
            <input
              ref={titleInputRef}
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Practice hitting mechanics for 30 minutes"
              maxLength={100}
              aria-describedby={errors.title ? "title-error" : undefined}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p id="title-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.title}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {title.length}/100 characters
            </p>
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="task-description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Task Description *
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
                errors.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe what needs to be done, why it's important, and any specific requirements..."
              maxLength={300}
              aria-describedby={errors.description ? "description-error" : undefined}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p id="description-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.description}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {description.length}/300 characters
            </p>
          </div>

          {/* Status Field */}
          <div>
            <label
              htmlFor="task-status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Task Status
            </label>
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="mt-2 flex gap-2">
              {statusOptions.map(option => (
                <span
                  key={option.value}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    status === option.value ? option.color : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {option.label}
                </span>
              ))}
            </div>
          </div>

          {/* Priority Field */}
          <div>
            <label
              htmlFor="task-priority"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Task Priority
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={TaskPriority.LOW}>🔵 Low Priority - Nice to have</option>
              <option value={TaskPriority.MEDIUM}>🟡 Medium Priority - Should do</option>
              <option value={TaskPriority.HIGH}>🔴 High Priority - Must do</option>
            </select>
            <div className="mt-2 flex gap-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                priority === TaskPriority.LOW ? 'bg-blue-100 text-blue-800' :
                priority === TaskPriority.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-600'
              }`}>
                {priority === TaskPriority.LOW && '🔵 Low'}
                {priority === TaskPriority.MEDIUM && '🟡 Medium'}
                {priority === TaskPriority.HIGH && '🔴 High'}
              </span>
            </div>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              💡 Task Creation Tips
            </h3>
            <p className="text-sm text-blue-800">
              Great tasks are <strong>specific</strong>, <strong>actionable</strong>, and <strong>measurable</strong>.
              Instead of "Practice more," write "Complete 100 swings with proper form analysis."
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onSubmit={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!title.trim() || !description.trim()}
          >
            {task ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
};
