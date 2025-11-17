// Type exports
export type {
  Goal,
  FocusArea,
  Task,
  MatrixData,
  CreateGoalInput,
  CreateFocusAreaInput,
  CreateTaskInput,
} from '../types';

// Value exports (enums used as values)
export {
  TaskStatus,
  TaskPriority,
} from '../types';

// Additional type exports from storage
export type { StoredMatrixData } from './storage';

// Additional type exports from validation
export type { ValidationResult, ValidationError } from './validation';

// Additional type exports from migrations
export type { Migration, MigrationFunction, MigrationResult } from './migrations';

// Factory function exports
export {
  generateId,
  createGoal,
  createFocusArea,
  createTask,
  createFocusAreas,
  createEmptyTaskMatrix,
  createEmptyMatrix,
  createMinimalMatrix,
} from './factories';

// Storage utility exports
export {
  STORAGE_VERSION,
  STORAGE_KEYS,
  saveMatrixData,
  loadMatrixData,
  clearMatrixData,
  hasMatrixData,
  getStorageMetadata,
  getStorageUsage,
  StorageError,
  StorageQuotaExceededError,
  StorageCorruptionError,
} from './storage';

// CRUD utility exports
export {
  updateGoal,
  updateFocusArea,
  addFocusArea,
  deleteFocusArea,
  addTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  findFocusArea,
  findTask,
  findTasksByArea,
  findTasksByStatus,
  searchTasks,
  getTasksWithAreas,
  getTaskCount,
  getCompletedTaskCount,
  getTaskCountByStatus,
  getTaskCountByArea,
  validateMatrixIntegrity,
} from './crud';

// Validation utility exports
export {
  validateGoalInput,
  validateFocusAreaInput,
  validateTaskInput,
  validateFocusAreaAddition,
  validateTaskAddition,
  validateHaradaMethodCompliance,
  validateReferentialIntegrity,
  validateDataStructure,
  validateMatrix,
  assertValidMatrix,
  sanitizeString,
  HARADA_METHOD_LIMITS,
  isValidTaskStatus,
  isGoal,
  isFocusArea,
  isTask,
} from './validation';

// Migration utility exports
export {
  migrationEngine,
  needsMigration,
  validateMigrationResult,
  getMigrationSummary,
  createBackwardCompatibilityLayer,
  validateDataSchema,
  getMigrationMetadata,
  VersionUtils,
} from './migrations';

// Hook exports
export { useAutoSave, useAutoSaveIndicator } from '../hooks/useAutoSave';

// Progress utility exports
export * from './progress';
