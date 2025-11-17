import {
  MatrixData,
  Goal,
  FocusArea,
  Task,
  TaskStatus,
  CreateFocusAreaInput,
  CreateTaskInput,
} from './types';
import { createFocusArea, createTask } from './factories';

/**
 * Utility functions for CRUD operations on matrix data
 * All functions return new MatrixData objects (immutable updates)
 */

// ============ GOAL OPERATIONS ============

/**
 * Update goal properties
 */
export function updateGoal(
  matrixData: MatrixData,
  goalId: string,
  updates: Partial<Pick<Goal, 'title' | 'description'>>
): MatrixData {
  if (matrixData.goal.id !== goalId) {
    throw new Error(`Goal with id ${goalId} not found`);
  }

  return {
    ...matrixData,
    goal: {
      ...matrixData.goal,
      ...updates,
    },
  };
}

// ============ FOCUS AREA OPERATIONS ============

/**
 * Update focus area properties
 */
export function updateFocusArea(
  matrixData: MatrixData,
  areaId: string,
  updates: Partial<Pick<FocusArea, 'title' | 'description'>>
): MatrixData {
  const areaIndex = matrixData.focusAreas.findIndex(
    (area) => area.id === areaId
  );
  if (areaIndex === -1) {
    throw new Error(`Focus area with id ${areaId} not found`);
  }

  const updatedFocusAreas = [...matrixData.focusAreas];
  updatedFocusAreas[areaIndex] = {
    ...updatedFocusAreas[areaIndex],
    ...updates,
  };

  return {
    ...matrixData,
    focusAreas: updatedFocusAreas,
  };
}

/**
 * Add a new focus area to the matrix
 */
export function addFocusArea(
  matrixData: MatrixData,
  input: CreateFocusAreaInput
): MatrixData {
  const newFocusArea = createFocusArea(input);

  return {
    ...matrixData,
    focusAreas: [...matrixData.focusAreas, newFocusArea],
  };
}

/**
 * Delete a focus area and all its associated tasks
 */
export function deleteFocusArea(
  matrixData: MatrixData,
  areaId: string
): MatrixData {
  const areaExists = matrixData.focusAreas.some((area) => area.id === areaId);
  if (!areaExists) {
    throw new Error(`Focus area with id ${areaId} not found`);
  }

  // Remove the focus area and all its tasks
  return {
    ...matrixData,
    focusAreas: matrixData.focusAreas.filter((area) => area.id !== areaId),
    tasks: matrixData.tasks.filter((task) => task.areaId !== areaId),
  };
}

// ============ TASK OPERATIONS ============

/**
 * Add a new task to the matrix
 */
export function addTask(
  matrixData: MatrixData,
  input: CreateTaskInput
): MatrixData {
  // Validate that the focus area exists
  const areaExists = matrixData.focusAreas.some(
    (area) => area.id === input.areaId
  );
  if (!areaExists) {
    throw new Error(`Focus area with id ${input.areaId} not found`);
  }

  const newTask = createTask(input);

  return {
    ...matrixData,
    tasks: [...matrixData.tasks, newTask],
  };
}

/**
 * Update task properties
 */
export function updateTask(
  matrixData: MatrixData,
  taskId: string,
  updates: Partial<Pick<Task, 'title' | 'description' | 'status'>>
): MatrixData {
  const taskIndex = matrixData.tasks.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) {
    throw new Error(`Task with id ${taskId} not found`);
  }

  const updatedTasks = [...matrixData.tasks];
  const existingTask = updatedTasks[taskIndex];
  const updatedTask = { ...existingTask, ...updates };

  // If status is being set to completed and completedDate is not set, set it
  if (updates.status === TaskStatus.COMPLETED && !existingTask.completedDate) {
    updatedTask.completedDate = new Date();
  }

  // If status is being changed from completed to something else, clear completedDate
  if (
    existingTask.status === TaskStatus.COMPLETED &&
    updates.status !== TaskStatus.COMPLETED
  ) {
    updatedTask.completedDate = undefined;
  }

  updatedTasks[taskIndex] = updatedTask;

  return {
    ...matrixData,
    tasks: updatedTasks,
  };
}

/**
 * Update task status (convenience function)
 */
export function updateTaskStatus(
  matrixData: MatrixData,
  taskId: string,
  status: TaskStatus
): MatrixData {
  return updateTask(matrixData, taskId, { status });
}

/**
 * Delete a task from the matrix
 */
