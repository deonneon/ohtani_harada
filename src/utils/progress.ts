import { MatrixData, TaskStatus, Task, FocusArea } from '../types';

/**
 * Progress calculation utilities for the Harada Method matrix
 */

/**
 * Calculate completion percentage for a single focus area
 */
export function calculateAreaProgress(
  matrixData: MatrixData,
  areaId: string
): number {
  const tasks = matrixData.tasks.filter((task) => task.areaId === areaId);

  if (tasks.length === 0) return 0;

  const completedTasks = tasks.filter(
    (task) => task.status === TaskStatus.Completed
  ).length;
  return Math.round((completedTasks / tasks.length) * 100);
}

/**
 * Calculate overall progress percentage for the entire matrix
 */
export function calculateOverallProgress(matrixData: MatrixData): number {
  const totalTasks = matrixData.tasks.length;

  if (totalTasks === 0) return 0;

  const completedTasks = matrixData.tasks.filter(
    (task) => task.status === TaskStatus.Completed
  ).length;
  return Math.round((completedTasks / totalTasks) * 100);
}

/**
 * Get progress statistics for the matrix
 */
export interface ProgressStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  overallPercentage: number;
  areaBreakdown: Array<{
    areaId: string;
    areaTitle: string;
    completed: number;
    total: number;
    percentage: number;
  }>;
}

export function getProgressStats(matrixData: MatrixData): ProgressStats {
  const tasks = matrixData.tasks;

  const completed = tasks.filter(
    (task) => task.status === TaskStatus.Completed
  ).length;
  const inProgress = tasks.filter(
    (task) => task.status === TaskStatus.InProgress
  ).length;
  const pending = tasks.filter(
    (task) => task.status === TaskStatus.Pending
  ).length;
  const total = tasks.length;

  const areaBreakdown = matrixData.focusAreas.map((area) => {
    const areaTasks = tasks.filter((task) => task.areaId === area.id);
    const areaCompleted = areaTasks.filter(
      (task) => task.status === TaskStatus.Completed
    ).length;

    return {
      areaId: area.id,
      areaTitle: area.title,
      completed: areaCompleted,
      total: areaTasks.length,
      percentage:
        areaTasks.length > 0
          ? Math.round((areaCompleted / areaTasks.length) * 100)
          : 0,
    };
  });

  return {
    total,
    completed,
    inProgress,
    pending,
    overallPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    areaBreakdown,
  };
}

/**
 * Check if a milestone has been reached
 */
export function hasReachedMilestone(
  matrixData: MatrixData,
  milestone: number
): boolean {
  const progress = calculateOverallProgress(matrixData);
  return progress >= milestone;
}

/**
 * Get milestone progress (e.g., "75% of the way to 100%")
 */
export function getMilestoneProgress(matrixData: MatrixData): {
  currentMilestone: number;
  progressToNext: number;
  isComplete: boolean;
} {
  const progress = calculateOverallProgress(matrixData);
  const milestones = [25, 50, 75, 100];

  // Find the current milestone (the highest one we've reached or are working towards)
  let currentMilestone = 0;
  for (const milestone of milestones) {
    if (progress >= milestone) {
      currentMilestone = milestone;
    } else {
      break;
    }
  }

  const nextMilestone = milestones.find((m) => m > currentMilestone) || 100;
  const progressToNext =
    currentMilestone === 100
      ? 100
      : Math.round(
          ((progress - currentMilestone) / (nextMilestone - currentMilestone)) *
            100
        );

  return {
    currentMilestone,
    progressToNext,
    isComplete: progress >= 100,
  };
}

/**
 * Get task status color for visual indicators
 */
export function getTaskStatusColor(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.Completed:
      return 'bg-green-500';
    case TaskStatus.InProgress:
      return 'bg-blue-500';
    case TaskStatus.Pending:
    default:
      return 'bg-gray-300';
  }
}

/**
 * Get task status text color for visual indicators
 */
export function getTaskStatusTextColor(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.Completed:
      return 'text-green-700';
    case TaskStatus.InProgress:
      return 'text-blue-700';
    case TaskStatus.Pending:
    default:
      return 'text-gray-500';
  }
}

/**
 * Get progress bar color based on completion percentage
 */
export function getProgressBarColor(percentage: number): string {
  if (percentage >= 75) return 'bg-green-500';
  if (percentage >= 50) return 'bg-blue-500';
  if (percentage >= 25) return 'bg-yellow-500';
  return 'bg-gray-400';
}

/**
 * Calculate streak counter (consecutive days with completed tasks)
 * Note: This is a simplified version - in a real app, you'd track daily activity
 */
export function calculateStreak(matrixData: MatrixData): number {
  // For now, return a simple calculation based on completion rate
  // In a real implementation, this would track daily activity over time
  const stats = getProgressStats(matrixData);
  const completionRate = stats.total > 0 ? stats.completed / stats.total : 0;

  // Return a streak based on completion rate (simplified)
  if (completionRate >= 0.8) return Math.floor(completionRate * 10);
  if (completionRate >= 0.5) return Math.floor(completionRate * 5);
  return 0;
}
