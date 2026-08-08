import React from 'react';
import { ResourceShortageItem } from '../types/analytics.types';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResourceShortagesProps {
  shortages: ResourceShortageItem[];
}

const priorityStyles: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  CRITICAL: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', badge: 'bg-red-500/20 text-red-400 border-red-500/40' },
  HIGH: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/40' },
  MEDIUM: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
  LOW: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
};

export const ResourceShortages: React.FC<ResourceShortagesProps> = ({ shortages }) => {
  const navigate = useNavigate();
  const sorted = [...shortages].sort((a, b) => {
    const order = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    return order.indexOf(a.priority) - order.indexOf(b.priority);
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
        <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider uppercase">RESOURCE SHORTAGES</h3>
          <p className="text-xs text-slate-400">Critical resource gaps requiring immediate procurement or redeployment</p>
        </div>
      </div>

      <div className="space-y-2 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
        {sorted.map((s, idx) => {
          const style = priorityStyles[s.priority] || priorityStyles.MEDIUM;
          const pct = s.required > 0 ? Math.round((s.available / s.required) * 100) : 0;
          return (
            <div key={idx} className={`p-3 rounded-xl border ${style.bg} ${style.border} space-y-2`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${style.badge}`}>{s.priority}</span>
                  <span className="text-xs font-bold text-white">{s.resource_type}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="text-slate-400 font-mono">
                    Available: <span className="text-white font-bold">{s.available}</span> / Required: <span className="text-white font-bold">{s.required}</span>
                  </div>
                  <div className="text-slate-400 font-mono">
                    Shortage: <span className={`font-bold ${style.text}`}>{s.shortage}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-extrabold font-mono ${style.text}`}>{pct}%</div>
                  <div className="text-[10px] text-slate-500">Fulfilled</div>
                </div>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: pct < 40 ? '#ef4444' : pct < 70 ? '#f59e0b' : '#10b981' }} />
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate('/resources')}
        className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold border border-slate-700 transition-colors"
      >
        <span>Open Resource Coordination</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
