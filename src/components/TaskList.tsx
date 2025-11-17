import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskStatus, TaskPriority } from '../types';

interface TaskListProps {
  /** The tasks to display */
  tasks: Task[];
  /** The focus area these tasks belong to */
  areaId: string;
  /** Callback when tasks are reordered */
  onReorder: (tasks: Task[]) => void;
  /** Callback when a task is clicked for editing */
  onTaskClick: (task: Task) => void;
  /** Whether drag and drop is enabled */
  dragEnabled?: boolean;
}

/**
 * Individual sortable task item
 */
const SortableTaskItem: React.FC<{
  task: Task;
  onTaskClick: (task: Task) => void;
  dragEnabled?: boolean;
}> = ({ task, onTaskClick, dragEnabled = true }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const statusInfo = getStatusInfo(task.status);
  const priorityInfo = getPriorityInfo(task.priority);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm
        hover:shadow-md transition-all duration-200 cursor-pointer
        ${isDragging ? 'shadow-lg ring-2 ring-blue-300' : ''}
      `}
      onClick={() => onTaskClick(task)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onTaskClick(task);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Task: ${task.title}. Status: ${statusInfo.label}. Priority: ${priorityInfo.label}. Click to edit.`}
      {...attributes}
      {...(dragEnabled ? listeners : {})}
    >
      {/* Drag Handle */}
      {dragEnabled && (
        <div className="flex-shrink-0 text-gray-400 hover:text-gray-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4h14a1 1 0 010 2H3a1 1 0 010-2zM3 8h14a1 1 0 010 2H3a1 1 0 010-2zM3 12h14a1 1 0 010 2H3a1 1 0 010-2z"/>
          </svg>
        </div>
      )}

      {/* Priority Indicator */}
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${priorityInfo.bgColor}`}
        title={`Priority: ${priorityInfo.label}`}
      >
        {priorityInfo.icon}
      </div>

      {/* Status Indicator */}
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${statusInfo.bgColor}`}
        title={`Status: ${statusInfo.label}`}
      >
        {statusInfo.icon}
      </div>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
        <p className="text-sm text-gray-600 truncate">{task.description}</p>
      </div>

      {/* Completion Date */}
      {task.status === TaskStatus.COMPLETED && task.completedDate && (
        <div className="flex-shrink-0 text-xs text-green-600">
          ✓ {new Date(task.completedDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

/**
 * Draggable task list component
 */
export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  areaId,
  onReorder,
  onTaskClick,
  dragEnabled = true
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);

      const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);
      onReorder(reorderedTasks);
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500" role="status" aria-live="polite">
        <div className="text-4xl mb-2" aria-hidden="true">📝</div>
        <p>No tasks yet. Click "Create Task" to add your first task!</p>
      </div>
    );
  }

  if (!dragEnabled) {
    return (
      <div className="space-y-2">
        {tasks.map((task) => (
          <SortableTaskItem
            key={task.id}
            task={task}
            onTaskClick={onTaskClick}
            dragEnabled={false}
          />
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {tasks.map((task) => (
            <SortableTaskItem
              key={task.id}
              task={task}
              onTaskClick={onTaskClick}
              dragEnabled={dragEnabled}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

/**
 * Get status display information
 */
function getStatusInfo(status: TaskStatus) {
  switch (status) {
    case TaskStatus.PENDING:
      return { icon: '⏳', label: 'Pending', bgColor: 'bg-gray-100' };
    case TaskStatus.IN_PROGRESS:
      return { icon: '🔄', label: 'In Progress', bgColor: 'bg-blue-100' };
    case TaskStatus.COMPLETED:
      return { icon: '✅', label: 'Completed', bgColor: 'bg-green-100' };
    default:
      return { icon: '❓', label: 'Unknown', bgColor: 'bg-gray-100' };
  }
}

/**
 * Get priority display information
 */
function getPriorityInfo(priority: TaskPriority) {
  switch (priority) {
    case TaskPriority.HIGH:
      return { icon: '🔴', label: 'High Priority', bgColor: 'bg-red-100' };
    case TaskPriority.MEDIUM:
      return { icon: '🟡', label: 'Medium Priority', bgColor: 'bg-yellow-100' };
    case TaskPriority.LOW:
      return { icon: '🔵', label: 'Low Priority', bgColor: 'bg-blue-100' };
    default:
      return { icon: '⚪', label: 'Unknown', bgColor: 'bg-gray-100' };
  }
}
