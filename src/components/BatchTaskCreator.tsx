import { useState, useEffect } from 'react';
import { TaskStatus, TaskPriority } from '../types';
import type { CreateTaskInput } from '../types';

interface BatchTaskItem {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  areaId: string;
}

interface BatchTaskCreatorProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Available focus area IDs */
  focusAreaIds: string[];
  /** Callback when tasks are created */
  onCreate: (tasks: CreateTaskInput[]) => void;
  /** Callback when modal should be closed */
  onClose: () => void;
}

/**
 * Modal component for creating multiple tasks at once
 */
export const BatchTaskCreator: React.FC<BatchTaskCreatorProps> = ({
  isOpen,
  focusAreaIds,
  onCreate,
  onClose,
}) => {
  const [tasks, setTasks] = useState<BatchTaskItem[]>([]);
  const [bulkStatus, setBulkStatus] = useState<TaskStatus>(TaskStatus.PENDING);
  const [bulkPriority, setBulkPriority] = useState<TaskPriority>(
    TaskPriority.MEDIUM
  );
  const [bulkAreaId, setBulkAreaId] = useState<string>('');

  // Initialize with one empty task
  useEffect(() => {
    if (isOpen && tasks.length === 0) {
      addTask();
    }
  }, [isOpen, tasks.length]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setBulkStatus(TaskStatus.PENDING);
      setBulkPriority(TaskPriority.MEDIUM);
      setBulkAreaId(focusAreaIds[0] || '');
    }
  }, [isOpen, focusAreaIds]);

  const generateId = () =>
    `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addTask = () => {
    const newTask: BatchTaskItem = {
      id: generateId(),
      title: '',
      description: '',
      status: bulkStatus,
      priority: bulkPriority,
      areaId: bulkAreaId,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const removeTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const updateTask = (
    taskId: string,
    field: keyof BatchTaskItem,
    value: any
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, [field]: value } : task
      )
    );
  };

  const applyBulkSettings = () => {
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        status: bulkStatus,
        priority: bulkPriority,
        areaId: bulkAreaId || task.areaId,
      }))
    );
  };

  const duplicateTask = (taskId: string) => {
    const taskToDuplicate = tasks.find((t) => t.id === taskId);
    if (taskToDuplicate) {
      const duplicatedTask: BatchTaskItem = {
        ...taskToDuplicate,
        id: generateId(),
        title: `${taskToDuplicate.title} (Copy)`,
      };
      setTasks((prev) => [...prev, duplicatedTask]);
    }
  };

  const loadTemplate = (template: string) => {
    const templates = getTaskTemplates();
    const templateTasks = templates[template] || [];

    const newTasks: BatchTaskItem[] = templateTasks.map((template) => ({
      id: generateId(),
      ...template,
      areaId: bulkAreaId || template.areaId,
      status: bulkStatus,
      priority: bulkPriority,
    }));

    setTasks(newTasks);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty tasks and validate
    const validTasks = tasks.filter(
      (task) => task.title.trim() && task.description.trim()
    );

    if (validTasks.length === 0) {
      alert('Please add at least one task with a title and description.');
      return;
    }

    // Convert to CreateTaskInput format
    const createTasks: CreateTaskInput[] = validTasks.map((task) => ({
      title: task.title.trim(),
      description: task.description.trim(),
      status: task.status,
      priority: task.priority,
      areaId: task.areaId,
    }));

    onCreate(createTasks);
    onClose();
  };

  const handleClose = () => {
    setTasks([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="batch-creator-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2
              id="batch-creator-title"
              className="text-xl font-semibold text-gray-900"
            >
              Create Multiple Tasks
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Efficiently create several tasks at once with bulk settings and
              templates
            </p>
          </div>
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

        {/* Bulk Settings */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Bulk Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Focus Area
              </label>
              <select
                value={bulkAreaId}
                onChange={(e) => setBulkAreaId(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {focusAreaIds.map((id) => (
                  <option key={id} value={id}>
                    Area {id.split('-')[1]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value as TaskStatus)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={TaskStatus.PENDING}>⏳ Pending</option>
                <option value={TaskStatus.IN_PROGRESS}>🔄 In Progress</option>
                <option value={TaskStatus.COMPLETED}>✅ Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={bulkPriority}
                onChange={(e) =>
                  setBulkPriority(e.target.value as TaskPriority)
                }
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={TaskPriority.LOW}>🔵 Low</option>
                <option value={TaskPriority.MEDIUM}>🟡 Medium</option>
                <option value={TaskPriority.HIGH}>🔴 High</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={applyBulkSettings}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Apply to All
              </button>
            </div>
          </div>

          {/* Templates */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Quick Templates
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => loadTemplate('physical')}
                className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                🏃 Physical Training
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('mental')}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                🧠 Mental Preparation
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('skill')}
                className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                🎯 Skill Development
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('business')}
                className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                💼 Business Tasks
              </button>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    Task {index + 1}
                  </h4>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => duplicateTask(task.id)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      title="Duplicate task"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeTask(task.id)}
                      className="text-red-400 hover:text-red-600 p-1"
                      title="Remove task"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) =>
                        updateTask(task.id, 'title', e.target.value)
                      }
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Task title..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={task.status}
                        onChange={(e) =>
                          updateTask(
                            task.id,
                            'status',
                            e.target.value as TaskStatus
                          )
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value={TaskStatus.PENDING}>⏳ Pending</option>
                        <option value={TaskStatus.IN_PROGRESS}>
                          🔄 In Progress
                        </option>
                        <option value={TaskStatus.COMPLETED}>
                          ✅ Completed
                        </option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={task.priority}
                        onChange={(e) =>
                          updateTask(
                            task.id,
                            'priority',
                            e.target.value as TaskPriority
                          )
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value={TaskPriority.LOW}>🔵 Low</option>
                        <option value={TaskPriority.MEDIUM}>🟡 Medium</option>
                        <option value={TaskPriority.HIGH}>🔴 High</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={task.description}
                    onChange={(e) =>
                      updateTask(task.id, 'description', e.target.value)
                    }
                    rows={2}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Task description..."
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={addTask}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              + Add Another Task
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Creating{' '}
            {tasks.filter((t) => t.title.trim() && t.description.trim()).length}{' '}
            valid tasks
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Create{' '}
              {
                tasks.filter((t) => t.title.trim() && t.description.trim())
                  .length
              }{' '}
              Tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Get predefined task templates
 */
function getTaskTemplates(): Record<string, Omit<BatchTaskItem, 'id'>[]> {
  return {
    physical: [
      {
        title: 'Morning stretching routine',
        description:
          'Complete 15-minute full-body stretching routine to improve flexibility',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        areaId: 'area-1',
      },
      {
        title: 'Strength training session',
        description: 'Complete weight training focusing on compound movements',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        areaId: 'area-1',
      },
      {
        title: 'Cardio endurance workout',
        description: '45-minute cardio session to build aerobic capacity',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        areaId: 'area-1',
      },
      {
        title: 'Recovery and mobility work',
        description: 'Foam rolling and mobility exercises for muscle recovery',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        areaId: 'area-1',
      },
    ],
    mental: [
      {
        title: 'Visualization practice',
        description: 'Spend 10 minutes visualizing successful performance',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        areaId: 'area-2',
      },
      {
        title: 'Goal review and adjustment',
        description: 'Review weekly goals and adjust based on progress',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        areaId: 'area-2',
      },
      {
        title: 'Stress management technique',
        description:
          'Practice deep breathing or meditation for stress reduction',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        areaId: 'area-2',
      },
      {
        title: 'Performance journaling',
        description: 'Record thoughts and insights from recent performances',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        areaId: 'area-2',
      },
    ],
    skill: [
      {
        title: 'Fundamental technique drill',
        description:
          'Practice basic technique for 30 minutes with focus on form',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        areaId: 'area-3',
      },
      {
        title: 'Advanced skill practice',
        description: 'Work on advanced techniques and combinations',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        areaId: 'area-3',
      },
      {
        title: 'Video analysis session',
        description:
          'Review performance footage and identify improvement areas',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        areaId: 'area-3',
      },
      {
        title: 'Skill maintenance practice',
        description: 'Quick practice session to maintain existing skills',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        areaId: 'area-3',
      },
    ],
    business: [
      {
        title: 'Market research analysis',
        description: 'Research industry trends and competitor analysis',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        areaId: 'area-4',
      },
      {
        title: 'Financial planning review',
        description: 'Review budget, expenses, and financial projections',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        areaId: 'area-4',
      },
      {
        title: 'Client relationship management',
        description: 'Follow up with clients and nurture relationships',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        areaId: 'area-4',
      },
      {
        title: 'Professional development',
        description: 'Read industry articles or take online courses',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        areaId: 'area-4',
      },
    ],
  };
}
