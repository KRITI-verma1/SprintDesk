import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, User } from '../../types';
import { Calendar, GripVertical, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';

interface TaskCardProps {
  task: Task;
  assignee?: User;
  commentCount?: number;
  onClick: () => void;
  isOverlay?: boolean;
}

const priorityConfig = {
  low: {
    bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80',
    label: 'Low',
  },
  medium: {
    bg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/80',
    label: 'Medium',
  },
  high: {
    bg: 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800/80',
    label: 'High',
  },
  urgent: {
    bg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/80',
    label: 'Urgent',
  },
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  assignee,
  commentCount = 0,
  onClick,
  isOverlay = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityStyle = priorityConfig[task.priority] || priorityConfig.medium;

  const isPastDue =
    task.dueDate &&
    task.status !== 'done' &&
    new Date(task.dueDate) < new Date(new Date().toDateString());

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'group relative bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200/90 dark:border-slate-800 shadow-subtle hover:shadow-card-hover transition-all duration-150 cursor-pointer',
        isDragging && 'opacity-30 ring-2 ring-brand-500 scale-[0.98]',
        isOverlay && 'shadow-2xl ring-2 ring-brand-500 rotate-1 cursor-grabbing'
      )}
      onClick={onClick}
    >
      {/* Top Header: Priority Badge & Drag Handle */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={clsx(
            'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border',
            priorityStyle.bg
          )}
        >
          {priorityStyle.label}
        </span>

        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag task"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-grab active:cursor-grabbing transition-colors"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Title */}
      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
        {task.title}
      </h4>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Card Footer: Due Date, Comments count, Assignee Avatar */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          {task.dueDate && (
            <span
              className={clsx(
                'flex items-center gap-1 font-medium',
                isPastDue && 'text-red-600 dark:text-red-400 font-bold'
              )}
            >
              <Calendar className="w-3 h-3" />
              {task.dueDate}
            </span>
          )}

          {commentCount > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {commentCount}
            </span>
          )}
        </div>

        {/* Assignee */}
        {assignee ? (
          <div className="flex items-center gap-1.5" title={assignee.name}>
            <img
              src={assignee.avatar}
              alt={assignee.name}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
          </div>
        ) : (
          <span className="text-[10px] text-slate-400 italic">Unassigned</span>
        )}
      </div>
    </div>
  );
};
