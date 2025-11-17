// Type exports
export type {
  Goal,
  FocusArea,
  Task,
  MatrixData,
  CreateGoalInput,
  CreateFocusAreaInput,
  CreateTaskInput,
  TaskStatus
} from '../types';

// Factory function exports
export {
  generateId,
  createGoal,
  createFocusArea,
  createTask,
  createFocusAreas,
  createEmptyTaskMatrix,
  createEmptyMatrix,
  createMinimalMatrix
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
  StoredMatrixData,
  StorageError,
  StorageQuotaExceededError,
  StorageCorruptionError
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
  validateMatrixIntegrity
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
  ValidationResult,
  ValidationError,
  isValidTaskStatus,
  isGoal,
  isFocusArea,
  isTask
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
  Migration,
  MigrationFunction,
  MigrationResult
} from './migrations';

// Hook exports
export { useAutoSave, useAutoSaveIndicator } from '../hooks/useAutoSave';
