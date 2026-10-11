import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  showLabel?: boolean;
  labelPosition?: 'right' | 'top';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'terracotta' | 'amber' | 'emerald' | 'monochrome' | 'neutral';
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  showLabel = false,
  labelPosition = 'right',
  size = 'md',
  variant = 'monochrome',
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const height = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variants = {
    monochrome: 'bg-white',
    neutral: 'bg-white',
    terracotta: 'bg-white',
    amber: 'bg-zinc-300',
    emerald: 'bg-zinc-100',
  };

  return (
    <div className={twMerge(clsx('w-full', labelPosition === 'top' && 'space-y-1', labelPosition === 'right' && 'flex items-center gap-3', className))}>
      {showLabel && labelPosition === 'top' && (
        <div className="flex justify-between text-xs font-mono text-zinc-400">
          <span>Confidence Ratio</span>
          <span className="text-white font-semibold">{percentage.toFixed(1)}%</span>
        </div>
      )}
      <div className={clsx('w-full bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/50', height[size])}>
        <div
          className={clsx('h-full rounded-full transition-all duration-500 ease-out', variants[variant] || 'bg-white')}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && labelPosition === 'right' && (
        <span className="text-xs font-mono font-semibold text-white shrink-0 min-w-[3.5rem] text-right">
          {percentage.toFixed(1)}%
        </span>
      )}
    </div>
  );
};

export default Progress;
