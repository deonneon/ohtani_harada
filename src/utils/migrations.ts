import type { MatrixData } from '../types';
import type { StoredMatrixData } from './storage';
import { STORAGE_VERSION } from './storage';

/**
 * Version string type (semantic versioning)
 */
export type Version = string;

/**
 * Migration function signature
 */
export type MigrationFunction = (data: any) => any;

/**
 * Migration definition
 */
export interface Migration {
  fromVersion: Version;
  toVersion: Version;
  description: string;
  migrate: MigrationFunction;
}

/**
 * Migration result
 */
export interface MigrationResult {
  success: boolean;
  migratedFrom?: Version;
  migratedTo?: Version;
  appliedMigrations: Migration[];
  errors: string[];
}

/**
 * Version comparison utilities
 */
export class VersionUtils {
  /**
   * Parse version string into components
   */
  static parse(version: Version): {
    major: number;
    minor: number;
    patch: number;
  } {
    const parts = version.split('.').map(Number);
    return {
      major: parts[0] || 0,
      minor: parts[1] || 0,
      patch: parts[2] || 0,
    };
  }

  /**
   * Compare two versions
   * Returns: -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
   */
  static compare(v1: Version, v2: Version): number {
    const p1 = this.parse(v1);
    const p2 = this.parse(v2);

    if (p1.major !== p2.major) return p1.major > p2.major ? 1 : -1;
    if (p1.minor !== p2.minor) return p1.minor > p2.minor ? 1 : -1;
    if (p1.patch !== p2.patch) return p1.patch > p2.patch ? 1 : -1;
    return 0;
  }

  /**
   * Check if version1 is less than version2
   */
  static isLessThan(v1: Version, v2: Version): boolean {
    return this.compare(v1, v2) < 0;
  }

  /**
   * Check if version1 is greater than version2
   */
  static isGreaterThan(v1: Version, v2: Version): boolean {
    return this.compare(v1, v2) > 0;
  }

  /**
   * Check if versions are equal
   */
  static isEqual(v1: Version, v2: Version): boolean {
    return this.compare(v1, v2) === 0;
  }
}

/**
 * Migration registry and execution engine
 */
export class MigrationEngine {
  private migrations: Map<string, Migration> = new Map();

  /**
   * Register a migration
   */
  register(migration: Migration): void {
    const key = `${migration.fromVersion}->${migration.toVersion}`;
    this.migrations.set(key, migration);
  }

  /**
   * Get migration path from old version to new version
   */
  private getMigrationPath(
    fromVersion: Version,
    toVersion: Version
  ): Migration[] {
    const path: Migration[] = [];
    let currentVersion = fromVersion;

    // For now, implement simple sequential migrations
    // In a more complex system, this would find the shortest path
    // through the migration graph
    while (VersionUtils.isLessThan(currentVersion, toVersion)) {
      const key = `${currentVersion}->${this.getNextVersion(currentVersion)}`;
      const migration = this.migrations.get(key);

      if (!migration) {
        throw new Error(
          `No migration found from ${currentVersion} to next version`
        );
      }

      path.push(migration);
      currentVersion = migration.toVersion;
    }

    return path;
  }

  /**
   * Get next version in sequence (simplified for now)
   * In a real system, this would be more sophisticated
   */
  private getNextVersion(version: Version): Version {
    const parsed = VersionUtils.parse(version);

    // Simple increment logic - in practice, you'd have a defined upgrade path
    if (parsed.patch < 999) {
      return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
    } else if (parsed.minor < 999) {
      return `${parsed.major}.${parsed.minor + 1}.0`;
    } else {
      return `${parsed.major + 1}.0.0`;
    }
  }

