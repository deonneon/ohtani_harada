import { MatrixData, Goal, FocusArea, Task, TaskStatus } from './types';

/**
 * Storage schema version for handling migrations
 */
export const STORAGE_VERSION = '1.0.0';

/**
 * Storage keys used in localStorage
 */
export const STORAGE_KEYS = {
  MATRIX_DATA: 'ohtani-harada-matrix',
  VERSION: 'ohtani-harada-version',
  LAST_SAVED: 'ohtani-harada-last-saved'
} as const;

/**
 * Storage schema for persisted matrix data
 */
export interface StoredMatrixData {
  /** Schema version for migrations */
  version: string;
  /** The matrix data */
  data: MatrixData;
  /** Timestamp when data was last saved */
  lastSaved: string;
}

/**
 * Custom error types for storage operations
 */
export class StorageError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'StorageError';
  }
}

export class StorageQuotaExceededError extends StorageError {
  constructor() {
    super('Storage quota exceeded. Unable to save data.');
    this.name = 'StorageQuotaExceededError';
  }
}

export class StorageCorruptionError extends StorageError {
  constructor(message: string = 'Stored data is corrupted or invalid.') {
    super(message);
    this.name = 'StorageCorruptionError';
  }
}

/**
 * Type guard to check if a value is a valid Date object
 */
function isValidDate(value: any): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Safely parse a date string back to a Date object
 */
function parseDate(dateString: string): Date {
  const date = new Date(dateString);
  if (!isValidDate(date)) {
    throw new StorageCorruptionError(`Invalid date string: ${dateString}`);
  }
  return date;
}

/**
 * Validate and parse stored matrix data
 */
function validateStoredData(data: any): MatrixData {
  if (!data || typeof data !== 'object') {
    throw new StorageCorruptionError('Invalid data structure');
  }

  // Validate goal
  if (!data.goal || typeof data.goal !== 'object') {
    throw new StorageCorruptionError('Missing or invalid goal data');
  }

  const goal: Goal = {
    id: String(data.goal.id || ''),
    title: String(data.goal.title || ''),
    description: String(data.goal.description || ''),
    createdDate: parseDate(data.goal.createdDate)
  };

  // Validate focus areas
  if (!Array.isArray(data.focusAreas)) {
    throw new StorageCorruptionError('Missing or invalid focus areas');
  }

  const focusAreas: FocusArea[] = data.focusAreas.map((area: any, index: number) => {
    if (!area || typeof area !== 'object') {
      throw new StorageCorruptionError(`Invalid focus area at index ${index}`);
    }

    return {
      id: String(area.id || ''),
      title: String(area.title || ''),
      description: String(area.description || ''),
      goalId: String(area.goalId || '')
    };
  });

  // Validate tasks
  if (!Array.isArray(data.tasks)) {
    throw new StorageCorruptionError('Missing or invalid tasks');
  }

  const tasks: Task[] = data.tasks.map((task: any, index: number) => {
    if (!task || typeof task !== 'object') {
      throw new StorageCorruptionError(`Invalid task at index ${index}`);
    }

    // Validate task status
    const validStatuses = Object.values(TaskStatus);
    if (!validStatuses.includes(task.status)) {
      throw new StorageCorruptionError(`Invalid task status at index ${index}: ${task.status}`);
    }

    const parsedTask: Task = {
      id: String(task.id || ''),
      title: String(task.title || ''),
      description: String(task.description || ''),
      areaId: String(task.areaId || ''),
      status: task.status as TaskStatus
    };

    // Optional completedDate
    if (task.completedDate) {
      parsedTask.completedDate = parseDate(task.completedDate);
    }

    return parsedTask;
  });

  return { goal, focusAreas, tasks };
}

/**
 * Serialize matrix data for storage
 * Handles Date objects and adds version metadata
 */
export function serializeMatrixData(matrixData: MatrixData): StoredMatrixData {
  return {
    version: STORAGE_VERSION,
    data: matrixData,
    lastSaved: new Date().toISOString()
  };
}

