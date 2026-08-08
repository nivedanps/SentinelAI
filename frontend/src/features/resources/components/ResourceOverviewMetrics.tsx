import React from 'react';
import { Boxes, CheckCircle2, Navigation, Clock, AlertOctagon, XCircle, AlertTriangle } from 'lucide-react';
import { ResourceOverviewMetrics } from '../types/resource.types';

interface ResourceOverviewMetricsProps {
  metrics: ResourceOverviewMetrics;
}

export const ResourceOverviewMetricsComponent: React.FC<ResourceOverviewMetricsProps> = ({
  metrics,
}) => {
  const cards = [
    {
      label: 'TOTAL RESOURCES',
      value: metrics.total,
      sub: 'Registry Units',
      icon: Boxes,
      border: 'border-blue-500/30',
      iconBg: 'bg-blue-500/20 text-blue-400',
      valueColor: 'text-white',
    },
    {
      label: 'AVAILABLE',
      value: metrics.available,
      sub: 'Ready for Dispatch',
      icon: CheckCircle2,
      border: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      valueColor: 'text-emerald-400',
    },
    {
      label: 'DEPLOYED',
      value: metrics.deployed,
      sub: `${metrics.deploymentPercentage}% Deployed`,
      icon: Navigation,
      border: 'border-blue-500/30',
      iconBg: 'bg-blue-500/20 text-blue-400',
      valueColor: 'text-blue-400',
    },
    {
      label: 'RESERVED',
      value: metrics.reserved,
      sub: 'Standby Reserve',
      icon: Clock,
      border: 'border-amber-500/30',
      iconBg: 'bg-amber-500/20 text-amber-400',
      valueColor: 'text-amber-400',
    },
    {
      label: 'MAINTENANCE',
      value: metrics.maintenance,
      sub: 'Servicing & Repair',
      icon: AlertOctagon,
      border: 'border-orange-500/30',
      iconBg: 'bg-orange-500/20 text-orange-400',
      valueColor: 'text-orange-400',
    },
    {
      label: 'UNAVAILABLE',
      value: metrics.unavailable,
      sub: 'Out of Service',
      icon: XCircle,
      border: 'border-red-500/30',
      iconBg: 'bg-red-500/20 text-red-400',
      valueColor: 'text-red-400',
    },
    {
      label: 'CRITICAL SHORTAGE',
      value: metrics.criticalShortages,
      sub: 'Active Incident Gaps',
      icon: AlertTriangle,
      border: 'border-rose-500/40 bg-rose-950/20',
      iconBg: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      valueColor: 'text-rose-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className={`p-3.5 rounded-2xl bg-slate-900 border ${c.border} shadow-md flex flex-col justify-between`}
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {c.label}
              </span>
              <div className={`p-1.5 rounded-lg ${c.iconBg}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2">
              <div className={`text-2xl font-extrabold tracking-tight ${c.valueColor}`}>
                {c.value}
              </div>
              <div className="text-[10px] font-medium text-slate-400 mt-0.5">{c.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
