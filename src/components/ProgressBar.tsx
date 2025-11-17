import React from 'react';
import { getProgressBarColor } from '../utils';

interface ProgressBarProps {
  /** Progress percentage (0-100) */
  progress: number;
  /** Optional label to display above the bar */
  label?: string;
  /** Optional size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show percentage text */
  showPercentage?: boolean;
  /** Custom className for the container */
  className?: string;
  /** Custom className for the progress bar fill */
  barClassName?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  size = 'md',
  showPercentage = true,
  className = '',
  barClassName = '',
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const sizeClasses = {
    sm: {
      container: 'h-2',
      text: 'text-xs',
    },
    md: {
      container: 'h-3',
      text: 'text-sm',
    },
    lg: {
      container: 'h-4',
      text: 'text-base',
    },
  };

  const barColor = getProgressBarColor(clampedProgress);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span
            className={`font-medium text-gray-700 ${sizeClasses[size].text}`}
          >
            {label}
          </span>
          {showPercentage && (
            <span
              className={`font-semibold text-gray-600 ${sizeClasses[size].text}`}
            >
              {clampedProgress}%
            </span>
          )}
        </div>
      )}

      <div
        className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size].container}`}
      >
        <div
          className={`h-full transition-all duration-300 ease-out rounded-full ${barColor} ${barClassName}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>

      {!label && showPercentage && (
        <div className="flex justify-center mt-1">
          <span
            className={`font-semibold text-gray-600 ${sizeClasses[size].text}`}
          >
            {clampedProgress}%
          </span>
        </div>
      )}
    </div>
  );
};

// Specialized progress bar for focus areas
interface AreaProgressBarProps extends Omit<ProgressBarProps, 'progress'> {
  completed: number;
  total: number;
  areaTitle: string;
}

export const AreaProgressBar: React.FC<AreaProgressBarProps> = ({
  completed,
  total,
  areaTitle,
  ...props
}) => {
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <ProgressBar
      progress={progress}
      label={`${areaTitle} (${completed}/${total})`}
      {...props}
    />
  );
};

// Milestone progress bar with special styling
interface MilestoneProgressBarProps extends ProgressBarProps {
  milestone: number;
  showMilestone?: boolean;
}

export const MilestoneProgressBar: React.FC<MilestoneProgressBarProps> = ({
  milestone,
  showMilestone = true,
  ...props
}) => {
  return (
    <div className="relative">
      <ProgressBar {...props} />
      {showMilestone && (
        <div
          className="absolute top-0 h-full w-0.5 bg-red-500 z-10"
          style={{ left: `${milestone}%` }}
        >
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
          <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-red-600 whitespace-nowrap">
            {milestone}%
          </div>
        </div>
      )}
    </div>
  );
};
