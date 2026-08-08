import React from 'react';
import { AlertCircle, Flame, Users, Truck, Clock, CheckCircle2, PieChart, ShieldAlert } from 'lucide-react';
import { KpiMetrics } from '../types/analytics.types';

interface AnalyticsKpiGridProps {
  metrics: KpiMetrics;
}

export const AnalyticsKpiGrid: React.FC<AnalyticsKpiGridProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'ACTIVE INCIDENTS',
      value: metrics.active_incidents,
      subtext: 'Operational incidents',
      icon: AlertCircle,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/30',
    },
    {
      title: 'CRITICAL INCIDENTS',
      value: metrics.critical_incidents,
      subtext: 'Immediate action priority',
      icon: Flame,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/30',
    },
    {
      title: 'PEOPLE AFFECTED',
      value: metrics.people_affected.toLocaleString(),
      subtext: 'Estimated in hazard zone',
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/30',
    },
    {
      title: 'RESOURCES DEPLOYED',
      value: metrics.resources_deployed,
      subtext: 'Units active in field',
      icon: Truck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
    },
    {
      title: 'AVG RESPONSE TIME',
      value: `${metrics.avg_response_time_min} min`,
      subtext: 'Submission to dispatch',
      icon: Clock,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/30',
    },
    {
      title: 'AVG RESOLUTION TIME',
      value: metrics.avg_resolution_time_str,
      subtext: 'Verification to closure',
      icon: CheckCircle2,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/30',
    },
    {
      title: 'RESOURCE UTILIZATION',
      value: `${metrics.resource_utilization_pct}%`,
      subtext: 'Active pool capacity',
      icon: PieChart,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30',
    },
    {
      title: 'OVERALL RISK',
      value: metrics.overall_risk,
      subtext: 'District threat index',
      icon: ShieldAlert,
      color: 'text-red-400',
      bg: 'bg-red-950/30 border-red-500/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl border flex flex-col justify-between transition-all hover:scale-[1.01] ${card.bg}`}
          >
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span className="text-[11px] font-mono">{card.title}</span>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className="mt-3">
              <div className={`text-2xl font-extrabold tracking-wide font-mono ${card.color}`}>
                {card.value}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{card.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
