import React from 'react';
import { AnomalyItem } from '../types/analytics.types';
import { Zap } from 'lucide-react';

interface AnomalyPanelProps {
  anomalies: AnomalyItem[];
}

const severityStyles: Record<string, { dot: string; text: string; bg: string; border: string }> = {
  HIGH: { dot: 'bg-red-500', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  MEDIUM: { dot: 'bg-amber-500', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  LOW: { dot: 'bg-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
};

export const AnomalyPanel: React.FC<AnomalyPanelProps> = ({ anomalies }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
        <div className="p-2 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider uppercase">ANOMALY DETECTION</h3>
          <p className="text-xs text-slate-400">Statistical early-warning alerts from operational baselines</p>
        </div>
      </div>

      <div className="space-y-2">
        {anomalies.map((anom) => {
          const style = severityStyles[anom.severity] || severityStyles.MEDIUM;
          return (
            <div key={anom.id} className={`p-3 rounded-xl border ${style.bg} ${style.border} flex items-start space-x-3`}>
              <div className="mt-1.5 flex-shrink-0">
                <div className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase ${style.text}`}>{anom.severity}</span>
                  <span className="text-[10px] font-mono text-slate-500">{anom.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{anom.message}</p>
              </div>
            </div>
          );
        })}
        {anomalies.length === 0 && (
          <div className="text-xs text-slate-500 text-center py-4 font-mono">No anomalies detected within current baseline.</div>
        )}
      </div>
    </div>
  );
};
