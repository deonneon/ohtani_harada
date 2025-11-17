import { useState, useCallback, useEffect } from 'react';
import { Grid, GoalEditor, FocusAreaEditor, SetupWizard, TaskEditor, BatchTaskCreator, TaskOrganizer } from './components';
import { createEmptyMatrix } from './utils';
import { MatrixData, CreateGoalInput, TaskStatus, TaskPriority } from './types';

function App() {
  // Matrix data state - now mutable so we can update the goal
  const [matrixData, setMatrixData] = useState<MatrixData>(() =>
    createEmptyMatrix({
      title: 'Become a Professional Baseball Player',
      description: 'Achieve excellence in baseball through systematic development of physical, mental, and strategic skills'
    })
  );

  const [selectedCellIds, setSelectedCellIds] = useState<string[]>([]);

  // Goal editor modal state
  const [isGoalEditorOpen, setIsGoalEditorOpen] = useState(false);

  // Focus area editor modal state
  const [isFocusAreaEditorOpen, setIsFocusAreaEditorOpen] = useState(false);

  // Setup wizard modal state
  const [isSetupWizardOpen, setIsSetupWizardOpen] = useState(false);

  // Task editor modal state
  const [isTaskEditorOpen, setIsTaskEditorOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<{task: any, areaId: string} | null>(null);

  // Batch task creator modal state
  const [isBatchCreatorOpen, setIsBatchCreatorOpen] = useState(false);

  // Task filtering state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // View mode state
  const [viewMode, setViewMode] = useState<'grid' | 'organizer'>('grid');

  const handleCellClick = (cellType: 'goal' | 'area' | 'task', id: string) => {
    console.log(`Clicked ${cellType}:`, id);

    if (cellType === 'task') {
      // Find the task and its area
      const task = matrixData.tasks.find(t => t.id === id);
      if (task) {
        handleOpenTaskEditor(task, task.areaId);
      }
    } else if (cellType === 'area') {
      // Could open area-specific task creation or focus area editor
      console.log('Area clicked:', id);
    }
  };

  const handleSelectionChange = (newSelection: string[]) => {
    console.log('Selection changed:', newSelection);
    setSelectedCellIds(newSelection);
  };

  // Goal editor handlers
  const handleOpenGoalEditor = () => {
    setIsGoalEditorOpen(true);
  };

  const handleCloseGoalEditor = () => {
    setIsGoalEditorOpen(false);
  };

  const handleSaveGoal = (goalData: CreateGoalInput) => {
    setMatrixData(prevData => ({
      ...prevData,
      goal: {
        ...prevData.goal,
        title: goalData.title,
        description: goalData.description
      }
    }));
  };

  // Focus area editor handlers
  const handleOpenFocusAreaEditor = () => {
    setIsFocusAreaEditorOpen(true);
  };

  const handleCloseFocusAreaEditor = () => {
    setIsFocusAreaEditorOpen(false);
  };

  const handleSaveFocusAreas = (areaData: CreateFocusAreaInput[]) => {
    setMatrixData(prevData => ({
      ...prevData,
      focusAreas: areaData.map((area, index) => ({
        id: prevData.focusAreas[index]?.id || `area-${index + 1}`,
        title: area.title,
        description: area.description,
        goalId: prevData.goal.id
      }))
    }));
  };

  // Setup wizard handlers
  const handleOpenSetupWizard = () => {
    setIsSetupWizardOpen(true);
  };

  const handleCloseSetupWizard = () => {
    setIsSetupWizardOpen(false);
  };

  const handleWizardComplete = (goalData: CreateGoalInput, areasData: CreateFocusAreaInput[]) => {
    setMatrixData(prevData => ({
      ...prevData,
      goal: {
        ...prevData.goal,
        title: goalData.title,
        description: goalData.description
      },
      focusAreas: areasData.map((area, index) => ({
        id: prevData.focusAreas[index]?.id || `area-${index + 1}`,
        title: area.title,
        description: area.description,
        goalId: prevData.goal.id
      }))
    }));
  };

  // Task editor handlers
  const handleOpenTaskEditor = (task?: any, areaId?: string) => {
    if (task && areaId) {
      setEditingTask({ task, areaId });
    } else {
      // Create new task - need to determine areaId from context
      // For now, default to first area or prompt user
      const defaultAreaId = matrixData.focusAreas[0]?.id;
      setEditingTask({ task: null, areaId: defaultAreaId });
    }
    setIsTaskEditorOpen(true);
  };

  const handleCloseTaskEditor = () => {
    setIsTaskEditorOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = (taskData: any) => {
    if (editingTask?.task) {
      // Update existing task
      setMatrixData(prevData => ({
        ...prevData,
        tasks: prevData.tasks.map(task =>
          task.id === editingTask.task.id
            ? {
                ...task,
                ...taskData,
                completedDate: taskData.status === 'completed' && task.status !== 'completed'
                  ? new Date()
                  : task.completedDate
              }
            : task
        )
      }));
    } else {
      // Create new task
      const newTask = {
        id: `task-${Date.now()}`,
        ...taskData,
        completedDate: taskData.status === 'completed' ? new Date() : undefined
      };
      setMatrixData(prevData => ({
        ...prevData,
        tasks: [...prevData.tasks, newTask]
      }));
    }
  };

  // Batch task creator handlers
  const handleOpenBatchCreator = () => {
    setIsBatchCreatorOpen(true);
  };

  const handleCloseBatchCreator = () => {
    setIsBatchCreatorOpen(false);
  };

  const handleCreateBatchTasks = (taskData: any[]) => {
    const newTasks = taskData.map(taskData => ({
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...taskData,
      completedDate: taskData.status === 'completed' ? new Date() : undefined
    }));

    setMatrixData(prevData => ({
      ...prevData,
      tasks: [...prevData.tasks, ...newTasks]
    }));
  };

  // Task reordering handler
  const handleTaskReorder = (reorderedTasks: any[]) => {
    setMatrixData(prevData => ({
      ...prevData,
      tasks: reorderedTasks
    }));
  };

  // View mode handlers
  const switchToGridView = () => setViewMode('grid');
  const switchToOrganizerView = () => setViewMode('organizer');

  // Keyboard shortcuts handler
  const handleKeyboardShortcuts = useCallback((event: KeyboardEvent) => {
    // Ignore if user is typing in an input/textarea
    if (event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement) {
      return;
    }

    // Ignore if any modal is open
    if (isGoalEditorOpen || isFocusAreaEditorOpen || isSetupWizardOpen ||
        isTaskEditorOpen || isBatchCreatorOpen) {
      return;
    }

    const isCtrlOrCmd = event.ctrlKey || event.metaKey;

    switch (event.key.toLowerCase()) {
      case 'n':
        if (isCtrlOrCmd) {
          event.preventDefault();
          handleOpenTaskEditor();
        }
        break;
      case 'b':
        if (isCtrlOrCmd) {
          event.preventDefault();
          handleOpenBatchCreator();
        }
        break;
      case 'g':
        if (isCtrlOrCmd) {
          event.preventDefault();
          switchToGridView();
        }
        break;
      case 'o':
        if (isCtrlOrCmd) {
          event.preventDefault();
          switchToOrganizerView();
        }
        break;
      case 'f':
        if (isCtrlOrCmd && event.shiftKey) {
          event.preventDefault();
          // Focus first filter select
          const firstFilter = document.querySelector('select#status-filter') as HTMLSelectElement;
          firstFilter?.focus();
        }
        break;
      case 'escape':
        // Clear any selections in grid view
        if (viewMode === 'grid' && selectedCellIds.length > 0) {
          handleSelectionChange([]);
        }
        break;
      case '?':
        if (isCtrlOrCmd) {
          event.preventDefault();
          showKeyboardShortcutsHelp();
        }
        break;
    }
  }, [
    isGoalEditorOpen,
    isFocusAreaEditorOpen,
    isSetupWizardOpen,
    isTaskEditorOpen,
    isBatchCreatorOpen,
    viewMode,
    selectedCellIds,
    handleSelectionChange,
    handleOpenTaskEditor,
    handleOpenBatchCreator,
    switchToGridView,
    switchToOrganizerView,
    showKeyboardShortcutsHelp
  ]);

  // Show keyboard shortcuts help
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  const showKeyboardShortcutsHelp = () => {
    setShowShortcutsHelp(true);
  };

  const hideKeyboardShortcutsHelp = () => {
    setShowShortcutsHelp(false);
  };

  // Filter tasks based on current filters
  const filteredTasks = matrixData.tasks.filter(task => {
    const statusMatch = statusFilter === 'all' || task.status === statusFilter;
    const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const filteredMatrixData = {
    ...matrixData,
    tasks: filteredTasks
  };

  // Add global keyboard shortcuts
  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [handleKeyboardShortcuts]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Harada Method - Ohtani Matrix
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {viewMode === 'grid' ? 'Interactive Matrix Grid' : 'Task Organizer'}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleOpenSetupWizard}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors text-sm font-medium"
                aria-label="Guided setup"
              >
                Guided Setup
              </button>
              <button
                onClick={handleOpenGoalEditor}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm font-medium"
                aria-label="Edit goal"
              >
                Edit Goal
              </button>
              <button
                onClick={handleOpenFocusAreaEditor}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm font-medium"
                aria-label="Edit focus areas"
              >
                Edit Areas
              </button>
              <button
                onClick={() => handleOpenTaskEditor()}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors text-sm font-medium"
                aria-label="Create task"
              >
                Create Task
              </button>
              <button
                onClick={handleOpenBatchCreator}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors text-sm font-medium"
                aria-label="Create multiple tasks"
              >
                Batch Create
              </button>
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={switchToGridView}
                  className={`px-3 py-2 text-sm font-medium rounded-l-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-label="Grid view"
                >
                  📊 Grid
                </button>
                <button
                  onClick={switchToOrganizerView}
                  className={`px-3 py-2 text-sm font-medium rounded-r-md transition-colors ${
                    viewMode === 'organizer'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-label="Organizer view"
                >
                  📝 Organizer
                </button>
              </div>
              <button
                onClick={showKeyboardShortcutsHelp}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-label="Keyboard shortcuts help"
                title="Keyboard shortcuts (Ctrl+?)"
              >
                ⌨️ Help
              </button>
            </div>
          </div>

          {/* Task Filters */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Filter Tasks</h3>
            <div className="flex flex-wrap gap-4">
              <div>
                <label htmlFor="status-filter" className="block text-xs font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value={TaskStatus.PENDING}>⏳ Pending</option>
                  <option value={TaskStatus.IN_PROGRESS}>🔄 In Progress</option>
                  <option value={TaskStatus.COMPLETED}>✅ Completed</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority-filter" className="block text-xs font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority-filter"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Priority</option>
                  <option value={TaskPriority.HIGH}>🔴 High</option>
                  <option value={TaskPriority.MEDIUM}>🟡 Medium</option>
                  <option value={TaskPriority.LOW}>🔵 Low</option>
                </select>
              </div>

              {(statusFilter !== 'all' || priorityFilter !== 'all') && (
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setPriorityFilter('all');
                    }}
                    className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {viewMode === 'grid' && (
            <div className="text-gray-600 mb-6 space-y-2">
              {/* Desktop instructions */}
              <div className="hidden sm:block">
                <p>
                  <strong>Click</strong> to select cells. <strong>Ctrl+Click</strong> (or <strong>Cmd+Click</strong>) to multi-select. <strong>Shift+Click</strong> for range selection.
                </p>
                <p>
                  Use <strong>arrow keys</strong> to navigate, <strong>Space/Enter</strong> to select, <strong>Esc</strong> to clear selection.
                </p>
                <p>
                  <strong>Scroll</strong> to zoom, <strong>click and drag</strong> when zoomed to pan. Use zoom controls to adjust view.
                </p>
              </div>

              {/* Mobile instructions */}
              <div className="sm:hidden">
                <p>
                  <strong>Tap</strong> focus areas to expand/collapse and view tasks. <strong>Tap</strong> cells to select them.
                </p>
                <p>
                  <strong>Pinch</strong> to zoom, <strong>drag</strong> when zoomed to pan. Use zoom controls for precise adjustment.
                </p>
              </div>

              <p className="text-sm opacity-75">
                The interface automatically adapts to your screen size - desktop shows a 9×9 grid, mobile shows an expandable list.
              </p>
            </div>
          )}

          {viewMode === 'organizer' && (
            <div className="text-gray-600 mb-6">
              <p>
                <strong>Drag and drop</strong> tasks to reorder them within each focus area. <strong>Click</strong> any task to edit it.
              </p>
              <p className="text-sm opacity-75 mt-2">
                Use the filters above to focus on specific tasks, and switch back to Grid view to see the visual matrix.
              </p>
            </div>
          )}

          <div className="flex justify-center">
            {viewMode === 'grid' ? (
              <Grid
                matrixData={filteredMatrixData}
                onCellClick={handleCellClick}
                onSelectionChange={handleSelectionChange}
                selectedCellIds={selectedCellIds}
              />
            ) : (
              <div className="w-full max-w-4xl">
                <TaskOrganizer
                  tasks={filteredTasks}
                  focusAreas={matrixData.focusAreas}
                  onTaskReorder={handleTaskReorder}
                  onTaskClick={(task) => handleOpenTaskEditor(task, task.areaId)}
                  dragEnabled={true}
                />
              </div>
            )}
          </div>

          {viewMode === 'grid' && selectedCellIds.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                Selected {selectedCellIds.length} cell{selectedCellIds.length !== 1 ? 's' : ''}:
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedCellIds.map(id => (
                  <code key={id} className="bg-blue-100 px-2 py-1 rounded text-xs">
                    {id.slice(0, 8)}...
                  </code>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Matrix Statistics</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1</div>
              <div className="text-sm text-blue-800">Goal</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{matrixData.focusAreas.length}</div>
              <div className="text-sm text-green-800">Focus Areas</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredTasks.length}
                {filteredTasks.length !== matrixData.tasks.length && (
                  <span className="text-xs text-yellow-700 block">of {matrixData.tasks.length}</span>
                )}
              </div>
              <div className="text-sm text-yellow-800">Tasks</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {matrixData.tasks.filter(t => t.status === TaskStatus.COMPLETED).length}
              </div>
              <div className="text-sm text-purple-800">Completed</div>
            </div>
          </div>
          {(statusFilter !== 'all' || priorityFilter !== 'all') && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Filtered:</strong> Showing {filteredTasks.length} of {matrixData.tasks.length} tasks
                {statusFilter !== 'all' && ` with status "${statusFilter}"`}
                {priorityFilter !== 'all' && ` with priority "${priorityFilter}"`}
              </p>
            </div>
          )}
        </div>

        {/* Goal Editor Modal */}
        <GoalEditor
          isOpen={isGoalEditorOpen}
          goal={matrixData.goal}
          onClose={handleCloseGoalEditor}
          onSave={handleSaveGoal}
        />

        {/* Focus Area Editor Modal */}
        {isFocusAreaEditorOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleCloseFocusAreaEditor}
          >
            <FocusAreaEditor
              isOpen={isFocusAreaEditorOpen}
              focusAreas={matrixData.focusAreas}
              goalId={matrixData.goal.id}
              onSave={handleSaveFocusAreas}
              onClose={handleCloseFocusAreaEditor}
            />
          </div>
        )}

        {/* Setup Wizard Modal */}
        <SetupWizard
          isOpen={isSetupWizardOpen}
          matrixData={matrixData}
          onComplete={handleWizardComplete}
          onClose={handleCloseSetupWizard}
        />

        {/* Task Editor Modal */}
        <TaskEditor
          isOpen={isTaskEditorOpen}
          task={editingTask?.task || null}
          areaId={editingTask?.areaId || ''}
          onClose={handleCloseTaskEditor}
          onSave={handleSaveTask}
          mode="modal"
        />

        {/* Batch Task Creator Modal */}
        <BatchTaskCreator
          isOpen={isBatchCreatorOpen}
          focusAreaIds={matrixData.focusAreas.map(area => area.id)}
          onCreate={handleCreateBatchTasks}
          onClose={handleCloseBatchCreator}
        />

        {/* Keyboard Shortcuts Help Modal */}
        {showShortcutsHelp && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={hideKeyboardShortcutsHelp}
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 id="shortcuts-title" className="text-xl font-semibold text-gray-900">
                  Keyboard Shortcuts
                </h2>
                <button
                  onClick={hideKeyboardShortcutsHelp}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close shortcuts help"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Task Management</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Create Task</span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+N</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Batch Create Tasks</span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+B</kbd>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">View Modes</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Grid View</span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+G</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Organizer View</span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+O</kbd>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Navigation</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Focus Filters</span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+Shift+F</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Clear Selection (Grid)</span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span>Show Shortcuts</span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+?</kbd>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Grid Navigation (when focused)</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Navigate</span>
                        <span className="text-gray-500">Arrow Keys</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Select Cell</span>
                        <span className="text-gray-500">Space/Enter</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Multi-select</span>
                        <span className="text-gray-500">Ctrl+Click</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Range Select</span>
                        <span className="text-gray-500">Shift+Click</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      <strong>Tip:</strong> Keyboard shortcuts are disabled when typing in forms or when modals are open.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <button
                  onClick={hideKeyboardShortcutsHelp}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
