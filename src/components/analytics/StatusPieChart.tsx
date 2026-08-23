import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Task } from '../../types';

interface StatusPieChartProps {
  tasks: Task[];
}

const COLORS = ['#94a3b8', '#3b82f6', '#f59e0b', '#10b981'];

export const StatusPieChart: React.FC<StatusPieChartProps> = ({ tasks }) => {
  const data = [
    { name: 'Backlog', value: tasks.filter((t) => t.status === 'backlog').length },
    { name: 'In Progress', value: tasks.filter((t) => t.status === 'in-progress').length },
    { name: 'Review', value: tasks.filter((t) => t.status === 'review').length },
    { name: 'Done', value: tasks.filter((t) => t.status === 'done').length },
  ].filter((item) => item.value > 0);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
            nameKey="name"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
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
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
