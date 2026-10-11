import React from 'react';

export const BackgroundGrid: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Archival Grid Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Ambient Monochrome Research Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-zinc-700/[0.06] rounded-full blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 w-[28rem] h-[28rem] bg-zinc-800/15 rounded-full blur-3xl" />
    </div>
  );
};
