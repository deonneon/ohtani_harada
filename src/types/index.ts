/**
 * Core data types for the Ohtani Harada Method application
 * Based on the 64-task matrix system inspired by Shohei Ohtani's success methodology
 */

/**
 * Status enumeration for tasks
 */
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed'
}

/**
 * Represents the central goal in the 64-task matrix
 */
export interface Goal {
  /** Unique identifier for the goal */
  id: string;
  /** Title of the goal */
  title: string;
  /** Detailed description of the goal */
  description: string;
  /** Date when the goal was created */
  createdDate: Date;
}

/**
 * Represents one of the 8 focus areas surrounding the central goal
 */
export interface FocusArea {
  /** Unique identifier for the focus area */
  id: string;
  /** Title of the focus area */
  title: string;
  /** Description of what this area encompasses */
  description: string;
  /** Reference to the goal this area supports */
  goalId: string;
}

/**
 * Represents an individual task within a focus area
 */
export interface Task {
  /** Unique identifier for the task */
  id: string;
  /** Title of the task */
  title: string;
  /** Detailed description of the task */
  description: string;
  /** Reference to the focus area this task belongs to */
  areaId: string;
  /** Current status of the task */
  status: TaskStatus;
  /** Date when the task was completed (undefined if not completed) */
  completedDate?: Date;
}

/**
 * Complete matrix data structure containing goal, focus areas, and tasks
 */
export interface MatrixData {
  /** The central goal */
  goal: Goal;
  /** Array of 8 focus areas */
  focusAreas: FocusArea[];
  /** Array of tasks (up to 64 total, 8 per focus area) */
  tasks: Task[];
}

/**
 * Utility type for creating new entities (without generated fields like id and dates)
 */
export type CreateGoalInput = Omit<Goal, 'id' | 'createdDate'>;
export type CreateFocusAreaInput = Omit<FocusArea, 'id'>;
export type CreateTaskInput = Omit<Task, 'id' | 'completedDate'>;
