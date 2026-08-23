import React from 'react';
import { useBoardStore } from '../../store/useBoardStore';
import { Search, X, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export const BoardFilters: React.FC = () => {
  const { filters, setFilters, resetFilters, users, tasks, lastMove, undoLastMove } =
    useBoardStore();

  const hasActiveFilters =
    filters.search !== '' || filters.priority !== 'all' || filters.assigneeId !== 'all';

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Left: Search and Filters */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            placeholder="Search tasks by title or details..."
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ search: '' })}
              aria-label="Clear search"
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Priority Filter */}
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ priority: e.target.value })}
          aria-label="Filter by priority"
          className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
          <option value="urgent">Urgent</option>
        </select>

        {/* Assignee Filter */}
        <select
          value={filters.assigneeId}
          onChange={(e) => setFilters({ assigneeId: e.target.value })}
          aria-label="Filter by assignee"
          className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">All Assignees</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            leftIcon={<X className="w-3.5 h-3.5" />}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Right: Undo last action (Optional Bonus) */}
      {lastMove && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={undoLastMove}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Undo Move
          </Button>
        </div>
      )}
    </div>
  );
};
