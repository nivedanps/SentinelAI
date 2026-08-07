import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-6"
      >
        <div className="inline-flex p-5 rounded-2xl bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20">
          <ShieldAlert className="w-14 h-14" />
        </div>
        <div>
          <h1 className="text-6xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            404
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">
            Sector not found. This area is outside the operational zone.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Command Center
        </button>
      </motion.div>
    </div>
  );
};
