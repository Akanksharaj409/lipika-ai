import React from 'react';
import { Cpu } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Initializing Brahmi Epigraphic Neural Pipeline...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-amber-900/40 border-t-terracotta-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-amber-400">
          <Cpu className="w-6 h-6 animate-pulse" />
        </div>
      </div>
      <div>
        <p className="font-mono text-sm text-amber-200 font-medium tracking-wide">{message}</p>
        <p className="text-xs text-slate-500 font-mono mt-1">Executing OpenCV Binarization & Segment Neural Pass</p>
      </div>
    </div>
  );
};
