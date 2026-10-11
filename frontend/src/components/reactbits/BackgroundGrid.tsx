import React from 'react';

export const BackgroundGrid: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Ancient Inscribed Basalt Stone Texture (Option 2) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.22] filter contrast-125 brightness-90 mix-blend-screen transition-opacity duration-700"
        style={{ backgroundImage: "url('/bg-brahmi-stone.jpg')" }}
      />

      {/* Dark Vignette and Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/95" />
      <div className="absolute inset-0 bg-radial-vignette from-transparent via-black/40 to-black/90" />

      {/* Subtle Archival Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      {/* Soft Ambient Research Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl" />
      <div className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] bg-zinc-600/[0.04] rounded-full blur-3xl" />
    </div>
  );
};

export default BackgroundGrid;
