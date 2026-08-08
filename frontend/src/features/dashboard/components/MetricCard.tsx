import React from 'react';
import {
  Siren,
  Users,
  Boxes,
  Home,
  UserCheck,
  ShieldAlert,
  TrendingUp,
  LucideIcon,
} from 'lucide-react';
import { DashboardMetric } from '../types/dashboard.types';

const iconMap: Record<string, LucideIcon> = {
  Siren,
  Users,
  Boxes,
  Home,
  UserCheck,
  ShieldAlert,
};

const statusStyles: Record<
  DashboardMetric['status'],
  { border: string; bg: string; iconBg: string; text: string; subBadge: string }
> = {
  critical: {
    border: 'border-red-500/30 hover:border-red-500/50',
    bg: 'bg-slate-900/90 hover:bg-slate-900',
    iconBg: 'bg-red-500/15 text-red-400 border border-red-500/30',
    text: 'text-red-400',
    subBadge: 'bg-red-500/20 text-red-300 border border-red-500/30',
  },
  high: {
    border: 'border-orange-500/30 hover:border-orange-500/50',
    bg: 'bg-slate-900/90 hover:bg-slate-900',
    iconBg: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
    text: 'text-orange-400',
    subBadge: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  },
  warning: {
    border: 'border-amber-500/30 hover:border-amber-500/50',
    bg: 'bg-slate-900/90 hover:bg-slate-900',
    iconBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    text: 'text-amber-400',
    subBadge: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  },
  normal: {
    border: 'border-emerald-500/30 hover:border-emerald-500/50',
    bg: 'bg-slate-900/90 hover:bg-slate-900',
    iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    text: 'text-emerald-400',
    subBadge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  },
  info: {
    border: 'border-blue-500/30 hover:border-blue-500/50',
    bg: 'bg-slate-900/90 hover:bg-slate-900',
    iconBg: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    text: 'text-blue-400',
    subBadge: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  },
};

interface MetricCardProps {
  metric: DashboardMetric;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const IconComponent = iconMap[metric.icon] || Siren;
  const styles = statusStyles[metric.status] || statusStyles.info;

  return (
    <div
      className={`relative p-4 rounded-2xl border ${styles.border} ${styles.bg} transition-all duration-200 shadow-md group flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          {metric.label}
        </span>
        <div className={`p-2 rounded-xl ${styles.iconBg} transition-transform group-hover:scale-105`}>
          <IconComponent className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {metric.value}
        </span>

        {metric.subValue && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${styles.subBadge}`}>
            {metric.trendDirection === 'up' && (
              <TrendingUp className="w-3 h-3 mr-1 inline-block" />
            )}
            {metric.subValue}
          </span>
        )}
      </div>
    </div>
  );
};
