import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Task } from '../../types';

interface CompletionTrendChartProps {
  tasks: Task[];
}

export const CompletionTrendChart: React.FC<CompletionTrendChartProps> = ({ tasks }) => {
  // Extract completed tasks with dates
  const completedTasks = tasks
    .filter((t) => t.status === 'done' && t.completedAt)
    .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime());

  // Aggregate cumulative completions by date
  const dateMap = new Map<string, number>();

  // Default dates if empty
  const dates = ['2026-08-15', '2026-08-16', '2026-08-17', '2026-08-18', '2026-08-19', '2026-08-20', '2026-08-21', '2026-08-22'];
  dates.forEach((d) => dateMap.set(d, 0));

  completedTasks.forEach((t) => {
    const dateStr = t.completedAt!.split('T')[0];
    dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
  });

  let cumulative = 0;
  const data = Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => {
      cumulative += count;
      const formattedDate = new Date(date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
      return {
        date: formattedDate,
        daily: count,
        cumulative,
      };
    });

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="completionGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'currentColor' }}
            stroke="rgba(148, 163, 184, 0.5)"
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'currentColor' }}
            stroke="rgba(148, 163, 184, 0.5)"
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              borderColor: 'rgba(51, 65, 85, 0.8)',
              borderRadius: '0.75rem',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="cumulative"
            name="Cumulative Done"
            stroke="#0ea5e9"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#completionGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
