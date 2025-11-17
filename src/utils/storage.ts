import type { MatrixData, Goal, FocusArea, Task } from '../types';
import { TaskStatus, TaskPriority } from '../types';
import {
  migrationEngine,
  validateMigrationResult,
  needsMigration,
  createBackwardCompatibilityLayer,
} from './migrations';

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
  LAST_SAVED: 'ohtani-harada-last-saved',
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
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
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
    createdDate: parseDate(data.goal.createdDate),
  };

  // Validate focus areas
  if (!Array.isArray(data.focusAreas)) {
    throw new StorageCorruptionError('Missing or invalid focus areas');
  }

  const focusAreas: FocusArea[] = data.focusAreas.map(
    (area: any, index: number) => {
      if (!area || typeof area !== 'object') {
        throw new StorageCorruptionError(
          `Invalid focus area at index ${index}`
        );
      }

      return {
        id: String(area.id || ''),
        title: String(area.title || ''),
        description: String(area.description || ''),
        goalId: String(area.goalId || ''),
      };
    }
  );

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
      throw new StorageCorruptionError(
        `Invalid task status at index ${index}: ${task.status}`
      );
    }

    const parsedTask: Task = {
      id: String(task.id || ''),
      title: String(task.title || ''),
      description: String(task.description || ''),
      areaId: String(task.areaId || ''),
      status: task.status as TaskStatus,
      priority: (task.priority as TaskPriority) || TaskPriority.MEDIUM,
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
    lastSaved: new Date().toISOString(),
  };
}

/**
 * Deserialize stored data back to MatrixData
 * Validates data integrity and handles migrations
 */
export function deserializeMatrixData(
  storedData: StoredMatrixData
): MatrixData {
  // Version check and migration
  if (!storedData.version) {
    throw new StorageCorruptionError('Missing version information');
  }

  // Apply migrations if needed
  if (needsMigration(storedData)) {
    const migrationResult = migrationEngine.migrate(storedData);
    validateMigrationResult(migrationResult);

    // Log migration success (in a real app, this might go to a logger)
    console.info(
      `Data migrated: ${migrationResult.appliedMigrations.length} migrations applied`
    );
  }

  // Apply backward compatibility layer for very old formats
  const compatibleData = createBackwardCompatibilityLayer(storedData.data);

  return validateStoredData(compatibleData);
}

/**
 * Compress data using simple string compression (removes unnecessary whitespace)
 */
function compressData(data: string): string {
  try {
    // Use a simple compression approach - minify JSON and encode
    const compressed = btoa(encodeURIComponent(data));
    return compressed;
  } catch (error) {
    // If compression fails, return original data
    console.warn('Data compression failed, using uncompressed data:', error);
    return data;
  }
}

/**
 * Decompress data
 */
function decompressData(compressedData: string): string {
  try {
    return decodeURIComponent(atob(compressedData));
  } catch (error) {
    // If decompression fails, assume data was not compressed
    console.warn(
      'Data decompression failed, assuming uncompressed data:',
      error
    );
    return compressedData;
  }
}

/**
 * Save matrix data to localStorage with compression and error handling
 */
export function saveMatrixData(matrixData: MatrixData): void {
  try {
    const serializedData = serializeMatrixData(matrixData);
    let jsonString = JSON.stringify(serializedData);

    // Try compression if data is large (> 1MB)
    let compressed = false;
    if (jsonString.length > 1024 * 1024) {
      // 1MB threshold for compression
      try {
        const compressedString = compressData(jsonString);
        // Only use compression if it actually reduces size significantly (>10%)
        if (compressedString.length < jsonString.length * 0.9) {
          jsonString = compressedString;
          compressed = true;
        }
      } catch (compressionError) {
        console.warn(
          'Compression failed, saving uncompressed data:',
          compressionError
        );
      }
    }

    // Check if data will fit in localStorage (rough estimate: 5MB limit)
    if (jsonString.length > 4 * 1024 * 1024) {
      // 4MB threshold
      throw new StorageQuotaExceededError();
    }

    // Store compression flag and data
    localStorage.setItem(STORAGE_KEYS.MATRIX_DATA, jsonString);
    localStorage.setItem(STORAGE_KEYS.VERSION, STORAGE_VERSION);
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, serializedData.lastSaved);
    localStorage.setItem(
      `${STORAGE_KEYS.MATRIX_DATA}_compressed`,
      compressed.toString()
    );
  } catch (error) {
    if (error instanceof StorageQuotaExceededError) {
      throw error;
    }

    // Check if it's a quota exceeded error from the browser
    if (
      error instanceof Error &&
      (error.name === 'QuotaExceededError' ||
        error.message.includes('quota') ||
        error.message.includes('storage'))
    ) {
      throw new StorageQuotaExceededError();
    }

    throw new StorageError(
      'Failed to save data to localStorage',
      error as Error
    );
  }
}

