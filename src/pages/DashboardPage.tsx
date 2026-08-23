import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardStore } from '../store/useBoardStore';
import { DataTable, Column } from '../components/ui/DataTable';
import { Task } from '../types';
import { Button } from '../components/ui/Button';
import {
  Kanban,
  CheckCircle2,
  Clock,
  Flame,
  ArrowRight,
  Calendar,
  Layers,
} from 'lucide-react';
import { clsx } from 'clsx';

export const DashboardPage: React.FC = () => {
  const { tasks, users, setSelectedTaskId } = useBoardStore();
  const navigate = useNavigate();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const backlogTasks = tasks.filter((t) => t.status === 'backlog').length;

  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const userMap = new Map(users.map((u) => [u.id, u]));

  const columns: Column<Task>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      className: 'w-16 font-mono font-bold text-slate-500',
      render: (t) => `#${t.id}`,
    },
    {
      key: 'title',
      header: 'Task Title',
      sortable: true,
      className: 'font-medium',
      render: (t) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{t.title}</p>
          <p className="text-[10px] text-slate-400 truncate max-w-xs">{t.description}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (t) => {
        const badges: Record<string, string> = {
          backlog: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
          'in-progress': 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
          review: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
          done: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
        };
        return (
          <span
            className={clsx(
              'px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider',
              badges[t.status]
            )}
          >
            {t.status}
          </span>
        );
      },
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (t) => {
        const colors: Record<string, string> = {
          low: 'text-emerald-600 dark:text-emerald-400',
          medium: 'text-amber-600 dark:text-amber-400',
          high: 'text-red-600 dark:text-red-400',
          urgent: 'text-purple-600 dark:text-purple-400',
        };
        return (
          <span className={clsx('font-bold text-xs uppercase', colors[t.priority])}>
            ● {t.priority}
          </span>
        );
      },
    },
    {
      key: 'assigneeId',
      header: 'Assignee',
      render: (t) => {
        const u = userMap.get(t.assigneeId);
        if (!u) return <span className="text-slate-400 text-xs">Unassigned</span>;
        return (
          <div className="flex items-center gap-2">
            <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
            <span className="text-xs text-slate-700 dark:text-slate-300 truncate">{u.name}</span>
          </div>
        );
      },
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      className: 'text-slate-500 text-xs',
      render: (t) => t.dueDate || '—',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-700 text-white p-6 sm:p-8 shadow-xl shadow-brand-500/10">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md mb-3">
            <Calendar className="w-3.5 h-3.5" />
            Sprint 3 Active (Aug 17 - Aug 28, 2026)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to SprintDesk
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 mt-1 max-w-xl leading-relaxed">
            Your team is currently on track. You have completed {completedTasks} out of{' '}
            {totalTasks} tasks in this sprint.
          </p>

          {/* Progress Bar */}
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-brand-100">
              <span>Sprint Completion</span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/board')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Open Kanban Board
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white/40 hover:bg-white/10"
              onClick={() => navigate('/analytics')}
            >
              View Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Tasks</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{totalTasks}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Completed</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{completedTasks}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">In Progress</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{inProgressTasks}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">In Backlog</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{backlogTasks}</p>
          </div>
        </div>
      </div>

      {/* Task Summary Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Kanban className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            Sprint Task Catalog
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/board')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Manage on Board
          </Button>
        </div>

        <DataTable
          data={tasks}
          columns={columns}
          pageSize={6}
          searchKey={(t) => `${t.title} ${t.description} ${t.priority}`}
          searchPlaceholder="Filter sprint tasks..."
          onRowClick={(t) => {
            setSelectedTaskId(t.id);
            navigate('/board');
          }}
        />
      </div>
    </div>
  );
};
export default DashboardPage;
