import React from 'react';
import type { JSX } from 'react';
import type { MatrixData } from '../utils';
import {
  calculateAreaProgress,
  calculateOverallProgress,
} from '../utils';
import GoalCell from './GoalCell';
import AreaHeaderCell from './AreaHeaderCell';
import TaskCell from './TaskCell';
import { ProgressBar, AreaProgressBar } from './ProgressBar';

/**
 * Props for the Grid component
 */
interface GridProps {
  /** The matrix data to display */
  matrixData: MatrixData;
  /** Callback when a cell is clicked */
  onCellClick?: (cellType: 'goal' | 'area' | 'task', id: string) => void;
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Currently selected cell IDs (supports multi-selection) */
  selectedCellIds?: string[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * Main Grid component for displaying the Harada Method 64-task matrix
 * Uses CSS Grid with 9x9 layout (81 cells total)
 */
// Custom hook for responsive detection with more granular breakpoints
const useResponsiveBreakpoint = () => {
  const [breakpoint, setBreakpoint] = React.useState<
    'mobile' | 'tablet' | 'desktop'
  >('desktop');

  React.useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    // Check on mount
    checkBreakpoint();

    // Listen for window resize with debouncing
    let timeoutId: number;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkBreakpoint, 100) as number;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
  };
};

const Grid: React.FC<GridProps> = ({
  matrixData,
  onCellClick,
  onSelectionChange,
  selectedCellIds = [],
  className = '',
}) => {
  // Internal state for selection management
  const [internalSelectedIds, setInternalSelectedIds] =
    React.useState<string[]>(selectedCellIds);
  const [focusedCellId, setFocusedCellId] = React.useState<string | null>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  // Zoom and pan state
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [panOffset, setPanOffset] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });

  // Use responsive breakpoint hook
  const { breakpoint, isMobile, isTablet, isDesktop } =
    useResponsiveBreakpoint();

  // Sync external selection changes
  React.useEffect(() => {
    setInternalSelectedIds(selectedCellIds);
  }, [selectedCellIds]);

  // Update external selection when internal selection changes
  const updateSelection = React.useCallback(
    (newSelection: string[]) => {
      setInternalSelectedIds(newSelection);
      onSelectionChange?.(newSelection);
    },
    [onSelectionChange]
  );

  // Handle cell click with multi-selection support
  const handleCellClick = React.useCallback(
    (
      cellType: 'goal' | 'area' | 'task',
      cellId: string,
      event: React.MouseEvent
    ) => {
      const isMultiSelect = event.ctrlKey || event.metaKey;
      const isShiftSelect = event.shiftKey;

      let newSelection: string[];

      if (isMultiSelect) {
        // Toggle selection
        if (internalSelectedIds.includes(cellId)) {
          newSelection = internalSelectedIds.filter((id) => id !== cellId);
        } else {
          newSelection = [...internalSelectedIds, cellId];
        }
      } else if (isShiftSelect && internalSelectedIds.length > 0) {
        // Range selection (simplified - select from last selected to current)
        const lastSelected =
          internalSelectedIds[internalSelectedIds.length - 1];
        const rangeSelection = getCellRange(lastSelected, cellId, matrixData);
        newSelection = Array.from(
          new Set([...internalSelectedIds, ...rangeSelection])
        );
      } else {
        // Single selection
        newSelection = [cellId];
      }

      updateSelection(newSelection);
      setFocusedCellId(cellId);
      onCellClick?.(cellType, cellId);
    },
    [internalSelectedIds, updateSelection, onCellClick]
  );

  // Keyboard navigation handler
  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (!focusedCellId) return;

      const currentPos = getCellPosition(focusedCellId, matrixData);
      if (!currentPos) return;

      let newRow = currentPos.row;
      let newCol = currentPos.col;

      switch (event.key) {
        case 'ArrowUp':
          newRow = Math.max(0, currentPos.row - 1);
          break;
        case 'ArrowDown':
          newRow = Math.min(8, currentPos.row + 1);
          break;
        case 'ArrowLeft':
          newCol = Math.max(0, currentPos.col - 1);
          break;
        case 'ArrowRight':
          newCol = Math.min(8, currentPos.col + 1);
          break;
        case 'Home':
          newCol = 0;
          break;
        case 'End':
          newCol = 8;
          break;
        case 'PageUp':
          newRow = 0;
          break;
        case 'PageDown':
          newRow = 8;
          break;
        case 'Escape':
          updateSelection([]);
          setFocusedCellId(null);
          return;
        case ' ':
        case 'Enter':
          // Simulate click on focused cell
          const cellId = getCellId(newRow, newCol);
          if (cellId) {
            const cellType = getCellType(newRow, newCol, matrixData);
            if (cellType !== 'empty') {
              handleCellClick(cellType, cellId, {
                ctrlKey: false,
                metaKey: false,
                shiftKey: false,
              } as any);
            }
          }
          return;
        default:
          return;
      }

      event.preventDefault();
      const newCellId = getCellId(newRow, newCol);
      if (newCellId && getCellType(newRow, newCol, matrixData) !== 'empty') {
        setFocusedCellId(newCellId);
      }
    },
    [focusedCellId, matrixData, handleCellClick, updateSelection]
  );

  // Add keyboard event listeners
  React.useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (gridRef.current?.contains(event.target as Node)) {
        handleKeyDown(event);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleKeyDown]);

  // Check if cell is selected
  const isCellSelected = React.useCallback(
    (cellId: string) => {
      return internalSelectedIds.includes(cellId);
    },
    [internalSelectedIds]
  );

  // Check if cell is focused
  const isCellFocused = React.useCallback(
    (cellId: string) => {
      return focusedCellId === cellId;
    },
    [focusedCellId]
  );

  // Zoom controls
  const zoomIn = React.useCallback(() => {
    setZoomLevel((prev) => Math.min(prev * 1.2, 3));
  }, []);

  const zoomOut = React.useCallback(() => {
    setZoomLevel((prev) => Math.max(prev / 1.2, 0.5));
  }, []);

  const resetZoom = React.useCallback(() => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  // Mouse event handlers for pan and zoom
  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      if (zoomLevel > 1 && !isMobile) {
        setIsDragging(true);
        setDragStart({
          x: event.clientX - panOffset.x,
          y: event.clientY - panOffset.y,
        });
      }
    },
    [zoomLevel, panOffset, isMobile]
  );

  const handleMouseMove = React.useCallback(
    (event: React.MouseEvent) => {
      if (isDragging && zoomLevel > 1) {
        setPanOffset({
          x: event.clientX - dragStart.x,
          y: event.clientY - dragStart.y,
        });
      }
    },
    [isDragging, zoomLevel, dragStart]
  );

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = React.useCallback(
    (event: React.WheelEvent) => {
      if (!isMobile) {
        event.preventDefault();
        const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
        setZoomLevel((prev) => Math.max(0.5, Math.min(3, prev * zoomFactor)));
      }
    },
    [isMobile]
  );

  // Touch event handlers for mobile zoom and swipe navigation
  const [touchStart, setTouchStart] = React.useState<{
    x: number;
    y: number;
    distance?: number;
    time?: number;
  } | null>(null);
  const [swipeStartArea, setSwipeStartArea] = React.useState<string | null>(
    null
  );

  const handleTouchStart = React.useCallback(
    (event: React.TouchEvent, areaId?: string) => {
      if (event.touches.length === 1) {
        // Single touch - potential pan or swipe
        const touch = event.touches[0];
        setTouchStart({ x: touch.clientX, y: touch.clientY, time: Date.now() });
        if (areaId && isMobile) {
          setSwipeStartArea(areaId);
        }
      } else if (event.touches.length === 2) {
        // Two touches - pinch zoom
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        setTouchStart({
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2,
          distance,
          time: Date.now(),
        });
        setSwipeStartArea(null); // Cancel swipe when pinching
      }
    },
    [isMobile]
  );

  const handleTouchMove = React.useCallback(
    (event: React.TouchEvent) => {
      if (!touchStart) return;

      if (event.touches.length === 1 && zoomLevel > 1) {
        // Single touch pan
        const touch = event.touches[0];
        const deltaX = touch.clientX - touchStart.x;
        const deltaY = touch.clientY - touchStart.y;
        setPanOffset((prev) => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        }));
        setTouchStart({ x: touch.clientX, y: touch.clientY });
      } else if (event.touches.length === 2 && touchStart.distance) {
        // Two touch pinch zoom
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        const zoomFactor = distance / touchStart.distance;
        setZoomLevel((prev) => Math.max(0.5, Math.min(3, prev * zoomFactor)));
        setTouchStart({
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2,
          distance,
        });
      }
    },
    [touchStart, zoomLevel]
  );

  const handleTouchEnd = React.useCallback(
    (event: React.TouchEvent) => {
      if (!touchStart || !touchStart.time) {
        setTouchStart(null);
        setSwipeStartArea(null);
        return;
      }

      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStart.time;

      if (
        event.changedTouches.length === 1 &&
        swipeStartArea &&
        isMobile &&
        touchDuration < 300
      ) {
        // Check for swipe gesture
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - touchStart.x;
        const deltaY = touch.clientY - touchStart.y;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Only consider horizontal swipes that are longer than vertical movement
        if (absDeltaX > absDeltaY && absDeltaX > 50) {
          const currentAreaIndex = matrixData.focusAreas.findIndex(
            (area) => area.id === swipeStartArea
          );
          if (currentAreaIndex !== -1) {
            const nextAreaIndex =
              deltaX > 0
                ? Math.max(0, currentAreaIndex - 1) // Swipe right -> previous area
                : Math.min(
                    matrixData.focusAreas.length - 1,
                    currentAreaIndex + 1
                  ); // Swipe left -> next area

            if (nextAreaIndex !== currentAreaIndex) {
              const nextArea = matrixData.focusAreas[nextAreaIndex];
              // Simulate click on the next area to navigate
              onCellClick?.('area', nextArea.id);
            }
          }
        }
      }

      setTouchStart(null);
      setSwipeStartArea(null);
    },
    [touchStart, swipeStartArea, isMobile, matrixData.focusAreas, onCellClick]
  );
  // Create a 9x9 grid layout
  // Center cell (4,4 in 0-based indexing) is the goal
  // Focus areas are arranged in the 8 surrounding positions
  // Create a 9x9 grid layout using the new cell components
  const renderGrid = () => {
    const cells: JSX.Element[] = [];

    // Create 9x9 grid (81 cells)
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cellKey = `${row}-${col}`;
        const cellId = getCellId(row, col);
        const isSelected = isCellSelected(cellId);
        const isFocused = isCellFocused(cellId);

        let cellElement: JSX.Element;

        // Center cell (4,4) - Goal
        if (row === 4 && col === 4) {
          cellElement = (
            <GoalCell
              key={cellKey}
              id={matrixData.goal.id}
              goal={matrixData.goal}
              isSelected={isSelected}
              className={isFocused ? 'ring-2 ring-blue-500' : ''}
              onClick={(event) =>
                handleCellClick('goal', matrixData.goal.id, event)
              }
            />
          );
        }
        // Focus area positions (arranged around center)
        else if (isFocusAreaPosition(row, col)) {
          const areaIndex = getFocusAreaIndex(row, col);
          const focusArea = matrixData.focusAreas[areaIndex];

          if (focusArea) {
            cellElement = (
              <AreaHeaderCell
                key={cellKey}
                id={focusArea.id}
                focusArea={focusArea}
                isSelected={isSelected}
                className={isFocused ? 'ring-2 ring-green-500' : ''}
                onClick={(event) =>
                  handleCellClick('area', focusArea.id, event)
                }
              />
            );
          } else {
            // Empty cell if focus area doesn't exist
            cellElement = (
              <div
                key={cellKey}
                className="bg-gray-100 border-gray-200 rounded-md"
              />
            );
          }
        }
        // Task positions (remaining cells)
        else {
          const taskIndex = getTaskIndex(row, col);
          const task = matrixData.tasks[taskIndex];

          if (task) {
            cellElement = (
              <TaskCell
                key={cellKey}
                id={task.id}
                task={task}
                isSelected={isSelected}
                className={isFocused ? 'ring-2 ring-yellow-500' : ''}
                onClick={(event) => handleCellClick('task', task.id, event)}
              />
            );
          } else {
            // Empty cell
            cellElement = (
              <div
                key={cellKey}
                className="bg-gray-100 border-gray-200 rounded-md"
              />
            );
          }
        }

        cells.push(cellElement);
      }
    }

    return cells;
  };

  // Mobile layout: accordion-style focus areas with tasks
  if (isMobile) {
    return (
      <div
        ref={gridRef}
        className={`bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 rounded-xl shadow-xl border border-gray-200/50 ${className}`}
        role="region"
        aria-label="Harada Method 64-task matrix - mobile view"
        tabIndex={0}
        // Optimize touch scrolling on mobile
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Mobile header with goal */}
        <div className="p-4 border-b border-gray-200/50">
          <GoalCell
            id={matrixData.goal.id}
            goal={matrixData.goal}
            isSelected={isCellSelected(matrixData.goal.id)}
            onClick={(event) =>
              handleCellClick('goal', matrixData.goal.id, event)
            }
            className="min-h-[120px]"
          />
        </div>

        {/* Mobile focus areas as accordion sections */}
        <div className="divide-y divide-gray-200/30">
          {matrixData.focusAreas.map((focusArea, index) => {
            const areaTasks = matrixData.tasks.filter(
              (task) => task.areaId === focusArea.id
            );
            const isAreaSelected = isCellSelected(focusArea.id);
            const selectedTasksInArea = areaTasks.filter((task) =>
              isCellSelected(task.id)
            );
            const areaProgress = calculateAreaProgress(
              matrixData,
              focusArea.id
            );

            return (
              <details key={focusArea.id} className="group">
                <summary
                  className="flex flex-col p-4 cursor-pointer hover:bg-gray-50/50 active:bg-gray-100/50 transition-colors touch-manipulation"
                  onTouchStart={(e) => handleTouchStart(e, focusArea.id)}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className="flex items-center justify-between min-h-[80px]">
                    <AreaHeaderCell
                      id={focusArea.id}
                      focusArea={focusArea}
                      isSelected={isAreaSelected}
                      onClick={(event) =>
                        handleCellClick('area', focusArea.id, event)
                      }
                      className="flex-1 mr-3 min-h-[60px]"
                    />
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{areaTasks.length} tasks</span>
                      <span>
                        {selectedTasksInArea.length > 0 &&
                          `(${selectedTasksInArea.length} selected)`}
                      </span>
                      <svg
                        className="w-5 h-5 transition-transform group-open:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {/* Progress bar for focus area */}
                  <div className="mt-2 px-2">
                    <AreaProgressBar
                      completed={
                        areaTasks.filter((t) => t.status === 'completed').length
                      }
                      total={areaTasks.length}
                      areaTitle=""
                      size="sm"
                      className="w-full"
                    />
                  </div>
                </summary>

                {/* Tasks in this focus area - Performance optimized for mobile */}
                <div className="px-4 pb-4 space-y-3">
                  {areaTasks.slice(0, 20).map((task) => (
                    <TaskCell
                      key={task.id}
                      id={task.id}
                      task={task}
                      isSelected={isCellSelected(task.id)}
                      onClick={(event) =>
                        handleCellClick('task', task.id, event)
                      }
                      className="min-h-[100px] w-full touch-manipulation"
                    />
                  ))}
                  {areaTasks.length > 20 && (
                    <div className="text-center py-2 text-gray-500 text-sm">
                      ... and {areaTasks.length - 20} more tasks
                    </div>
                  )}
                  {areaTasks.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No tasks in this focus area yet
                    </div>
                  )}
                </div>
              </details>
            );
          })}
        </div>

        {/* Mobile zoom controls */}
        <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
          <button
            onClick={zoomIn}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 font-bold hover:bg-white transition-colors"
            aria-label="Zoom in"
            disabled={zoomLevel >= 3}
          >
            +
          </button>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
            <span className="text-sm font-medium text-gray-700">
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>
          <button
            onClick={zoomOut}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-700 font-bold hover:bg-white transition-colors"
            aria-label="Zoom out"
            disabled={zoomLevel <= 0.5}
          >
            −
          </button>
          {zoomLevel !== 1 && (
            <button
              onClick={resetZoom}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
              aria-label="Reset zoom"
            >
              Reset
            </button>
          )}
        </div>

        {/* Mobile selection overlay */}
        {internalSelectedIds.length > 0 && (
          <div className="fixed bottom-4 left-4 right-4 z-50">
            <div className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between">
              <span className="text-sm">
                Selected: {internalSelectedIds.length} cell
                {internalSelectedIds.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => updateSelection([])}
                className="text-blue-200 hover:text-white text-sm underline ml-2"
                aria-label="Clear selection"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop layout: 9x9 grid
  const overallProgress = calculateOverallProgress(matrixData);

  return (
    <div className={`relative ${className}`}>
      {/* Progress and zoom controls */}
      <div className="absolute -top-20 left-0 right-0 z-20 flex items-center justify-between">
        {/* Overall progress indicator */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 min-w-[300px]">
          <ProgressBar
            progress={overallProgress}
            label={`Overall Progress (${matrixData.tasks.filter((t) => t.status === 'completed').length}/${matrixData.tasks.length} tasks)`}
            size="md"
            className="w-full"
          />
        </div>

        {/* Zoom controls */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 flex items-center space-x-2">
          <button
            onClick={zoomOut}
            className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold transition-colors"
            aria-label="Zoom out"
            disabled={zoomLevel <= 0.5}
          >
            −
          </button>

          <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>

          <button
            onClick={zoomIn}
            className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold transition-colors"
            aria-label="Zoom in"
            disabled={zoomLevel >= 3}
          >
            +
          </button>

          <button
            onClick={resetZoom}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            aria-label="Reset zoom and pan"
          >
            Reset
          </button>
        </div>
      </div>

      <div
        ref={gridRef}
        className={`grid grid-cols-9 grid-rows-9 gap-1 sm:gap-2 p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden ${
          zoomLevel > 1 ? 'cursor-move' : ''
        }`}
        style={{
          aspectRatio: '1 / 1',
          maxWidth: '900px',
          maxHeight: '900px',
          transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
        role="grid"
        aria-label="Harada Method 64-task matrix"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Grid background pattern for subtle texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)] rounded-xl pointer-events-none"></div>

        {/* Grid lines for better structure */}
        <div className="absolute inset-0 grid grid-cols-9 grid-rows-9 gap-1 sm:gap-2 pointer-events-none">
          {Array.from({ length: 81 }).map((_, index) => (
            <div
              key={index}
              className="border border-gray-200/20 rounded-lg"
            ></div>
          ))}
        </div>

        {/* Render the actual grid cells */}
        <div className="relative z-10 contents">{renderGrid()}</div>

        {/* Zoom cursor indicator when zoomed */}
        {zoomLevel > 1 && (
          <div className="absolute top-2 left-2 bg-black/75 text-white text-xs px-2 py-1 rounded pointer-events-none">
            Drag to pan • Scroll to zoom
          </div>
        )}
      </div>

      {/* Desktop selection info overlay */}
      {internalSelectedIds.length > 0 && (
        <div className="absolute -bottom-12 left-0 right-0 text-center">
          <div className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-full shadow-lg">
            <span className="mr-2">
              Selected: {internalSelectedIds.length} cell
              {internalSelectedIds.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => updateSelection([])}
              className="ml-2 text-blue-200 hover:text-white text-xs underline"
              aria-label="Clear selection"
            >
              Clear (Esc)
            </button>
          </div>
        </div>
      )}

      {/* Zoom level indicator */}
      {zoomLevel !== 1 && (
        <div className="absolute top-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded pointer-events-none">
          {Math.round(zoomLevel * 100)}%
        </div>
      )}
    </div>
  );
};

/**
 * Determine if a grid position should contain a focus area
 */
function isFocusAreaPosition(row: number, col: number): boolean {
  // Focus areas are positioned around the center (4,4)
  // Top: (2,4), Right: (4,6), Bottom: (6,4), Left: (4,2)
  // Diagonals: (2,2), (2,6), (6,2), (6,6)
  return (
    (row === 2 && col === 4) || // Top
    (row === 4 && col === 6) || // Right
    (row === 6 && col === 4) || // Bottom
    (row === 4 && col === 2) || // Left
    (row === 2 && col === 2) || // Top-left
    (row === 2 && col === 6) || // Top-right
    (row === 6 && col === 2) || // Bottom-left
    (row === 6 && col === 6) // Bottom-right
  );
}

/**
 * Get the focus area index for a given grid position
 */
function getFocusAreaIndex(row: number, col: number): number {
  if (row === 2 && col === 4) return 0; // Top - Physical Development
  if (row === 2 && col === 6) return 1; // Top-right - Mental Preparation
  if (row === 4 && col === 6) return 2; // Right - Skill Acquisition
  if (row === 6 && col === 6) return 3; // Bottom-right - Strategic Planning
  if (row === 6 && col === 4) return 4; // Bottom - Performance Execution
  if (row === 6 && col === 2) return 5; // Bottom-left - Recovery & Maintenance
  if (row === 4 && col === 2) return 6; // Left - Relationship Building
  if (row === 2 && col === 2) return 7; // Top-left - Personal Growth

  return 0; // Fallback
}

/**
 * Get the task index for a given grid position
 * Tasks are arranged in groups around each focus area
 */
function getTaskIndex(row: number, col: number): number {
  // This is a simplified mapping - in a real implementation,
  // tasks would be arranged more systematically around their focus areas

  // Convert 9x9 grid position to linear index, excluding center and focus area positions
  let taskIndex = 0;
  const totalCells = 81;
  const excludedCells = 9; // 1 goal + 8 focus areas

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (r === 4 && c === 4) continue; // Skip goal
      if (isFocusAreaPosition(r, c)) continue; // Skip focus areas

      if (r === row && c === col) {
        return taskIndex;
      }
      taskIndex++;
    }
  }

  return 0; // Fallback
}

/**
 * Get the grid position (row, col) for a given cell ID
 */
function getCellPosition(
  cellId: string,
  matrixData: MatrixData
): { row: number; col: number } | null {
  // Check goal cell
  if (cellId === matrixData.goal.id) {
    return { row: 4, col: 4 };
  }

  // Check focus areas
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (isFocusAreaPosition(row, col)) {
        const areaIndex = getFocusAreaIndex(row, col);
        const focusArea = matrixData.focusAreas[areaIndex];
        if (focusArea?.id === cellId) {
          return { row, col };
        }
      }
    }
  }

  // Check tasks
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (!isFocusAreaPosition(row, col) && row !== 4 && col !== 4) {
        const taskIndex = getTaskIndex(row, col);
        const task = matrixData.tasks[taskIndex];
        if (task?.id === cellId) {
          return { row, col };
        }
      }
    }
  }

  return null;
}

