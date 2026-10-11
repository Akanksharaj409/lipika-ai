import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'terracotta' | 'sandstone' | 'emerald' | 'amber' | 'slate' | 'unicode' | 'neutral' | 'solid' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  icon,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-mono font-medium rounded border uppercase tracking-wider shrink-0 transition-colors';

  const variants = {
    // Monochrome core styles
    neutral: 'bg-zinc-900 text-zinc-300 border-zinc-700',
    solid: 'bg-white text-black border-white font-semibold',
    outline: 'bg-transparent text-zinc-300 border-zinc-700',
    // Mapped legacy keys to keep all existing pages working cleanly in monochrome
    terracotta: 'bg-zinc-900 text-zinc-100 border-zinc-700',
    sandstone: 'bg-zinc-900/60 text-zinc-300 border-zinc-800',
    emerald: 'bg-zinc-900 text-white border-zinc-600',
    amber: 'bg-zinc-900 text-zinc-200 border-zinc-700',
    slate: 'bg-zinc-950 text-zinc-400 border-zinc-800',
    unicode: 'bg-zinc-950 text-white border-zinc-800 font-mono text-xs',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant as keyof typeof variants] || variants.neutral, sizes[size], className))} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
