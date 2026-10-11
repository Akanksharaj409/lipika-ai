import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanLine,
  FileCheck2,
  Languages,
  BookOpenCheck,
  History,
  Info,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Research Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Image Scan & Prep', path: '/analyze', icon: <ScanLine className="w-4 h-4" /> },
    { label: 'Brahmi OCR Studio', path: '/results', icon: <FileCheck2 className="w-4 h-4" /> },
    { label: 'Human Verification', path: '/verification', icon: <BookOpenCheck className="w-4 h-4" /> },
    { label: 'Transliteration & Translation', path: '/translation', icon: <Languages className="w-4 h-4" /> },
    { label: 'Archival Catalog', path: '/history', icon: <History className="w-4 h-4" /> },
    { label: 'About Lipika AI', path: '/about', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-black/80 border-r border-zinc-800/80 shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none p-4 justify-between">
      {/* Primary Navigation Menu */}
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold mb-2">
            Research Workbench
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded text-xs font-sans font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-zinc-900 text-white border-l-2 border-white font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-white' : 'text-zinc-500'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Epigraphical Quick Specs */}
        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-zinc-200 font-mono text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            Target Corpus
          </div>
          <p className="text-[11px] text-zinc-400 leading-snug">
            Ashokan & Early Post-Mauryan Brahmi (c. 3rd–1st Century BCE).
          </p>
          <NavLink
            to="/"
            className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 hover:text-white transition-colors pt-1"
          >
            <span>Landing Page</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </NavLink>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-400 text-center">
        Lipika AI v1.0 • Epigraphy Lab
      </div>
    </aside>
  );
};

export default Sidebar;
