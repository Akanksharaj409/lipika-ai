import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutDashboard, ScanLine, FileCheck2, BookOpenCheck, Languages, History, Info, Sparkles } from 'lucide-react';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { label: 'Landing Page', path: '/', icon: <Sparkles className="w-5 h-5" /> },
    { label: 'Research Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Image Scan & Prep', path: '/analyze', icon: <ScanLine className="w-5 h-5" /> },
    { label: 'Brahmi OCR Studio', path: '/results', icon: <FileCheck2 className="w-5 h-5" /> },
    { label: 'Human Verification', path: '/verification', icon: <BookOpenCheck className="w-5 h-5" /> },
    { label: 'Transliteration & Translation', path: '/translation', icon: <Languages className="w-5 h-5" /> },
    { label: 'Archival Catalog', path: '/history', icon: <History className="w-5 h-5" /> },
    { label: 'About Lipika AI', path: '/about', icon: <Info className="w-5 h-5" /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
          />

          {/* Drawer Menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-72 max-w-[80vw] bg-black border-r border-zinc-800 h-full p-6 flex flex-col justify-between z-10 text-white"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white font-serif font-bold text-base">
                    𑀮
                  </div>
                  <span className="font-serif text-lg font-medium text-white">LIPIKA.AI</span>
                </div>
                <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white" aria-label="Close Mobile Navigation">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="mt-6 space-y-1.5">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-3 rounded text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-zinc-900 text-white border-l-4 border-white font-semibold'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                      }`
                    }
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="text-xs font-mono text-zinc-400 text-center">
              Lipika AI • Brahmi Script Lab
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
