import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rounded',
  width,
  height,
  style,
  ...props
}) => {
  const variantStyles = {
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
    circular: 'rounded-full',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'animate-pulse bg-slate-200 dark:bg-slate-800',
          variantStyles[variant],
          className
        )
      )}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-12" />
    </div>
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-2/3" />
    <div className="pt-2 flex justify-between items-center">
      <Skeleton variant="circular" className="h-6 w-6" />
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
);

export const BoardSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-6 rounded-full" />
        </div>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    ))}
  </div>
);
