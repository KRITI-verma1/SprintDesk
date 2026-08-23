import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Sprint, Task } from '../../types';

interface VelocityChartProps {
  sprints: Sprint[];
  tasks: Task[];
}

export const VelocityChart: React.FC<VelocityChartProps> = ({ sprints, tasks }) => {
  const data = sprints.map((sprint) => {
    const sprintTasks = tasks.filter((t) => t.sprintId === sprint.id);
    const completedTasks = sprintTasks.filter((t) => t.status === 'done').length;
    const totalTasks = sprintTasks.length;

    return {
      name: sprint.name,
      completed: completedTasks,
      total: totalTasks,
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
          <Bar dataKey="completed" name="Completed Tasks" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
          <Bar dataKey="total" name="Total Tasks" fill="#64748b" radius={[6, 6, 0, 0]} opacity={0.4} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
