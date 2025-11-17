import React, { useState } from 'react';
import { Task, FocusArea } from '../types';
import { TaskList } from './TaskList';

interface TaskOrganizerProps {
  /** All tasks */
  tasks: Task[];
  /** All focus areas */
  focusAreas: FocusArea[];
  /** Callback when tasks are reordered */
  onTaskReorder: (tasks: Task[]) => void;
  /** Callback when a task is clicked for editing */
  onTaskClick: (task: Task) => void;
  /** Whether drag and drop is enabled */
  dragEnabled?: boolean;
}

/**
 * Component for organizing and displaying tasks by focus area
 */
export const TaskOrganizer: React.FC<TaskOrganizerProps> = ({
  tasks,
  focusAreas,
  onTaskReorder,
  onTaskClick,
  dragEnabled = true
}) => {
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(
    new Set(focusAreas.map(area => area.id))
  );

  const toggleAreaExpansion = (areaId: string) => {
    setExpandedAreas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(areaId)) {
        newSet.delete(areaId);
      } else {
        newSet.add(areaId);
      }
      return newSet;
    });
  };

  const handleAreaTaskReorder = (areaId: string, reorderedTasks: Task[]) => {
    // Update the task order for this specific area
    // We'll need to maintain the relative order within each area
    const otherTasks = tasks.filter(task => task.areaId !== areaId);
    const updatedTasks = [...otherTasks, ...reorderedTasks];
    onTaskReorder(updatedTasks);
  };

  return (
    <div className="space-y-6">
      {focusAreas.map((area, index) => {
        const areaTasks = tasks.filter(task => task.areaId === area.id);
        const isExpanded = expandedAreas.has(area.id);
        const completedTasks = areaTasks.filter(task => task.status === 'completed').length;

        return (
          <div key={area.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Area Header */}
            <div
              className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              onClick={() => toggleAreaExpansion(area.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleAreaExpansion(area.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-expanded={isExpanded}
              aria-controls={`area-content-${area.id}`}
              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${area.title} focus area`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{area.title}</h3>
                  <p className="text-sm text-gray-600">{area.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Progress Indicator */}
                <div className="text-sm text-gray-600">
                  {completedTasks}/{areaTasks.length} completed
                </div>

                {/* Progress Bar */}
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: areaTasks.length > 0 ? `${(completedTasks / areaTasks.length) * 100}%` : '0%' }}
                  />
                </div>

                {/* Expand/Collapse Icon */}
                <button
                  className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={isExpanded ? 'Collapse area' : 'Expand area'}
                >
                  <svg
                    className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Area Content */}
            {isExpanded && (
              <div id={`area-content-${area.id}`} className="p-4">
                {areaTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-3xl mb-2">📝</div>
                    <p className="mb-4">No tasks in this focus area yet.</p>
                    <p className="text-sm">
                      Click "Create Task" or "Batch Create" to add tasks to this area.
                    </p>
                  </div>
                ) : (
                  <TaskList
                    tasks={areaTasks}
                    areaId={area.id}
                    onReorder={(reorderedTasks) => handleAreaTaskReorder(area.id, reorderedTasks)}
                    onTaskClick={onTaskClick}
                    dragEnabled={dragEnabled}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Summary Stats */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Matrix Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {focusAreas.map((area, index) => {
            const areaTasks = tasks.filter(task => task.areaId === area.id);
            const completedCount = areaTasks.filter(task => task.status === 'completed').length;
            const inProgressCount = areaTasks.filter(task => task.status === 'in-progress').length;
            const pendingCount = areaTasks.filter(task => task.status === 'pending').length;

            return (
              <div key={area.id} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <h4 className="font-medium text-gray-900 truncate">{area.title}</h4>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Tasks:</span>
                    <span className="font-medium">{areaTasks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">✅ Completed:</span>
                    <span className="font-medium text-green-600">{completedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">🔄 In Progress:</span>
                    <span className="font-medium text-blue-600">{inProgressCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">⏳ Pending:</span>
                    <span className="font-medium text-gray-600">{pendingCount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
