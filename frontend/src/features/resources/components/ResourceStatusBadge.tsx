import React from 'react';
import { ResourceStatus } from '../types/resource.types';

interface ResourceStatusBadgeProps {
  status: ResourceStatus | string;
  size?: 'sm' | 'md';
}

export const ResourceStatusBadge: React.FC<ResourceStatusBadgeProps> = ({
  status,
  size = 'sm',
}) => {
  const getBadgeStyle = (st: string) => {
    switch (st.toUpperCase()) {
      case 'AVAILABLE':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'DEPLOYED':
      case 'DISPATCHED':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'RESERVED':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MAINTENANCE':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'UNAVAILABLE':
      case 'DEPLETED':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'LOST':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  const pad = size === 'md' ? 'px-3 py-1 text-xs' : 'px-2 py-0.5 text-[10px]';

  return (
    <span
      className={`inline-flex items-center font-mono font-bold tracking-wider uppercase rounded-full border ${getBadgeStyle(
        status
      )} ${pad}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {status}
    </span>
  );
};
