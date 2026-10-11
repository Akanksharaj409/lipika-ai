import React from 'react';
import { Link } from 'react-router-dom';
import { Scroll, Bell, Database, Menu, CheckCircle, LogOut } from 'lucide-react';
import { InscriptionMetadata } from '../../types/inscription';
import { Badge } from '../ui/Badge';
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
  onOpenNotifications,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-black/90 backdrop-blur-md border-b border-zinc-800/80 px-4 lg:px-6 flex items-center justify-between text-white">
      {/* Brand & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label="Open Mobile Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-white/40 rounded p-1">
          <div className="w-9 h-9 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shadow-md shadow-black font-serif font-bold text-lg group-hover:scale-105 transition-transform">
            𑀮
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg font-medium text-white tracking-tight leading-none">
                LIPIKA<span className="text-zinc-400 font-sans font-bold">.AI</span>
              </span>
              <Badge variant="neutral" size="sm" className="hidden sm:inline-flex bg-zinc-800 text-zinc-300 border-zinc-700">
                Brahmi MVP
              </Badge>
            </div>
            <p className="text-[10px] font-mono text-zinc-400 hidden sm:block">
              Ancient Epigraphy & Neural Translation Workbench
            </p>
          </div>
        </Link>
      </div>

      {/* Center: Inscription Corpus Selector */}
      <div className="hidden md:flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 max-w-md w-full focus-within:ring-2 focus-within:ring-white/40">
        <Database className="w-4 h-4 text-zinc-400 shrink-0" />
        <select
          value={activeId}
          onChange={(e) => onSelectInscription(e.target.value)}
          aria-label="Select Inscription Dataset"
          className="bg-transparent text-xs font-mono text-zinc-200 focus:outline-none w-full cursor-pointer"
        >
          {inscriptions.map((ins) => (
            <option key={ins.id} value={ins.id} className="bg-zinc-900 text-zinc-200">
              {ins.corpusCatalogId}: {ins.title} ({ins.script})
            </option>
          ))}
        </select>
      </div>

      {/* Right Actions: API Status & User Tools */}
      <div className="flex items-center gap-3">
        {/* Connection Status Badge */}
        <Badge
          variant="neutral"
          size="sm"
          icon={<CheckCircle className="w-3 h-3 text-white" />}
          className="hidden sm:inline-flex bg-zinc-900 border-zinc-700 text-zinc-200"
        >
          {isMockMode() ? 'Mock Dataset' : 'FastAPI Connected'}
        </Badge>

        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenNotifications}
          className="relative text-zinc-400 hover:text-white p-2 hover:bg-zinc-900"
          aria-label="System Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white" />
        </Button>

        <Link to="/analyze">
          <Button variant="primary" size="sm" icon={<Scroll className="w-4 h-4" />} className="bg-white text-black hover:bg-zinc-200">
            New Inscription
          </Button>
        </Link>

        {/* Auth / Logout Link */}
        <Link
          to="/auth"
          title="Sign Out / Switch Profile"
          className="p-2 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-900 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