/**
 * Get all cell IDs in a range from startCellId to endCellId
 * This is a simplified implementation for range selection
 */
function getCellRange(
  startCellId: string,
  endCellId: string,
  matrixData: MatrixData
): string[] {
  const startPos = getCellPosition(startCellId, matrixData);
  const endPos = getCellPosition(endCellId, matrixData);

  if (!startPos || !endPos) return [];

  const cells: string[] = [];
  const minRow = Math.min(startPos.row, endPos.row);
  const maxRow = Math.max(startPos.row, endPos.row);
  const minCol = Math.min(startPos.col, endPos.col);
  const maxCol = Math.max(startPos.col, endPos.col);

  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      const cellId = getCellId(row, col);
      if (cellId && getCellType(row, col, matrixData) !== 'empty') {
        cells.push(cellId);
      }
    }
  }

  return cells;
}

/**
 * Get a unique cell ID for a given grid position
 */
function getCellId(row: number, col: number): string {
  return `${row}-${col}`;
}

/**
 * Get the cell type for a given grid position
 */
function getCellType(
  row: number,
  col: number,
  matrixData: MatrixData
): 'goal' | 'area' | 'task' | 'empty' {
  // Center cell (4,4) - Goal
  if (row === 4 && col === 4) {
    return 'goal';
  }
  // Focus area positions
  else if (isFocusAreaPosition(row, col)) {
    const areaIndex = getFocusAreaIndex(row, col);
    return matrixData.focusAreas[areaIndex] ? 'area' : 'empty';
  }
  // Task positions
  else {
    const taskIndex = getTaskIndex(row, col);
    return matrixData.tasks[taskIndex] ? 'task' : 'empty';
  }
}

export default Grid;
