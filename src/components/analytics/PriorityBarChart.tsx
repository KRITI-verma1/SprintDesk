import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Task } from '../../types';

interface PriorityBarChartProps {
  tasks: Task[];
}

export const PriorityBarChart: React.FC<PriorityBarChartProps> = ({ tasks }) => {
  const columns = [
    { key: 'backlog', label: 'Backlog' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'review', label: 'Review' },
    { key: 'done', label: 'Done' },
  ];

  const data = columns.map((col) => {
    const colTasks = tasks.filter((t) => t.status === col.key);
    return {
      name: col.label,
      Low: colTasks.filter((t) => t.priority === 'low').length,
      Medium: colTasks.filter((t) => t.priority === 'medium').length,
      High: colTasks.filter((t) => t.priority === 'high').length,
      Urgent: colTasks.filter((t) => t.priority === 'urgent').length,
    };
  });

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
          <XAxis
            dataKey="name"
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
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(val) => <span className="text-xs text-slate-600 dark:text-slate-400">{val}</span>}
          />
          <Bar dataKey="Low" stackId="a" fill="#10b981" />
          <Bar dataKey="Medium" stackId="a" fill="#f59e0b" />
          <Bar dataKey="High" stackId="a" fill="#ef4444" />
          <Bar dataKey="Urgent" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
