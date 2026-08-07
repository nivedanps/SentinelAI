import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface ModuleCardProps {
  moduleName: string;
  endpoint: string;
  icon: React.ElementType;
  description: string;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  moduleName,
  endpoint,
  icon: Icon,
  description,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-slate-950/50 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {moduleName} Module
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {description}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Clock className="w-3.5 h-3.5" />
          Coming Soon
        </span>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          This module is ready for future implementation.
        </p>
      </div>
    </motion.div>
  );
};
