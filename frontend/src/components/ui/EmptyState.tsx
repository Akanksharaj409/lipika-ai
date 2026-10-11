import React from 'react';
import { BookOpen, FileQuestion } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Inscription Loaded',
  description = 'Select an authentic Brahmi record from the archival catalog or upload a high-resolution multispectral rubbing to begin digital analysis.',
  actionText = 'Load Sample Inscription',
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-800 rounded-lg bg-slate-900/40 my-6">
      <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-amber-900/40 flex items-center justify-center mb-4 text-amber-400">
        {icon || <FileQuestion className="w-7 h-7 stroke-[1.5]" />}
      </div>
      <h4 className="font-serif text-lg font-medium text-amber-100 mb-2">{title}</h4>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed font-sans">{description}</p>
      {onAction && (
        <Button variant="primary" icon={<BookOpen className="w-4 h-4" />} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
