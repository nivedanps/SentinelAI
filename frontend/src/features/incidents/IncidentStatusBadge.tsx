import React from 'react';

import { formatLabel } from './utils';

export const IncidentStatusBadge: React.FC<{ value: string }> = ({ value }) => {
  const colors: Record<string, string> = {
    reported: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', under_review: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300', verified: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300', in_progress: 'bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-300', resolved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300', closed: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300', critical: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300', high: 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300',
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${colors[value] ?? colors.reported}`}>{formatLabel(value)}</span>;
};
