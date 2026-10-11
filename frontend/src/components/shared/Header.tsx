import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Database, Menu, LogOut, Radio } from 'lucide-react';
import { InscriptionMetadata } from '../../types/inscription';
import { Button } from '../ui/Button';
import { isMockMode } from '../../services/apiClient';

export interface HeaderProps {
  inscriptions: InscriptionMetadata[];
  activeId: string;
  onSelectInscription: (id: string) => void;
  onOpenMobileNav: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  inscriptions,
  activeId,
  onSelectInscription,
  onOpenMobileNav,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-black/90 backdrop-blur-md border-b border-zinc-800/60 px-4 lg:px-6 flex items-center justify-between text-white">
      {/* Brand & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-900 focus:outline-none"
          aria-label="Open Mobile Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/dashboard" className="flex items-center gap-2.5 group rounded">
          <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white font-serif font-bold text-sm">
            𑀮
          </div>
          <span className="font-serif text-base font-medium tracking-tight text-white">
            LIPIKA<span className="text-zinc-500 font-sans font-normal text-xs ml-1">AI</span>
          </span>
        </Link>
      </div>

      {/* Center: Inscription Corpus Selector */}
      <div className="hidden md:flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs max-w-sm w-full">
        <Database className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
        <select
          value={activeId}
          onChange={(e) => onSelectInscription(e.target.value)}
          aria-label="Select Inscription"
          className="bg-transparent text-xs text-zinc-300 focus:outline-none w-full cursor-pointer truncate"
        >
          {inscriptions.map((ins) => (
            <option key={ins.id} value={ins.id} className="bg-zinc-900 text-zinc-200">
              {ins.corpusCatalogId} — {ins.title}
            </option>
          ))}
        </select>
      </div>

      {/* Right Actions: Minimal Status & Action */}
      <div className="flex items-center gap-2.5">
        <div
          title={isMockMode() ? 'Using Local Dataset' : 'Connected to FastAPI Backend'}
          className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono text-zinc-400"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isMockMode() ? 'bg-zinc-500' : 'bg-white animate-pulse'}`} />
          <span>{isMockMode() ? 'Local' : 'Live ML'}</span>
        </div>

        <Link to="/analyze">
          <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} className="h-8 text-xs font-medium">
            New Scan
          </Button>
        </Link>

        {/* Sign Out */}
        <Link
          to="/auth"
          title="Sign Out"
          className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-900 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
