import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'archival' | 'glass' | 'interactive';
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  header,
  footer,
  className,
  ...props
}) => {
  const baseStyles = 'rounded-lg border p-4 transition-all duration-200';

  const variants = {
    default: 'bg-zinc-900/90 backdrop-blur-md border-zinc-800/80 text-zinc-100 shadow-lg',
    archival: 'bg-zinc-950/85 backdrop-blur-md border-zinc-800/80 text-white shadow-xl relative overflow-hidden',
    glass: 'glass-card text-zinc-100',
    interactive: 'glass-card glass-card-hover text-zinc-100 cursor-pointer hover:-translate-y-0.5',
  };

  return (
    <div className={twMerge(clsx(baseStyles, variants[variant], className))} {...props}>
      {variant === 'archival' && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/[0.04] to-transparent pointer-events-none" />
      )}
      {header && <div className="border-b border-zinc-800/80 pb-3 mb-3">{header}</div>}
      <div className="relative z-10">{children}</div>
      {footer && <div className="border-t border-zinc-800/80 pt-3 mt-4">{footer}</div>}
    </div>
  );
};

export default Card;
