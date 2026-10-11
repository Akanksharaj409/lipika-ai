import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={clsx(
        'glass-card rounded-lg p-5 border border-slate-800 hover:border-terracotta-500/50 hover:shadow-xl hover:shadow-terracotta-900/20 transition-all cursor-pointer relative group overflow-hidden',
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-terracotta-500/0 via-amber-500/5 to-terracotta-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      {children}
    </motion.div>
  );
};
