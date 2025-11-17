import type {
  Goal,
  FocusArea,
  Task,
  MatrixData,
  CreateGoalInput,
  CreateFocusAreaInput,
  CreateTaskInput,
} from '../types';
import { TaskStatus, TaskPriority } from '../types';

/**
 * Generates a unique ID for entities
 * Uses timestamp + random string for uniqueness
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Creates a new Goal entity with default values
 */
export function createGoal(input: CreateGoalInput): Goal {
  return {
    id: generateId(),
    title: input.title,
    description: input.description,
    createdDate: new Date(),
  };
}

/**
 * Creates a new FocusArea entity
 */
export function createFocusArea(input: CreateFocusAreaInput): FocusArea {
  return {
    id: generateId(),
    title: input.title,
    description: input.description,
    goalId: input.goalId,
  };
}

/**
 * Creates a new Task entity
 */
export function createTask(input: CreateTaskInput): Task {
  return {
    id: generateId(),
    title: input.title,
    description: input.description,
    areaId: input.areaId,
    status: input.status,
    priority: input.priority || TaskPriority.MEDIUM,
  };
}

/**
 * Creates 8 empty FocusArea entities for a given goal
 * The 8 focus areas represent the core areas surrounding the central goal
 * in the Harada Method matrix
 */
export function createFocusAreas(goalId: string): FocusArea[] {
  const defaultAreaTitles = [
    'Physical Development',
    'Mental Preparation',
    'Skill Acquisition',
    'Strategic Planning',
    'Performance Execution',
    'Recovery & Maintenance',
    'Relationship Building',
    'Personal Growth',
  ];

  return defaultAreaTitles.map((title) =>
    createFocusArea({
      title,
      description: `Focus area for ${title.toLowerCase()}`,
      goalId,
    })
  );
}

/**
 * Creates an empty task matrix with 8 tasks per focus area (64 total)
 * All tasks are initialized with pending status
 */
export function createEmptyTaskMatrix(focusAreaIds: string[]): Task[] {
  const tasks: Task[] = [];

  focusAreaIds.forEach((areaId) => {
    // Create 8 tasks per focus area
    for (let i = 1; i <= 8; i++) {
      tasks.push(
        createTask({
          title: `Task ${i}`,
          description: `Task ${i} for focus area`,
          areaId,
          status: TaskStatus.PENDING,
          priority: TaskPriority.MEDIUM,
        })
      );
    }
  });

  return tasks;
}

/**
 * Creates a complete empty matrix structure
 * Includes goal, 8 focus areas, and 64 empty tasks
 */
export function createEmptyMatrix(goalInput: CreateGoalInput): MatrixData {
  // Create the goal
  const goal = createGoal(goalInput);

  // Create 8 focus areas
  const focusAreas = createFocusAreas(goal.id);

  // Create 64 empty tasks (8 per focus area)
  const focusAreaIds = focusAreas.map((area) => area.id);
  const tasks = createEmptyTaskMatrix(focusAreaIds);

  return {
    goal,
    focusAreas,
    tasks,
  };
}

/**
 * Creates a minimal matrix for quick testing/development
 * Includes goal, 8 focus areas, but only 1 task per area (8 total)
 */
export function createMinimalMatrix(goalInput: CreateGoalInput): MatrixData {
  const goal = createGoal(goalInput);
  const focusAreas = createFocusAreas(goal.id);

  // Create just 1 task per focus area for minimal testing
  const tasks: Task[] = focusAreas.map((area) =>
    createTask({
      title: `Sample task for ${area.title}`,
      description: `A sample task to get started with ${area.title.toLowerCase()}`,
      areaId: area.id,
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    })
  );

  return {
    goal,
    focusAreas,
    tasks,
  };
}
