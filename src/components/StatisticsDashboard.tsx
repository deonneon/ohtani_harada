import React, { useState, useMemo } from 'react';
import {
  MatrixData,
  TaskStatus,
  getProgressStats,
  calculateStreak,
  calculateOverallProgress,
} from '../utils';
import { ProgressBar, AreaProgressBar } from './ProgressBar';
import { TaskStatusBadge } from './TaskStatusIndicator';
import { AchievementBadge } from './CelebrationModal';

interface StatisticsDashboardProps {
  matrixData: MatrixData;
  className?: string;
}

/**
 * Statistics card component
 */
const StatCard: React.FC<{
  title: string;
  value: number;
  subtitle?: string;
  color: string;
  icon: React.ReactNode;
}> = ({ title, value, subtitle, color, icon }) => (
  <div className={`${color} rounded-lg p-4 text-white`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {subtitle && <p className="text-xs opacity-75">{subtitle}</p>}
      </div>
      <div className="text-3xl opacity-80">{icon}</div>
    </div>
  </div>
);

/**
 * Statistics Dashboard Component
 */
export const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({
  matrixData,
  className = '',
}) => {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');

  // Calculate statistics
  const stats = useMemo(() => getProgressStats(matrixData), [matrixData]);
  const streak = useMemo(() => calculateStreak(matrixData), [matrixData]);

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return matrixData.tasks.filter((task) => {
      const statusMatch =
        statusFilter === 'all' || task.status === statusFilter;
      const areaMatch = areaFilter === 'all' || task.areaId === areaFilter;
      return statusMatch && areaMatch;
    });
  }, [matrixData.tasks, statusFilter, areaFilter]);

  // Filtered area breakdown
  const filteredAreaStats = useMemo(() => {
    const areaStats = new Map<
      string,
      { completed: number; total: number; title: string }
    >();

    // Initialize with all areas
    matrixData.focusAreas.forEach((area) => {
      areaStats.set(area.id, { completed: 0, total: 0, title: area.title });
    });

    // Count filtered tasks per area
    filteredTasks.forEach((task) => {
      const areaStat = areaStats.get(task.areaId);
      if (areaStat) {
        areaStat.total++;
        if (task.status === TaskStatus.Completed) {
          areaStat.completed++;
        }
      }
    });

    return Array.from(areaStats.values()).filter((stat) => stat.total > 0);
  }, [matrixData.focusAreas, filteredTasks]);

  const statusOptions: Array<{ value: TaskStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All Status' },
    { value: TaskStatus.Pending, label: 'Pending' },
    { value: TaskStatus.InProgress, label: 'In Progress' },
    { value: TaskStatus.Completed, label: 'Completed' },
  ];

  const areaOptions = [
    { value: 'all', label: 'All Areas' },
    ...matrixData.focusAreas.map((area) => ({
      value: area.id,
      label: area.title,
    })),
  ];

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Progress Dashboard
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as TaskStatus | 'all')
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Filter by Area
            </label>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {areaOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Tasks"
            value={filteredTasks.length}
            subtitle={`of ${matrixData.tasks.length} total`}
            color="bg-blue-600"
            icon="📋"
          />
          <StatCard
            title="Completed"
            value={
              filteredTasks.filter((t) => t.status === TaskStatus.Completed)
                .length
            }
            subtitle={`${stats.overallPercentage}% complete`}
            color="bg-green-600"
            icon="✅"
          />
          <StatCard
            title="In Progress"
            value={
              filteredTasks.filter((t) => t.status === TaskStatus.InProgress)
                .length
            }
            color="bg-yellow-600"
            icon="🔄"
          />
          <StatCard
            title="Streak"
            value={streak}
            subtitle="consecutive tasks"
            color="bg-purple-600"
            icon="🔥"
          />
        </div>

        {/* Overall Progress */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Overall Progress
          </h3>
          <ProgressBar
            progress={stats.overallPercentage}
            label={`Overall Completion (${stats.completed}/${stats.total} tasks)`}
            size="lg"
            className="w-full"
          />
        </div>

        {/* Area Breakdown */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Focus Area Progress
          </h3>
          <div className="space-y-3">
            {filteredAreaStats.map((area, index) => (
              <AreaProgressBar
                key={index}
                completed={area.completed}
                total={area.total}
                areaTitle={area.title}
                size="md"
                className="w-full"
              />
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Task Status Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">Pending</p>
                  <p className="text-2xl font-bold text-red-900">
                    {
                      filteredTasks.filter(
                        (t) => t.status === TaskStatus.Pending
                      ).length
                    }
                  </p>
                </div>
                <TaskStatusBadge status={TaskStatus.Pending} />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {
                      filteredTasks.filter(
                        (t) => t.status === TaskStatus.InProgress
                      ).length
                    }
                  </p>
                </div>
                <TaskStatusBadge status={TaskStatus.InProgress} />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {
                      filteredTasks.filter(
                        (t) => t.status === TaskStatus.Completed
                      ).length
                    }
                  </p>
                </div>
                <TaskStatusBadge status={TaskStatus.Completed} />
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AchievementBadge
              title="First Steps"
              description="Complete your first task"
              icon="🎯"
              earned={stats.completed > 0}
              earnedDate={stats.completed > 0 ? new Date() : undefined}
            />
            <AchievementBadge
              title="Quarter Way"
              description="Reach 25% completion"
              icon="⭐"
              earned={stats.overallPercentage >= 25}
              earnedDate={
                stats.overallPercentage >= 25 ? new Date() : undefined
              }
            />
            <AchievementBadge
              title="Halfway Hero"
              description="Reach 50% completion"
              icon="🎊"
              earned={stats.overallPercentage >= 50}
              earnedDate={
                stats.overallPercentage >= 50 ? new Date() : undefined
              }
            />
            <AchievementBadge
              title="Three-Quarter Champion"
              description="Reach 75% completion"
              icon="🏆"
              earned={stats.overallPercentage >= 75}
              earnedDate={
                stats.overallPercentage >= 75 ? new Date() : undefined
              }
            />
            <AchievementBadge
              title="Goal Crusher"
              description="Complete 100% of tasks"
              icon="👑"
              earned={stats.overallPercentage >= 100}
              earnedDate={
                stats.overallPercentage >= 100 ? new Date() : undefined
              }
            />
            <AchievementBadge
              title="Streak Master"
              description="Maintain a 5+ task streak"
              icon="🔥"
              earned={streak >= 5}
              earnedDate={streak >= 5 ? new Date() : undefined}
            />
            <AchievementBadge
              title="Area Expert"
              description="Complete all tasks in one area"
              icon="🎖️"
              earned={stats.areaBreakdown.some(
                (area) => area.percentage >= 100
              )}
              earnedDate={
                stats.areaBreakdown.some((area) => area.percentage >= 100)
                  ? new Date()
                  : undefined
              }
            />
            <AchievementBadge
              title="Consistency King"
              description="Complete 10+ tasks"
              icon="👑"
              earned={stats.completed >= 10}
              earnedDate={stats.completed >= 10 ? new Date() : undefined}
            />
          </div>
        </div>

        {/* Motivational Messages */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Motivation</h3>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">💪</div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {stats.overallPercentage === 100
                    ? "🎉 Incredible! You've conquered your goal!"
                    : stats.overallPercentage >= 75
                      ? "🚀 You're in the home stretch! Keep pushing!"
                      : stats.overallPercentage >= 50
                        ? '⚡ Halfway there! Your dedication is inspiring!'
                        : stats.overallPercentage >= 25
                          ? '🌟 Great progress! Stay consistent!'
                          : stats.completed > 0
                            ? '🎯 Every completed task brings you closer to success!'
                            : '🌱 Start small, dream big. Your journey begins with the first task!'}
                </p>
                <p className="text-xs text-gray-600">
                  {stats.overallPercentage < 100
                    ? `${100 - stats.overallPercentage}% to go. You've got this!`
                    : "You've achieved something remarkable. What's your next goal?"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