/**
 * Load matrix data from localStorage with decompression support
 */
export function loadMatrixData(): MatrixData | null {
  try {
    const storedJson = localStorage.getItem(STORAGE_KEYS.MATRIX_DATA);
    const isCompressed =
      localStorage.getItem(`${STORAGE_KEYS.MATRIX_DATA}_compressed`) === 'true';

    if (!storedJson) {
      return null; // No data stored yet
    }

    // Decompress if needed
    let processedJson = storedJson;
    if (isCompressed) {
      try {
        processedJson = decompressData(storedJson);
      } catch (decompressionError) {
        console.warn(
          'Failed to decompress data, trying to load as uncompressed:',
          decompressionError
        );
        // Fall back to trying uncompressed data
      }
    }

    const storedData: StoredMatrixData = JSON.parse(processedJson);
    return deserializeMatrixData(storedData);
  } catch (error) {
    if (
      error instanceof StorageCorruptionError ||
      error instanceof StorageError
    ) {
      throw error;
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      throw new StorageCorruptionError('Stored data is not valid JSON');
    }

    throw new StorageError(
      'Failed to load data from localStorage',
      error as Error
    );
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
    localStorage.removeItem(`${STORAGE_KEYS.MATRIX_DATA}_compressed`);
  } catch (error) {
    throw new StorageError(
      'Failed to clear data from localStorage',
      error as Error
    );
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
export function getStorageMetadata(): {
  version: string | null;
  lastSaved: Date | null;
} {
  try {
    const version = localStorage.getItem(STORAGE_KEYS.VERSION);
    const lastSavedString = localStorage.getItem(STORAGE_KEYS.LAST_SAVED);

    return {
      version,
      lastSaved: lastSavedString ? new Date(lastSavedString) : null,
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

/**
 * Storage keys for backup functionality
 */
export const BACKUP_KEYS = {
  BACKUP_DATA: 'ohtani-harada-backup-data',
  BACKUP_TIMESTAMP: 'ohtani-harada-backup-timestamp',
  BACKUP_VERSION: 'ohtani-harada-backup-version',
} as const;

/**
 * Create a backup of current matrix data
 */
export function createBackup(matrixData: MatrixData): void {
  try {
    const serializedData = serializeMatrixData(matrixData);
    const jsonString = JSON.stringify(serializedData);

    localStorage.setItem(BACKUP_KEYS.BACKUP_DATA, jsonString);
    localStorage.setItem(
      BACKUP_KEYS.BACKUP_TIMESTAMP,
      new Date().toISOString()
    );
    localStorage.setItem(BACKUP_KEYS.BACKUP_VERSION, STORAGE_VERSION);

    console.info('Backup created successfully');
  } catch (error) {
    console.warn('Failed to create backup:', error);
  }
}

/**
 * Restore from backup data
 */
export function restoreFromBackup(): MatrixData | null {
  try {
    const backupJson = localStorage.getItem(BACKUP_KEYS.BACKUP_DATA);

    if (!backupJson) {
      return null; // No backup available
    }

    const storedData: StoredMatrixData = JSON.parse(backupJson);
    const restoredData = deserializeMatrixData(storedData);

    console.info('Successfully restored from backup');
    return restoredData;
  } catch (error) {
    console.error('Failed to restore from backup:', error);
    return null;
  }
}

/**
 * Check if backup exists and get backup metadata
 */
export function getBackupMetadata(): {
  exists: boolean;
  timestamp: Date | null;
  version: string | null;
} {
  try {
    const timestamp = localStorage.getItem(BACKUP_KEYS.BACKUP_TIMESTAMP);
    const version = localStorage.getItem(BACKUP_KEYS.BACKUP_VERSION);
    const exists = localStorage.getItem(BACKUP_KEYS.BACKUP_DATA) !== null;

    return {
      exists,
      timestamp: timestamp ? new Date(timestamp) : null,
      version,
    };
  } catch (error) {
    return { exists: false, timestamp: null, version: null };
  }
}

/**
 * Clear backup data
 */
export function clearBackup(): void {
  try {
    localStorage.removeItem(BACKUP_KEYS.BACKUP_DATA);
    localStorage.removeItem(BACKUP_KEYS.BACKUP_TIMESTAMP);
    localStorage.removeItem(BACKUP_KEYS.BACKUP_VERSION);
  } catch (error) {
    console.warn('Failed to clear backup:', error);
  }
}
