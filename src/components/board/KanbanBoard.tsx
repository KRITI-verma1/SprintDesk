import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useBoardStore } from '../../store/useBoardStore';
import { useToast } from '../../hooks/useToast';
import { Task, TaskStatus } from '../../types';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { BoardFilters } from './BoardFilters';
import { TaskDrawer } from './TaskDrawer';
import { TaskModal } from './TaskModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'In Review' },
  { id: 'done', title: 'Completed' },
];

export const KanbanBoard: React.FC = () => {
  const {
    tasks,
    users,
    comments,
    filters,
    moveTask,
    deleteTask,
    setSelectedTaskId,
  } = useBoardStore();

  const { toast } = useToast();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalInitialStatus, setModalInitialStatus] = useState<TaskStatus>('backlog');
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

  // Configure Sensors (Pointer + Keyboard accessibility)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required to trigger drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter tasks based on search, priority, assignee
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search match
      if (filters.search.trim()) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(searchLower);
        const matchesDesc = task.description?.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Priority match
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }

      // Assignee match
      if (filters.assigneeId !== 'all' && task.assigneeId !== Number(filters.assigneeId)) {
        return false;
      }

      return true;
    });
  }, [tasks, filters]);

  // Group tasks by status
  const tasksByColumn = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      backlog: [],
      'in-progress': [],
      review: [],
      done: [],
    };

    filteredTasks.forEach((task) => {
      if (map[task.status]) {
        map[task.status].push(task);
      }
    });

    // Sort by order ascending
    (Object.keys(map) as TaskStatus[]).forEach((status) => {
      map[status].sort((a, b) => a.order - b.order);
    });

    return map;
  }, [filteredTasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === Number(active.id));
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = Number(active.id);
    const overId = over.id;

    if (activeId === overId) return;

    const activeTaskItem = tasks.find((t) => t.id === activeId);
    if (!activeTaskItem) return;

    // Check if dragging over a Column container
    const isOverColumn = COLUMNS.some((col) => col.id === overId);
    if (isOverColumn) {
      const newStatus = overId as TaskStatus;
      if (activeTaskItem.status !== newStatus) {
        moveTask(activeId, newStatus);
      }
      return;
    }

    // Dragging over another Task
    const overTaskItem = tasks.find((t) => t.id === Number(overId));
    if (overTaskItem && activeTaskItem.status !== overTaskItem.status) {
      moveTask(activeId, overTaskItem.status, overTaskItem.order - 1);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = Number(active.id);
    const overId = over.id;

    const activeTaskItem = tasks.find((t) => t.id === activeId);
    if (!activeTaskItem) return;

    // Dropped on column
    const isOverColumn = COLUMNS.some((col) => col.id === overId);
    if (isOverColumn) {
      const newStatus = overId as TaskStatus;
      if (activeTaskItem.status !== newStatus) {
        moveTask(activeId, newStatus);
        toast.info(`Task moved to ${newStatus}`);
      }
      return;
    }

    // Dropped on another task
    const overTaskItem = tasks.find((t) => t.id === Number(overId));
    if (overTaskItem) {
      const targetIndex = overTaskItem.order - 1;
      moveTask(activeId, overTaskItem.status, targetIndex);
    }
  };

  const handleOpenAddModal = (status: TaskStatus = 'backlog') => {
    setModalInitialStatus(status);
    setIsAddModalOpen(true);
  };

  const taskToDelete = tasks.find((t) => t.id === deletingTaskId);

  const userMap = new Map(users.map((u) => [u.id, u]));

  return (
    <div className="space-y-5">
      {/* Board Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Sprint 3 Kanban Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage sprint tasks, reorder cards, update progress, and collaborate.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => handleOpenAddModal('backlog')}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Task
        </Button>
      </div>

      {/* Filter Toolbar */}
      <BoardFilters />

      {/* Kanban Board Columns Container */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 items-start min-h-[550px]">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={tasksByColumn[col.id]}
              users={users}
              comments={comments}
              onTaskClick={(id) => setSelectedTaskId(id)}
              onAddTask={(status) => handleOpenAddModal(status)}
            />
          ))}
        </div>

        {/* Drag Overlay for smooth preview */}
        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              assignee={userMap.get(activeTask.assigneeId)}
              commentCount={comments.filter((c) => c.taskId === activeTask.id).length}
              onClick={() => {}}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Drawer */}
      <TaskDrawer onDeleteRequest={(id) => setDeletingTaskId(id)} />

      {/* Add Task Modal */}
      <TaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultStatus={modalInitialStatus}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deletingTaskId !== null}
        onClose={() => setDeletingTaskId(null)}
        taskTitle={taskToDelete?.title}
        onConfirm={() => {
          if (deletingTaskId !== null) {
            deleteTask(deletingTaskId);
            toast.success('Task deleted successfully');
          }
        }}
      />
    </div>
  );
};
