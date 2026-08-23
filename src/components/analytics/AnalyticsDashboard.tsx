import React from 'react';
import { useBoardStore } from '../../store/useBoardStore';
import { VelocityChart } from './VelocityChart';
import { StatusPieChart } from './StatusPieChart';
import { PriorityBarChart } from './PriorityBarChart';
import { CompletionTrendChart } from './CompletionTrendChart';
import { CheckCircle2, Clock, Flame, AlertCircle, BarChart3 } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { tasks, sprints } = useBoardStore();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const highPriorityTasks = tasks.filter(
    (t) => (t.priority === 'high' || t.priority === 'urgent') && t.status !== 'done'
  ).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          Sprint Analytics & Metrics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time metrics, team velocity, completion trends, and priority breakdowns.
        </p>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completion Rate */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Completion Rate
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {completionRate}%
            </h3>
          </div>
        </div>

        {/* In Progress */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              In Progress
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {inProgressTasks}
            </h3>
          </div>
        </div>

        {/* High Priority Unresolved */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              High / Urgent Open
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {highPriorityTasks}
            </h3>
          </div>
        </div>

        {/* Total Tasks */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Sprint Tasks
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {totalTasks}
            </h3>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Sprint Velocity */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Sprint Velocity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Completed vs total tasks across historical sprints
            </p>
          </div>
          <VelocityChart sprints={sprints} tasks={tasks} />
        </div>

        {/* Chart 2: Task Status Distribution */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Task Status Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Current proportion of tasks across the 4 Kanban columns
            </p>
          </div>
          <StatusPieChart tasks={tasks} />
        </div>

        {/* Chart 3: Priority Breakdown */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Priority Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribution of priority levels per column status
            </p>
          </div>
          <PriorityBarChart tasks={tasks} />
        </div>

        {/* Chart 4: Completion Trend */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Completion Trend
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cumulative completed tasks over time
            </p>
          </div>
          <CompletionTrendChart tasks={tasks} />
        </div>
      </div>
    </div>
  );
};
