import React from 'react';
import { type Task, TaskStatus, TaskPriority } from '../utils';
import Cell, { type CellProps } from './Cell';
import { TaskStatusIndicator } from './TaskStatusIndicator';

/**
 * Props specific to TaskCell
 */
interface TaskCellProps extends Omit<CellProps, 'children'> {
  /** The task data to display */
  task: Task;
}

/**
 * Status indicators for tasks
 */
const STATUS_INDICATORS: Record<
  TaskStatus,
  { icon: string; color: string; label: string }
> = {
  [TaskStatus.PENDING]: {
    icon: '⏳',
    color: 'text-gray-500',
    label: 'Pending',
  },
  [TaskStatus.IN_PROGRESS]: {
    icon: '🔄',
    color: 'text-blue-600',
    label: 'In Progress',
  },
  [TaskStatus.COMPLETED]: {
    icon: '✅',
    color: 'text-green-600',
    label: 'Completed',
  },
};

/**
 * Priority indicators for tasks
 */
const PRIORITY_INDICATORS: Record<
  TaskPriority,
  { icon: string; color: string; label: string; bgColor: string }
> = {
  [TaskPriority.LOW]: {
    icon: '🔵',
    color: 'text-blue-600',
    label: 'Low',
    bgColor: 'bg-blue-100',
  },
  [TaskPriority.MEDIUM]: {
    icon: '🟡',
    color: 'text-yellow-600',
    label: 'Medium',
    bgColor: 'bg-yellow-100',
  },
  [TaskPriority.HIGH]: {
    icon: '🔴',
    color: 'text-red-600',
    label: 'High',
    bgColor: 'bg-red-100',
  },
};

/**
 * TaskCell component for displaying individual tasks in the matrix
 * Shows task status, title, and provides interaction capabilities
 */
const TaskCell: React.FC<TaskCellProps> = ({
  task,
  isSelected = false,
  onClick,
  className = '',
  ...cellProps
}) => {
  const statusInfo = STATUS_INDICATORS[task.status];
  const priorityInfo = PRIORITY_INDICATORS[task.priority];

  const taskClasses = `
    bg-gradient-to-br from-amber-100 via-yellow-200 to-orange-200
    text-gray-900 border-2 border-yellow-300/60 shadow-sm
    ${
      isSelected
        ? 'from-amber-200 via-yellow-300 to-orange-300 border-yellow-400 shadow-lg ring-2 ring-yellow-400/40 scale-105'
        : 'hover:from-amber-200 hover:via-yellow-300 hover:to-orange-300 hover:shadow-md hover:scale-102'
    }
    transition-all duration-300 ease-out
    ${className}
  `.trim();

  return (
    <Cell
      {...cellProps}
      isSelected={isSelected}
      onClick={onClick}
      className={taskClasses}
      aria-label={`Task: ${task.title} - Status: ${statusInfo.label}`}
    >
      <div className="flex flex-col items-center justify-center h-full p-2 text-center relative">
        {/* Background pattern for depth */}
        <div className="absolute inset-0 bg-white/20 rounded-md"></div>

        {/* Priority indicator - top right corner */}
        <div className="absolute top-1 right-1 z-20">
          <div
            className={`w-4 h-4 rounded-full ${priorityInfo.bgColor} flex items-center justify-center shadow-sm`}
            role="img"
            aria-label={`Priority: ${priorityInfo.label}`}
            title={`Priority: ${priorityInfo.label}`}
          >
            <span className="text-xs">{priorityInfo.icon}</span>
          </div>
        </div>

        {/* Status indicator with enhanced styling */}
        <div className="flex items-center justify-center mb-2 relative z-10">
          <TaskStatusIndicator
            status={task.status}
            size="sm"
            showText={false}
          />
        </div>

        {/* Task title with better typography */}
        <div className="font-semibold text-xs mb-1 leading-tight line-clamp-2 relative z-10">
          {task.title}
        </div>

        {/* Task description with improved readability */}
        <div className="text-xs opacity-75 leading-tight line-clamp-2 mb-1 relative z-10">
          {task.description}
        </div>

        {/* Completion date for completed tasks */}
        {task.status === TaskStatus.COMPLETED && task.completedDate && (
          <div className="text-xs opacity-70 mt-1 px-2 py-0.5 bg-green-100/80 text-green-800 rounded-full backdrop-blur-sm relative z-10">
            ✓ {new Date(task.completedDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </Cell>
  );
};

export default TaskCell;
