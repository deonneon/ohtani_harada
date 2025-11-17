import { useState, useEffect, useMemo } from 'react';
import { type Goal, type CreateGoalInput } from '../types';
import { useAutoSave, useAutoSaveIndicator } from '../utils';

interface GoalEditorProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** The goal to edit, or null for creating a new goal */
  goal: Goal | null;
  /** Callback when the modal should be closed */
  onClose: () => void;
  /** Callback when the goal is saved */
  onSave: (goalData: CreateGoalInput) => void;
}

/**
 * Modal component for editing the central goal
 */
export const GoalEditor: React.FC<GoalEditorProps> = ({
  isOpen,
  goal,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  // Auto-save functionality - use memoized formData to prevent infinite loops
  const formData = useMemo(() => ({ title, description }), [title, description]);
  const autoSave = useAutoSave(formData, {
    storageKey: `goal-editor-${goal?.id || 'new'}`,
    delay: 1500, // Save after 1.5 seconds of inactivity
    enabled: false, // Autosave disabled
  });
  const { saveStatus, saveStatusText } = useAutoSaveIndicator(autoSave);

  // Reset form when modal opens/closes or goal changes
  useEffect(() => {
    if (isOpen) {
      // Load from goal or auto-saved draft
      const savedData = autoSave.savedData;
      if (
        savedData &&
        (!goal ||
          (goal.title === savedData.title &&
            goal.description === savedData.description))
      ) {
        // Use saved draft if it exists and matches current goal (or no goal set)
        setTitle(savedData.title || '');
        setDescription(savedData.description || '');
      } else {
        // Use goal data
        setTitle(goal?.title || '');
        setDescription(goal?.description || '');
      }
      setErrors({});
    }
  }, [isOpen, goal, autoSave.savedData]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string; description?: string } = {};

    // Validation
    if (!title.trim()) {
      newErrors.title = 'Goal title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Goal title must be 100 characters or less';
    }

    if (!description.trim()) {
      newErrors.description = 'Goal description is required';
    } else if (description.length > 500) {
      newErrors.description = 'Goal description must be 500 characters or less';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save the goal
    onSave({
      title: title.trim(),
      description: description.trim(),
    });

    // Clear auto-saved draft on successful save
    autoSave.clearSaved();

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
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-editor-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2
            id="goal-editor-title"
            className="text-xl font-semibold text-gray-900"
          >
            {goal ? 'Edit Goal' : 'Set Your Goal'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Field */}
          <div>
            <label
              htmlFor="goal-title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Goal Title *
            </label>
            <input
              id="goal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="e.g., Become a Professional Baseball Player"
              maxLength={100}
              aria-describedby={errors.title ? 'title-error' : undefined}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p
                id="title-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
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
              htmlFor="goal-description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Goal Description *
            </label>
            <textarea
              id="goal-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
                errors.description
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Describe your goal in detail. What does success look like? Why is this important to you?"
              maxLength={500}
              aria-describedby={
                errors.description ? 'description-error' : undefined
              }
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p
                id="description-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.description}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {description.length}/500 characters
            </p>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              💡 What makes a great goal?
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>
                <strong>Like Shohei Ohtani:</strong> His goal wasn't just "play
                baseball" - it was to become a two-way superstar who
                revolutionized the sport through unprecedented performance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div>
                  <h4 className="font-medium mb-1">✅ Good Examples:</h4>
                  <ul className="text-xs space-y-1">
                    <li>• "Become a world-class software architect"</li>
                    <li>
                      • "Build a sustainable business serving 10K customers"
                    </li>
                    <li>• "Master advanced mathematics and physics"</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-1">❌ Too Vague:</h4>
                  <ul className="text-xs space-y-1">
                    <li>• "Get better at coding"</li>
                    <li>• "Make more money"</li>
                    <li>• "Be successful"</li>
                  </ul>
                </div>
              </div>
              <p className="mt-2 text-xs italic">
                Your goal should inspire you, challenge you, and be specific
                enough to break down into actionable steps.
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          {/* Auto-save indicator */}
          <div className="flex items-center gap-2 text-sm">
            {saveStatus === 'saving' && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            )}
            {saveStatus === 'saved' && (
              <div className="flex items-center gap-2 text-green-600">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{saveStatusText}</span>
              </div>
            )}
            {saveStatus === 'unsaved' && autoSave.savedData && (
              <div className="flex items-center gap-2 text-orange-600">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Draft available</span>
              </div>
            )}
          </div>
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
            {goal ? 'Update Goal' : 'Set Goal'}
          </button>
        </div>
      </div>
    </div>
  );
};
