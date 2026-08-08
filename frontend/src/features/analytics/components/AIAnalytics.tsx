import React from 'react';
import { AIAnalyticsData } from '../types/analytics.types';
import { Brain, ThumbsUp, ThumbsDown } from 'lucide-react';

interface AIAnalyticsProps {
  data: AIAnalyticsData;
}

export const AIAnalytics: React.FC<AIAnalyticsProps> = ({ data }) => {
  const approvalRate = data.human_approved + data.human_rejected > 0
    ? Math.round((data.human_approved / (data.human_approved + data.human_rejected)) * 100)
    : 0;

  const cards = [
    { label: 'Analyses Performed', value: data.analyses_performed, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
    { label: 'Avg Confidence', value: `${data.avg_confidence_pct}%`, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
    { label: 'High Risk Identified', value: data.high_risk_identified, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
    { label: 'Recommendations', value: data.recommendations_generated, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
        <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider uppercase">AI ENGINE ANALYTICS</h3>
          <p className="text-xs text-slate-400">Intelligence engine performance & human decision audit</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c, i) => (
          <div key={i} className={`p-3 rounded-xl border ${c.bg}`}>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">{c.label}</div>
            <div className={`text-lg font-extrabold font-mono mt-1 ${c.color}`}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Human Decision Bar */}
      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-semibold">Human Decision Audit</span>
          <span className="text-slate-400 font-mono">Approval Rate: <span className="text-emerald-400 font-bold">{approvalRate}%</span></span>
        </div>
        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden flex">
          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${approvalRate}%` }} />
          <div className="h-full bg-red-500 transition-all" style={{ width: `${100 - approvalRate}%` }} />
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center space-x-1 text-emerald-400">
            <ThumbsUp className="w-3 h-3" />
            <span className="font-mono font-bold">{data.human_approved} Approved</span>
          </div>
          <div className="flex items-center space-x-1 text-red-400">
            <ThumbsDown className="w-3 h-3" />
            <span className="font-mono font-bold">{data.human_rejected} Rejected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