/**
 * Deserialize stored data back to MatrixData
 * Validates data integrity and handles migrations
 */
export function deserializeMatrixData(storedData: StoredMatrixData): MatrixData {
  // Version check and migration
  if (!storedData.version) {
    throw new StorageCorruptionError('Missing version information');
  }

  // Import migration engine here to avoid circular dependencies
  const { migrationEngine, validateMigrationResult, needsMigration, createBackwardCompatibilityLayer } = require('./migrations');

  // Apply migrations if needed
  if (needsMigration(storedData)) {
    const migrationResult = migrationEngine.migrate(storedData);
    validateMigrationResult(migrationResult);

    // Log migration success (in a real app, this might go to a logger)
    console.info(`Data migrated: ${migrationResult.appliedMigrations.length} migrations applied`);
  }

  // Apply backward compatibility layer for very old formats
  const compatibleData = createBackwardCompatibilityLayer(storedData.data);

  return validateStoredData(compatibleData);
}

/**
 * Save matrix data to localStorage
 */
export function saveMatrixData(matrixData: MatrixData): void {
  try {
    const serializedData = serializeMatrixData(matrixData);
    const jsonString = JSON.stringify(serializedData);

    // Check if data will fit in localStorage (rough estimate: 5MB limit)
    if (jsonString.length > 4 * 1024 * 1024) { // 4MB threshold
      throw new StorageQuotaExceededError();
    }

    localStorage.setItem(STORAGE_KEYS.MATRIX_DATA, jsonString);
    localStorage.setItem(STORAGE_KEYS.VERSION, STORAGE_VERSION);
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, serializedData.lastSaved);

  } catch (error) {
    if (error instanceof StorageQuotaExceededError) {
      throw error;
    }

    // Check if it's a quota exceeded error from the browser
    if (error instanceof Error && (
      error.name === 'QuotaExceededError' ||
      error.message.includes('quota') ||
      error.message.includes('storage')
    )) {
      throw new StorageQuotaExceededError();
    }

    throw new StorageError('Failed to save data to localStorage', error as Error);
  }
}

/**
 * Load matrix data from localStorage
 */
export function loadMatrixData(): MatrixData | null {
  try {
    const storedJson = localStorage.getItem(STORAGE_KEYS.MATRIX_DATA);

    if (!storedJson) {
      return null; // No data stored yet
    }

    const storedData: StoredMatrixData = JSON.parse(storedJson);
    return deserializeMatrixData(storedData);

  } catch (error) {
    if (error instanceof StorageCorruptionError || error instanceof StorageError) {
      throw error;
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      throw new StorageCorruptionError('Stored data is not valid JSON');
    }

    throw new StorageError('Failed to load data from localStorage', error as Error);
  }
}

/**
 * Clear all matrix data from localStorage
 */
export function clearMatrixData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.MATRIX_DATA);
    localStorage.removeItem(STORAGE_KEYS.VERSION);
    localStorage.removeItem(STORAGE_KEYS.LAST_SAVED);
  } catch (error) {
    throw new StorageError('Failed to clear data from localStorage', error as Error);
  }
}

/**
 * Check if matrix data exists in localStorage
 */
export function hasMatrixData(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.MATRIX_DATA) !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Get storage metadata (version, last saved time)
 */
export function getStorageMetadata(): { version: string | null; lastSaved: Date | null } {
  try {
    const version = localStorage.getItem(STORAGE_KEYS.VERSION);
    const lastSavedString = localStorage.getItem(STORAGE_KEYS.LAST_SAVED);

    return {
      version,
      lastSaved: lastSavedString ? new Date(lastSavedString) : null
    };
  } catch (error) {
    return { version: null, lastSaved: null };
  }
}

/**
 * Get estimated storage usage in bytes
 */
export function getStorageUsage(): number {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MATRIX_DATA);
    return data ? new Blob([data]).size : 0;
  } catch (error) {
    return 0;
  }
}