export function deleteTask(matrixData: MatrixData, taskId: string): MatrixData {
  const taskExists = matrixData.tasks.some((task) => task.id === taskId);
  if (!taskExists) {
    throw new Error(`Task with id ${taskId} not found`);
  }

  return {
    ...matrixData,
    tasks: matrixData.tasks.filter((task) => task.id !== taskId),
  };
}

// ============ SEARCH AND FILTERING ============

/**
 * Find a focus area by ID
 */
export function findFocusArea(
  matrixData: MatrixData,
  areaId: string
): FocusArea | undefined {
  return matrixData.focusAreas.find((area) => area.id === areaId);
}

/**
 * Find a task by ID
 */
export function findTask(
  matrixData: MatrixData,
  taskId: string
): Task | undefined {
  return matrixData.tasks.find((task) => task.id === taskId);
}

/**
 * Find all tasks for a specific focus area
 */
export function findTasksByArea(
  matrixData: MatrixData,
  areaId: string
): Task[] {
  return matrixData.tasks.filter((task) => task.areaId === areaId);
}

/**
 * Find tasks by status
 */
export function findTasksByStatus(
  matrixData: MatrixData,
  status: TaskStatus
): Task[] {
  return matrixData.tasks.filter((task) => task.status === status);
}

/**
 * Search tasks by title or description
 */
export function searchTasks(matrixData: MatrixData, query: string): Task[] {
  const lowerQuery = query.toLowerCase();
  return matrixData.tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(lowerQuery) ||
      task.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get tasks with their associated focus area information
 */
export function getTasksWithAreas(
  matrixData: MatrixData
): Array<Task & { focusArea: FocusArea }> {
  return matrixData.tasks.map((task) => {
    const focusArea = matrixData.focusAreas.find(
      (area) => area.id === task.areaId
    );
    if (!focusArea) {
      throw new Error(
        `Task ${task.id} references non-existent focus area ${task.areaId}`
      );
    }
    return { ...task, focusArea };
  });
}

// ============ STATISTICS AND VALIDATION ============

/**
 * Get total task count
 */
export function getTaskCount(matrixData: MatrixData): number {
  return matrixData.tasks.length;
}

/**
 * Get completed task count
 */
export function getCompletedTaskCount(matrixData: MatrixData): number {
  return matrixData.tasks.filter((task) => task.status === TaskStatus.COMPLETED)
    .length;
}

/**
 * Get task count by status
 */
export function getTaskCountByStatus(
  matrixData: MatrixData
): Record<TaskStatus, number> {
  const counts = {
    [TaskStatus.PENDING]: 0,
    [TaskStatus.IN_PROGRESS]: 0,
    [TaskStatus.COMPLETED]: 0,
  };

  matrixData.tasks.forEach((task) => {
    counts[task.status]++;
  });

  return counts;
}

/**
 * Get task count by focus area
 */
export function getTaskCountByArea(
  matrixData: MatrixData
): Record<string, number> {
  const counts: Record<string, number> = {};

  matrixData.focusAreas.forEach((area) => {
    counts[area.id] = matrixData.tasks.filter(
      (task) => task.areaId === area.id
    ).length;
  });

  return counts;
}

/**
 * Validate matrix data integrity
 */
export function validateMatrixIntegrity(matrixData: MatrixData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check that all focus areas reference the goal
  matrixData.focusAreas.forEach((area) => {
    if (area.goalId !== matrixData.goal.id) {
      errors.push(
        `Focus area ${area.id} references non-existent goal ${area.goalId}`
      );
    }
  });

  // Check that all tasks reference existing focus areas
  matrixData.tasks.forEach((task) => {
    const areaExists = matrixData.focusAreas.some(
      (area) => area.id === task.areaId
    );
    if (!areaExists) {
      errors.push(
        `Task ${task.id} references non-existent focus area ${task.areaId}`
      );
    }
  });

  // Check for duplicate IDs
  const goalIds = new Set([matrixData.goal.id]);
  const areaIds = new Set(matrixData.focusAreas.map((a) => a.id));
  const taskIds = new Set(matrixData.tasks.map((t) => t.id));

  if (goalIds.size !== 1) {
    errors.push('Multiple goals with same ID found');
  }

  if (areaIds.size !== matrixData.focusAreas.length) {
    errors.push('Duplicate focus area IDs found');
  }

  if (taskIds.size !== matrixData.tasks.length) {
    errors.push('Duplicate task IDs found');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
