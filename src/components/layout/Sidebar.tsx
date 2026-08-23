import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Kanban, BarChart3, Clock } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Kanban Board', to: '/board', icon: Kanban },
  { name: 'Analytics', to: '/analytics', icon: BarChart3 },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-full md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 flex md:flex-col justify-between">
      <div className="w-full">
        <div className="hidden md:block px-3 mb-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Sprint Workspace
          </p>
        </div>

        <nav className="flex md:flex-col gap-1 w-full overflow-x-auto md:overflow-visible">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 whitespace-nowrap',
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Active Sprint Badge */}
      <div className="hidden md:block p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 mb-1">
          <Clock className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span className="text-xs font-bold">Active Sprint: Sprint 3</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Aug 17 – Aug 28, 2026
        </p>
      </div>
    </aside>
  );
};
