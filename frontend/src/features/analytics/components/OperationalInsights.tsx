import React from 'react';
import { OperationalInsightItem } from '../types/analytics.types';
import { Lightbulb, AlertTriangle, ShieldAlert, Info, CheckCircle2 } from 'lucide-react';

interface OperationalInsightsProps {
  insights: OperationalInsightItem[];
}

const insightStyles: Record<string, { icon: React.ElementType; bg: string; border: string; text: string; iconColor: string }> = {
  ALERT: { icon: ShieldAlert, bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', iconColor: 'text-red-400' },
  WARNING: { icon: AlertTriangle, bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', iconColor: 'text-amber-400' },
  INFO: { icon: Info, bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', iconColor: 'text-blue-400' },
  STABLE: { icon: CheckCircle2, bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', iconColor: 'text-emerald-400' },
};

export const OperationalInsights: React.FC<OperationalInsightsProps> = ({ insights }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
        <div className="p-2 rounded-xl bg-yellow-600/20 text-yellow-400 border border-yellow-500/30">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider uppercase">OPERATIONAL INSIGHTS</h3>
          <p className="text-xs text-slate-400">Synthesized intelligence from multi-source analysis</p>
        </div>
      </div>

      <div className="space-y-2">
        {insights.map((insight) => {
          const style = insightStyles[insight.type] || insightStyles.INFO;
          const Icon = style.icon;
          return (
            <div key={insight.id} className={`p-3 rounded-xl border ${style.bg} ${style.border} flex items-start space-x-3`}>
              <div className={`mt-0.5 ${style.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className={`text-xs font-bold uppercase tracking-wide ${style.text}`}>{insight.title}</h4>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${style.bg} ${style.border} ${style.text}`}>{insight.type}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{insight.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