  /**
   * Apply migrations to stored data
   */
  migrate(storedData: StoredMatrixData): MigrationResult {
    const result: MigrationResult = {
      success: false,
      appliedMigrations: [],
      errors: [],
    };

    try {
      const currentVersion = storedData.version;

      // If already at current version, no migration needed
      if (VersionUtils.isEqual(currentVersion, STORAGE_VERSION)) {
        result.success = true;
        return result;
      }

      // Cannot migrate to older versions
      if (VersionUtils.isGreaterThan(currentVersion, STORAGE_VERSION)) {
        result.errors.push(
          `Data version ${currentVersion} is newer than supported version ${STORAGE_VERSION}`
        );
        return result;
      }

      // Get migration path
      const migrations = this.getMigrationPath(currentVersion, STORAGE_VERSION);

      // Apply migrations sequentially
      let migratedData = storedData.data;
      for (const migration of migrations) {
        try {
          migratedData = migration.migrate(migratedData);
          result.appliedMigrations.push(migration);
        } catch (error) {
          result.errors.push(
            `Migration ${migration.fromVersion}->${migration.toVersion} failed: ${error}`
          );
          return result;
        }
      }

      // Update stored data with migrated data and new version
      storedData.data = migratedData;
      storedData.version = STORAGE_VERSION;

      result.success = true;
      result.migratedFrom = currentVersion;
      result.migratedTo = STORAGE_VERSION;
    } catch (error) {
      result.errors.push(`Migration failed: ${error}`);
    }

    return result;
  }
}

// ============ MIGRATION REGISTRY ============

/**
 * Global migration engine instance
 */
export const migrationEngine = new MigrationEngine();

// ============ EXAMPLE MIGRATIONS ============

/**
 * Example migration: Add new field to tasks
 * This is a template for future migrations
 */
const exampleMigration: Migration = {
  fromVersion: '1.0.0',
  toVersion: '1.0.1',
  description: 'Add priority field to tasks',
  migrate: (data: any) => {
    // Ensure data is valid MatrixData structure
    if (!data || !data.tasks || !Array.isArray(data.tasks)) {
      throw new Error('Invalid matrix data structure');
    }

    // Add priority field to all tasks
    data.tasks = data.tasks.map((task: any) => ({
      ...task,
      priority: task.priority || 'medium', // Default priority
    }));

    return data;
  },
};

// Register example migration (commented out since it's just an example)
// migrationEngine.register(exampleMigration);

// ============ UTILITY FUNCTIONS ============

/**
 * Check if data needs migration
 */
export function needsMigration(storedData: StoredMatrixData): boolean {
  return VersionUtils.isLessThan(storedData.version, STORAGE_VERSION);
}

/**
 * Validate migration result
 */
export function validateMigrationResult(result: MigrationResult): void {
  if (!result.success) {
    throw new Error(`Migration failed: ${result.errors.join(', ')}`);
  }
}

/**
 * Get migration history summary
 */
export function getMigrationSummary(result: MigrationResult): string {
  if (!result.success) {
    return `Migration failed: ${result.errors.join(', ')}`;
  }

  if (result.appliedMigrations.length === 0) {
    return 'No migrations needed - data is up to date';
  }

  const migrationDescriptions = result.appliedMigrations.map(
    (m) => m.description
  );
  return `Successfully migrated from ${result.migratedFrom} to ${result.migratedTo}: ${migrationDescriptions.join(', ')}`;
}

// ============ BACKWARD COMPATIBILITY HELPERS ============

/**
 * Create a compatibility layer for old data formats
 * This helps when loading data that might be in older formats
 */
export function createBackwardCompatibilityLayer(data: any): MatrixData {
  // For now, assume data is already in the correct format
  // In the future, this could transform very old formats before migrations

  // Basic validation
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data format');
  }

  if (
    !data.goal ||
    !Array.isArray(data.focusAreas) ||
    !Array.isArray(data.tasks)
  ) {
    throw new Error('Missing required matrix data fields');
  }

  return data as MatrixData;
}

// ============ FUTURE-PROOFING ============

/**
 * Data schema validator for future versions
 * This ensures that data conforms to expected schema before migrations
 */
export function validateDataSchema(
  data: any,
  expectedVersion: Version
): boolean {
  // Basic schema validation
  if (!data || typeof data !== 'object') return false;

  // Version-specific validation could be added here
  switch (expectedVersion) {
    case '1.0.0':
      return !!(
        data.goal &&
        Array.isArray(data.focusAreas) &&
        Array.isArray(data.tasks)
      );
    default:
      return false;
  }
}

/**
 * Export migration metadata for debugging
 */
export function getMigrationMetadata() {
  return {
    currentVersion: STORAGE_VERSION,
    registeredMigrations: Array.from(migrationEngine['migrations'].keys()),
    migrationCount: migrationEngine['migrations'].size,
  };
}
