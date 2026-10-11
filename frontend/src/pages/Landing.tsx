import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, Cpu, ShieldCheck } from 'lucide-react';
import DyeWhorl from '../components/ui/dye-whorl';

export const Landing: React.FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white select-none">
      {/* Background: WebGL2 Incompressible Fluid Ink Solver */}
      <DyeWhorl className="h-full w-full">
        {/* Subtle radial dark overlay for high text contrast */}
        <div className="relative flex h-full w-full flex-col justify-between p-6 sm:p-10 z-10 bg-radial-[circle_at_center_rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.85)_100%] pointer-events-none">
          
          {/* Top Navigation Bar */}
          <header className="flex items-center justify-between w-full max-w-7xl mx-auto pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center font-serif text-2xl font-bold tracking-tighter text-white shadow-lg shadow-black/50">
                𑀮
              </div>
              <div>
                <span className="font-semibold text-base tracking-wide text-white block">
                  LIPIKA AI
                </span>
                <span className="text-[11px] font-mono tracking-widest text-zinc-400 block -mt-0.5">
                  NEURAL EPIGRAPHY LAB
                </span>
              </div>
            </div>

            <nav className="flex items-center gap-4">
              <Link
                to="/about"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-zinc-900/60"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Documentation
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-xs font-medium tracking-wide text-white hover:bg-zinc-800 hover:border-zinc-500 transition-all shadow-sm"
              >
                Sign In / Access
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </nav>
          </header>

          {/* Central Hero Content */}
          <main className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-4 pointer-events-auto my-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/80 backdrop-blur-md mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300 animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest text-zinc-300 uppercase">
                Brahmi Inscription Recognition & Translation Pipeline
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white mb-5 leading-[1.12]">
              Deciphering Ancient Inscriptions with Neural Vision
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 max-w-xl leading-relaxed mb-8">
              An AI-assisted epigraphical platform combining computer vision, contour segmentation, and deep learning to read, transliterate, and translate ancient Indian Brahmi inscriptions into Hindi and English.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                to="/auth"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 active:scale-[0.98]"
              >
                Launch Research Portal
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/70 backdrop-blur-md px-5 py-3 text-sm font-medium text-zinc-300 hover:text-white hover:border-zinc-600 transition-all active:scale-[0.98]"
              >
                Architecture & Methodology
              </Link>
            </div>

            <p className="mt-8 text-xs font-mono tracking-wider text-zinc-400">
              [ Drag cursor to stir fluid plumes · Click to drop fresh ink beads ]
            </p>
          </main>

          {/* Bottom System Status Bar */}
          <footer className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-900 pointer-events-auto text-[11px] font-mono text-zinc-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                FastAPI Inference: Online
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-zinc-400" />
                OpenCV Contour Engine: v4.x
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-zinc-400" />
                Scholarly Verification: Enabled
              </span>
              <span className="hidden sm:inline">·</span>
              <span>Epigraphy Dataset: 2,400+ Brahmi Glyphs</span>
            </div>
          </footer>

        </div>
      </DyeWhorl>
    </div>
  );
};

export default Landing;
