import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckCircle, AlertCircle, X } from 'lucide-react';

export interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  type?: 'info' | 'success' | 'warning';
}

export const ToastNotification: React.FC<ToastProps> = ({
  isOpen,
  onClose,
  title = 'System Alert',
  message = 'Epigraphical Dataset is currently active in isolated mode.',
  type = 'info',
}) => {
  const icons = {
    info: <Info className="w-5 h-5 text-white" />,
    success: <CheckCircle className="w-5 h-5 text-zinc-300" />,
    warning: <AlertCircle className="w-5 h-5 text-zinc-400" />,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-zinc-900 border border-zinc-700 rounded-lg p-4 shadow-2xl flex items-start gap-3 text-zinc-100"
        >
          <div className="shrink-0 mt-0.5">{icons[type]}</div>
          <div className="flex-1">
            <h5 className="font-sans font-semibold text-xs text-white">{title}</h5>
            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{message}</p>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white" aria-label="Close notification">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastNotification;
