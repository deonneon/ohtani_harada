import { Goal, FocusArea, Task, TaskStatus, CreateGoalInput, CreateFocusAreaInput, CreateTaskInput, MatrixData } from './types';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Validation failed: ${errors.join(', ')}`);
    this.name = 'ValidationError';
  }
}

/**
 * Constants for Harada Method business rules
 */
export const HARADA_METHOD_LIMITS = {
  MAX_FOCUS_AREAS: 8,
  MAX_TASKS_PER_AREA: 8,
  MAX_TOTAL_TASKS: 64,
  MIN_GOAL_TITLE_LENGTH: 3,
  MAX_GOAL_TITLE_LENGTH: 100,
  MIN_GOAL_DESCRIPTION_LENGTH: 10,
  MAX_GOAL_DESCRIPTION_LENGTH: 500,
  MIN_AREA_TITLE_LENGTH: 3,
  MAX_AREA_TITLE_LENGTH: 50,
  MIN_AREA_DESCRIPTION_LENGTH: 5,
  MAX_AREA_DESCRIPTION_LENGTH: 200,
  MIN_TASK_TITLE_LENGTH: 3,
  MAX_TASK_TITLE_LENGTH: 80,
  MIN_TASK_DESCRIPTION_LENGTH: 5,
  MAX_TASK_DESCRIPTION_LENGTH: 300
} as const;

// ============ TYPE GUARDS ============

/**
 * Type guard for TaskStatus
 */
export function isValidTaskStatus(value: any): value is TaskStatus {
  return Object.values(TaskStatus).includes(value);
}

/**
 * Type guard for Goal
 */
export function isGoal(value: any): value is Goal {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    value.createdDate instanceof Date
  );
}

/**
 * Type guard for FocusArea
 */
export function isFocusArea(value: any): value is FocusArea {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    typeof value.goalId === 'string'
  );
}

/**
 * Type guard for Task
 */
export function isTask(value: any): value is Task {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    typeof value.areaId === 'string' &&
    isValidTaskStatus(value.status) &&
    (value.completedDate === undefined || value.completedDate instanceof Date)
  );
}

// ============ INPUT VALIDATION ============

/**
 * Validate goal creation input
 */
export function validateGoalInput(input: CreateGoalInput): ValidationResult {
  const errors: string[] = [];

  // Title validation
  if (!input.title || typeof input.title !== 'string') {
    errors.push('Goal title is required');
  } else if (input.title.length < HARADA_METHOD_LIMITS.MIN_GOAL_TITLE_LENGTH) {
    errors.push(`Goal title must be at least ${HARADA_METHOD_LIMITS.MIN_GOAL_TITLE_LENGTH} characters`);
  } else if (input.title.length > HARADA_METHOD_LIMITS.MAX_GOAL_TITLE_LENGTH) {
    errors.push(`Goal title must not exceed ${HARADA_METHOD_LIMITS.MAX_GOAL_TITLE_LENGTH} characters`);
  }

  // Description validation
  if (!input.description || typeof input.description !== 'string') {
    errors.push('Goal description is required');
  } else if (input.description.length < HARADA_METHOD_LIMITS.MIN_GOAL_DESCRIPTION_LENGTH) {
    errors.push(`Goal description must be at least ${HARADA_METHOD_LIMITS.MIN_GOAL_DESCRIPTION_LENGTH} characters`);
  } else if (input.description.length > HARADA_METHOD_LIMITS.MAX_GOAL_DESCRIPTION_LENGTH) {
    errors.push(`Goal description must not exceed ${HARADA_METHOD_LIMITS.MAX_GOAL_DESCRIPTION_LENGTH} characters`);
  }

  // Check for meaningful content
  if (input.title && input.title.toLowerCase().includes('test')) {
    errors.push('Goal title should be meaningful, not a test placeholder');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate focus area creation input
 */
export function validateFocusAreaInput(input: CreateFocusAreaInput): ValidationResult {
  const errors: string[] = [];

  // Title validation
  if (!input.title || typeof input.title !== 'string') {
    errors.push('Focus area title is required');
  } else if (input.title.length < HARADA_METHOD_LIMITS.MIN_AREA_TITLE_LENGTH) {
    errors.push(`Focus area title must be at least ${HARADA_METHOD_LIMITS.MIN_AREA_TITLE_LENGTH} characters`);
  } else if (input.title.length > HARADA_METHOD_LIMITS.MAX_AREA_TITLE_LENGTH) {
    errors.push(`Focus area title must not exceed ${HARADA_METHOD_LIMITS.MAX_AREA_TITLE_LENGTH} characters`);
  }

  // Description validation
  if (!input.description || typeof input.description !== 'string') {
    errors.push('Focus area description is required');
  } else if (input.description.length < HARADA_METHOD_LIMITS.MIN_AREA_DESCRIPTION_LENGTH) {
    errors.push(`Focus area description must be at least ${HARADA_METHOD_LIMITS.MIN_AREA_DESCRIPTION_LENGTH} characters`);
  } else if (input.description.length > HARADA_METHOD_LIMITS.MAX_AREA_DESCRIPTION_LENGTH) {
    errors.push(`Focus area description must not exceed ${HARADA_METHOD_LIMITS.MAX_AREA_DESCRIPTION_LENGTH} characters`);
  }

  // Goal ID validation
  if (!input.goalId || typeof input.goalId !== 'string') {
    errors.push('Goal ID is required');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate task creation input
 */
export function validateTaskInput(input: CreateTaskInput): ValidationResult {
  const errors: string[] = [];

  // Title validation
  if (!input.title || typeof input.title !== 'string') {
    errors.push('Task title is required');
  } else if (input.title.length < HARADA_METHOD_LIMITS.MIN_TASK_TITLE_LENGTH) {
    errors.push(`Task title must be at least ${HARADA_METHOD_LIMITS.MIN_TASK_TITLE_LENGTH} characters`);
  } else if (input.title.length > HARADA_METHOD_LIMITS.MAX_TASK_TITLE_LENGTH) {
    errors.push(`Task title must not exceed ${HARADA_METHOD_LIMITS.MAX_TASK_TITLE_LENGTH} characters`);
  }

  // Description validation
  if (!input.description || typeof input.description !== 'string') {
    errors.push('Task description is required');
  } else if (input.description.length < HARADA_METHOD_LIMITS.MIN_TASK_DESCRIPTION_LENGTH) {
    errors.push(`Task description must be at least ${HARADA_METHOD_LIMITS.MIN_TASK_DESCRIPTION_LENGTH} characters`);
  } else if (input.description.length > HARADA_METHOD_LIMITS.MAX_TASK_DESCRIPTION_LENGTH) {
    errors.push(`Task description must not exceed ${HARADA_METHOD_LIMITS.MAX_TASK_DESCRIPTION_LENGTH} characters`);
  }

  // Area ID validation
  if (!input.areaId || typeof input.areaId !== 'string') {
    errors.push('Focus area ID is required');
  }

  // Status validation
  if (!isValidTaskStatus(input.status)) {
    errors.push('Task status must be a valid TaskStatus value');
  }

  return { isValid: errors.length === 0, errors };
}

// ============ BUSINESS RULE VALIDATION ============

/**
 * Validate that adding a focus area would not exceed limits
 */
export function validateFocusAreaAddition(matrixData: MatrixData): ValidationResult {
  const errors: string[] = [];

  if (matrixData.focusAreas.length >= HARADA_METHOD_LIMITS.MAX_FOCUS_AREAS) {
    errors.push(`Cannot add more than ${HARADA_METHOD_LIMITS.MAX_FOCUS_AREAS} focus areas (Harada Method limit)`);
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate that adding a task would not exceed limits
 */
export function validateTaskAddition(matrixData: MatrixData, areaId: string): ValidationResult {
  const errors: string[] = [];

  const tasksInArea = matrixData.tasks.filter(task => task.areaId === areaId).length;
  if (tasksInArea >= HARADA_METHOD_LIMITS.MAX_TASKS_PER_AREA) {
    errors.push(`Cannot add more than ${HARADA_METHOD_LIMITS.MAX_TASKS_PER_AREA} tasks per focus area (Harada Method limit)`);
  }

  const totalTasks = matrixData.tasks.length;
  if (totalTasks >= HARADA_METHOD_LIMITS.MAX_TOTAL_TASKS) {
    errors.push(`Cannot add more than ${HARADA_METHOD_LIMITS.MAX_TOTAL_TASKS} total tasks (Harada Method limit)`);
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate complete matrix against Harada Method rules
 */
export function validateHaradaMethodCompliance(matrixData: MatrixData): ValidationResult {
  const errors: string[] = [];

  // Check focus area count
  if (matrixData.focusAreas.length > HARADA_METHOD_LIMITS.MAX_FOCUS_AREAS) {
    errors.push(`Matrix has ${matrixData.focusAreas.length} focus areas, but Harada Method allows maximum ${HARADA_METHOD_LIMITS.MAX_FOCUS_AREAS}`);
  }

  // Check total task count
  if (matrixData.tasks.length > HARADA_METHOD_LIMITS.MAX_TOTAL_TASKS) {
    errors.push(`Matrix has ${matrixData.tasks.length} tasks, but Harada Method allows maximum ${HARADA_METHOD_LIMITS.MAX_TOTAL_TASKS}`);
  }

  // Check tasks per area
  const taskCountByArea: Record<string, number> = {};
  matrixData.tasks.forEach(task => {
    taskCountByArea[task.areaId] = (taskCountByArea[task.areaId] || 0) + 1;
  });

  Object.entries(taskCountByArea).forEach(([areaId, count]) => {
    if (count > HARADA_METHOD_LIMITS.MAX_TASKS_PER_AREA) {
      const area = matrixData.focusAreas.find(a => a.id === areaId);
      const areaName = area ? area.title : areaId;
      errors.push(`Focus area "${areaName}" has ${count} tasks, but Harada Method allows maximum ${HARADA_METHOD_LIMITS.MAX_TASKS_PER_AREA} per area`);
    }
  });

  // Check for meaningful content
  if (matrixData.goal.title.toLowerCase().includes('test') ||
      matrixData.goal.title.toLowerCase().includes('placeholder')) {
    errors.push('Goal title should be meaningful and specific to your actual objective');
  }

  // Check focus area uniqueness
  const areaTitles = matrixData.focusAreas.map(a => a.title.toLowerCase());
  const uniqueTitles = new Set(areaTitles);
  if (uniqueTitles.size !== areaTitles.length) {
    errors.push('Focus area titles should be unique');
  }

  return { isValid: errors.length === 0, errors };
}

// ============ DATA INTEGRITY VALIDATION ============

/**
 * Validate referential integrity of matrix data
 */
export function validateReferentialIntegrity(matrixData: MatrixData): ValidationResult {
  const errors: string[] = [];

  // Check that all focus areas reference the goal
  matrixData.focusAreas.forEach(area => {
    if (area.goalId !== matrixData.goal.id) {
      errors.push(`Focus area "${area.title}" references non-existent goal "${area.goalId}"`);
    }
  });

  // Check that all tasks reference existing focus areas
  matrixData.tasks.forEach(task => {
    const areaExists = matrixData.focusAreas.some(area => area.id === task.areaId);
    if (!areaExists) {
      errors.push(`Task "${task.title}" references non-existent focus area "${task.areaId}"`);
    }
  });

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate data structure integrity (IDs, types, etc.)
 */
export function validateDataStructure(matrixData: MatrixData): ValidationResult {
  const errors: string[] = [];

  // Validate goal
  if (!isGoal(matrixData.goal)) {
    errors.push('Goal data structure is invalid');
  }

  // Validate focus areas
  matrixData.focusAreas.forEach((area, index) => {
    if (!isFocusArea(area)) {
      errors.push(`Focus area at index ${index} has invalid structure`);
    }
  });

  // Validate tasks
  matrixData.tasks.forEach((task, index) => {
    if (!isTask(task)) {
      errors.push(`Task at index ${index} has invalid structure`);
    }
  });

  // Check for duplicate IDs
  const goalIds = [matrixData.goal.id];
  const areaIds = matrixData.focusAreas.map(a => a.id);
  const taskIds = matrixData.tasks.map(t => t.id);

  const allIds = [...goalIds, ...areaIds, ...taskIds];
  const uniqueIds = new Set(allIds);

  if (uniqueIds.size !== allIds.length) {
    errors.push('Duplicate IDs found in matrix data');
  }

  return { isValid: errors.length === 0, errors };
}

// ============ COMPREHENSIVE VALIDATION ============

/**
 * Run all validations on matrix data
 */
export function validateMatrix(matrixData: MatrixData): ValidationResult {
  const allErrors: string[] = [];

  // Run all validation checks
  const validations = [
    validateHaradaMethodCompliance(matrixData),
    validateReferentialIntegrity(matrixData),
    validateDataStructure(matrixData)
  ];

  validations.forEach(validation => {
    allErrors.push(...validation.errors);
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
}

/**
 * Validate and throw if invalid
 */
export function assertValidMatrix(matrixData: MatrixData): void {
  const validation = validateMatrix(matrixData);
  if (!validation.isValid) {
    throw new ValidationError(validation.errors);
  }
}

/**
 * Sanitize string input (trim whitespace, remove extra spaces)
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}
