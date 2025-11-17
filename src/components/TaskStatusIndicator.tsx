import React from 'react';
import { TaskStatus } from '../types';
import { getTaskStatusColor, getTaskStatusTextColor } from '../utils';

interface TaskStatusIndicatorProps {
  status: TaskStatus;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const TaskStatusIndicator: React.FC<TaskStatusIndicatorProps> = ({
  status,
  size = 'md',
  showText = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: {
      container: 'w-4 h-4',
      text: 'text-xs',
      icon: 'w-3 h-3',
    },
    md: {
      container: 'w-6 h-6',
      text: 'text-sm',
      icon: 'w-4 h-4',
    },
    lg: {
      container: 'w-8 h-8',
      text: 'text-base',
      icon: 'w-5 h-5',
    },
  };

  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.Completed:
        return {
          color: getTaskStatusColor(status),
          textColor: getTaskStatusTextColor(status),
          text: 'Completed',
          icon: (
            <svg
              className={`${sizeClasses[size].icon} text-white`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
      case TaskStatus.InProgress:
        return {
          color: getTaskStatusColor(status),
          textColor: getTaskStatusTextColor(status),
          text: 'In Progress',
          icon: (
            <div
              className={`${sizeClasses[size].container} ${getTaskStatusColor(status)} rounded-full flex items-center justify-center`}
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          ),
        };
      case TaskStatus.Pending:
      default:
        return {
          color: getTaskStatusColor(status),
          textColor: getTaskStatusTextColor(status),
          text: 'Pending',
          icon: (
            <svg
              className={`${sizeClasses[size].icon} text-gray-600`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div
        className={`${sizeClasses[size].container} ${config.color} rounded-full flex items-center justify-center`}
      >
        {config.icon}
      </div>
      {showText && (
        <span
          className={`${config.textColor} font-medium ${sizeClasses[size].text}`}
        >
          {config.text}
        </span>
      )}
    </div>
  );
};

// Compact version for use in grids/cells
export const TaskStatusDot: React.FC<{
  status: TaskStatus;
  className?: string;
}> = ({ status, className = '' }) => {
  const color = getTaskStatusColor(status);

  return (
    <div
      className={`inline-block w-3 h-3 rounded-full ${color} ${className}`}
    />
  );
};

// Status badge component
export const TaskStatusBadge: React.FC<TaskStatusIndicatorProps> = ({
  status,
  className = '',
}) => {
  const config = {
    [TaskStatus.Completed]: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      text: '✓ Done',
    },
    [TaskStatus.InProgress]: {
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      text: '⋯ Working',
    },
    [TaskStatus.Pending]: {
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      text: '○ Pending',
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}
    >
      {config.text}
    </span>
  );
};
