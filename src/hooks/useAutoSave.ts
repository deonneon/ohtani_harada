import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Configuration options for auto-save
 */
interface AutoSaveOptions {
  /** Delay in milliseconds before auto-saving (default: 2000ms) */
  delay?: number;
  /** Key for localStorage storage */
  storageKey: string;
  /** Callback when auto-save occurs */
  onSave?: (data: any) => void;
  /** Callback when save fails */
  onError?: (error: Error) => void;
  /** Whether auto-save is enabled (default: true) */
  enabled?: boolean;
}

/**
 * Return type for useAutoSave hook
 */
interface UseAutoSaveReturn<T> {
  /** Current saved data */
  savedData: T | null;
  /** Whether data is currently being saved */
  isSaving: boolean;
  /** Timestamp of last successful save */
  lastSaved: Date | null;
  /** Force an immediate save */
  saveNow: () => Promise<void>;
  /** Clear saved data */
  clearSaved: () => void;
}

/**
 * Custom hook for auto-saving data with debouncing and localStorage persistence
 */
export function useAutoSave<T>(
  data: T,
  options: AutoSaveOptions
): UseAutoSaveReturn<T> {
  const {
    delay = 2000,
    storageKey,
    onSave,
    onError,
    enabled = true
  } = options;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [savedData, setSavedData] = useState<T | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef<T | null>(null);

  // Load saved data on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedData(parsed.data);
        if (parsed.timestamp) {
          setLastSaved(new Date(parsed.timestamp));
        }
      }
    } catch (error) {
      console.warn('Failed to load auto-saved data:', error);
      onError?.(error as Error);
    }
  }, [storageKey, onError]);

  // Auto-save function
  const performSave = useCallback(async (dataToSave: T) => {
    if (!enabled) return;

    setIsSaving(true);
    try {
      const saveData = {
        data: dataToSave,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem(storageKey, JSON.stringify(saveData));
      setSavedData(dataToSave);
      setLastSaved(new Date());
      onSave?.(dataToSave);
    } catch (error) {
      console.error('Auto-save failed:', error);
      onError?.(error as Error);
    } finally {
      setIsSaving(false);
    }
  }, [enabled, storageKey, onSave, onError]);

  // Debounced save effect
  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Don't save if data hasn't changed
    if (JSON.stringify(data) === JSON.stringify(lastDataRef.current)) {
      return;
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      performSave(data);
      lastDataRef.current = data;
    }, delay);

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, performSave]);

  // Force immediate save
  const saveNow = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await performSave(data);
    lastDataRef.current = data;
  }, [data, performSave]);

  // Clear saved data
  const clearSaved = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setSavedData(null);
      setLastSaved(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } catch (error) {
      console.warn('Failed to clear auto-saved data:', error);
      onError?.(error as Error);
    }
  }, [storageKey, onError]);

  return {
    savedData,
    isSaving,
    lastSaved,
    saveNow,
    clearSaved
  };
}

/**
 * Hook for managing auto-save state with visual indicators
 */
export function useAutoSaveIndicator(autoSaveResult: UseAutoSaveReturn<any>) {
  const { isSaving, lastSaved } = autoSaveResult;

  const getSaveStatus = () => {
    if (isSaving) return 'saving';
    if (lastSaved) return 'saved';
    return 'unsaved';
  };

  const getSaveStatusText = () => {
    if (isSaving) return 'Saving...';
    if (lastSaved) {
      const timeAgo = getTimeAgo(lastSaved);
      return `Saved ${timeAgo}`;
    }
    return 'Unsaved changes';
  };

  return {
    saveStatus: getSaveStatus(),
    saveStatusText: getSaveStatusText()
  };
}

/**
 * Get human-readable time ago string
 */
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}
