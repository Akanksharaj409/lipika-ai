import React from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { ConfidenceLevel } from '../../types/inscription';

export interface ConfidenceBadgeProps {
  confidence: number; // 0 - 100
  showValue?: boolean;
  size?: 'sm' | 'md';
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  showValue = true,
  size = 'md',
}) => {
  let level: ConfidenceLevel = 'high';
  if (confidence < 75) level = 'conjectural';
  else if (confidence < 90) level = 'doubtful';

  const styles = {
    high: {
      bg: 'bg-zinc-900 text-zinc-100 border-zinc-600 shadow-sm',
      label: 'Validated',
      icon: <CheckCircle2 className="w-3 h-3 text-white" />,
    },
    doubtful: {
      bg: 'bg-zinc-900/80 text-zinc-300 border-zinc-700',
      label: 'Doubtful',
      icon: <AlertTriangle className="w-3 h-3 text-zinc-400" />,
    },
    conjectural: {
      bg: 'bg-black text-zinc-400 border-zinc-800 border-dashed',
      label: 'Conjectural',
      icon: <HelpCircle className="w-3 h-3 text-zinc-500" />,
    },
  };

  const current = styles[level];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-mono rounded border uppercase tracking-wider font-semibold',
        current.bg,
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1'
      )}
    >
      {current.icon}
      <span>{current.label}</span>
      {showValue && <span className="opacity-80">({confidence.toFixed(1)}%)</span>}
    </span>
  );
};
