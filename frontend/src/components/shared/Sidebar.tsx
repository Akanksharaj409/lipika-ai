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
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Scan & Analyze', path: '/analyze', icon: <ScanLine className="w-4 h-4" /> },
    { label: 'OCR Studio', path: '/results', icon: <FileCheck2 className="w-4 h-4" /> },
    { label: 'Human Verification', path: '/verification', icon: <BookOpenCheck className="w-4 h-4" /> },
    { label: 'Translation & IAST', path: '/translation', icon: <Languages className="w-4 h-4" /> },
    { label: 'Corpus History', path: '/history', icon: <History className="w-4 h-4" /> },
    { label: 'About', path: '/about', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-56 bg-black border-r border-zinc-800/60 shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 select-none p-3 justify-between">
      {/* Primary Navigation Menu */}
      <div className="space-y-4">
        <p className="px-2.5 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-medium">
          Workspace
        </p>
        <nav className="space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded text-xs transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-white font-medium'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-white' : 'text-zinc-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-2 border-t border-zinc-900 text-[10px] font-mono text-zinc-600 text-center">
        Brahmi Corpus v1.0
      </div>
    </aside>
  );
};

export default Sidebar;
