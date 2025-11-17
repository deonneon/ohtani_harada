// Component exports
export { default as Grid } from './Grid';
export { default as Cell } from './Cell';
export { default as GoalCell } from './GoalCell';
export { default as AreaHeaderCell } from './AreaHeaderCell';
export { default as TaskCell } from './TaskCell';
export { GoalEditor } from './GoalEditor';
export { FocusAreaEditor } from './FocusAreaEditor';
export { SetupWizard } from './SetupWizard';
export { TaskEditor } from './TaskEditor';
export { BatchTaskCreator } from './BatchTaskCreator';
export { TaskList } from './TaskList';
export { TaskOrganizer } from './TaskOrganizer';
export { RecoveryDialog } from './RecoveryDialog';
export {
  ProgressBar,
  AreaProgressBar,
  MilestoneProgressBar,
} from './ProgressBar';
export {
  TaskStatusIndicator,
  TaskStatusDot,
  TaskStatusBadge,
} from './TaskStatusIndicator';
export { StatisticsDashboard } from './StatisticsDashboard';
export { CelebrationModal, AchievementBadge } from './CelebrationModal';
export { default as ExportModal } from './ExportModal';
export { default as TemplateSelector } from './TemplateSelector';
export { default as TemplateCustomizer } from './TemplateCustomizer';

// CellProps is imported directly from Cell.tsx by components that need it
