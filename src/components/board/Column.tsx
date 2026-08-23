import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus, User, Comment } from '../../types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';
import { clsx } from 'clsx';

interface ColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  users: User[];
  comments: Comment[];
  onTaskClick: (taskId: number) => void;
  onAddTask: (status: TaskStatus) => void;
}

const columnConfig: Record<
  TaskStatus,
  { border: string; badge: string; dot: string }
> = {
  backlog: {
    border: 'border-t-slate-400',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    dot: 'bg-slate-400',
  },
  'in-progress': {
    border: 'border-t-blue-500',
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  review: {
    border: 'border-t-amber-500',
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  done: {
    border: 'border-t-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
};

export const Column: React.FC<ColumnProps> = ({
  id,
  title,
  tasks,
  users,
  comments,
  onTaskClick,
  onAddTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'Column',
      status: id,
    },
  });

  const config = columnConfig[id] || columnConfig.backlog;
  const userMap = new Map(users.map((u) => [u.id, u]));

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'flex flex-col min-w-[280px] max-w-sm flex-1 bg-slate-100/70 dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-3.5 transition-colors border-t-4',
        config.border,
        isOver && 'bg-brand-50/50 dark:bg-brand-950/20 ring-2 ring-brand-400/50'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={clsx('w-2 h-2 rounded-full', config.dot)} />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {title}
          </h3>
          <span
            className={clsx(
              'px-2 py-0.5 rounded-full text-[11px] font-bold',
              config.badge
            )}
          >
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(id)}
          aria-label={`Add task to ${title}`}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task List */}
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2.5 flex-1 min-h-[150px] overflow-y-auto">
          {tasks.map((task) => {
            const assignee = userMap.get(task.assigneeId);
            const taskComments = comments.filter((c) => c.taskId === task.id);

            return (
              <TaskCard
                key={task.id}
                task={task}
                assignee={assignee}
                commentCount={taskComments.length}
                onClick={() => onTaskClick(task.id)}
              />
            );
          })}

          {tasks.length === 0 && (
            <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-400">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};
