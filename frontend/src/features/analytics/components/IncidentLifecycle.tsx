import React from 'react';
import { LifecycleStageItem } from '../types/analytics.types';
import { GitBranch } from 'lucide-react';

interface IncidentLifecycleProps {
  stages: LifecycleStageItem[];
}

const stageColors = [
  { bg: 'bg-slate-500', text: 'text-slate-400' },
  { bg: 'bg-blue-500', text: 'text-blue-400' },
  { bg: 'bg-cyan-500', text: 'text-cyan-400' },
  { bg: 'bg-amber-500', text: 'text-amber-400' },
  { bg: 'bg-emerald-500', text: 'text-emerald-400' },
  { bg: 'bg-purple-500', text: 'text-purple-400' },
];

export const IncidentLifecycle: React.FC<IncidentLifecycleProps> = ({ stages }) => {
  const maxValue = Math.max(...stages.map((s) => s.count), 1);
  const totalReported = stages.length > 0 ? stages[0].count : 0;
  const totalResolved = stages.find((s) => s.stage.toLowerCase().includes('resolved'))?.count || 0;
  const completionRate = totalReported > 0 ? Math.round((totalResolved / totalReported) * 100) : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
        <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
          <GitBranch className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider uppercase">INCIDENT LIFECYCLE FUNNEL</h3>
          <p className="text-xs text-slate-400">Pipeline stages from report submission through resolution</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 px-2 py-2">
        {stages.map((stage, i) => {
          const color = stageColors[i % stageColors.length];
          const widthPct = Math.max(20, (stage.count / maxValue) * 100);
          return (
            <React.Fragment key={stage.stage}>
              <div className="flex flex-col items-center space-y-1 min-w-0 flex-1">
                {/* Bar */}
                <div className="w-full flex justify-center">
                  <div
                    className={`h-16 rounded-lg ${color.bg} transition-all relative cursor-default`}
                    style={{ width: `${widthPct}%`, minWidth: '24px' }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-white font-extrabold font-mono text-sm">
                      {stage.count}
                    </div>
                  </div>
                </div>
                {/* Label */}
                <span className="text-[10px] font-mono text-slate-400 text-center leading-tight uppercase tracking-wide">
                  {stage.stage}
                </span>
              </div>
              {i < stages.length - 1 && (
                <div className="text-slate-600 font-bold text-lg pb-6">→</div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800">
        <div className="text-center">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Total Reported</div>
          <div className="text-sm font-extrabold font-mono text-blue-400 mt-0.5">{totalReported}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Resolved</div>
          <div className="text-sm font-extrabold font-mono text-emerald-400 mt-0.5">{totalResolved}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Completion Rate</div>
          <div className="text-sm font-extrabold font-mono text-amber-400 mt-0.5">{completionRate}%</div>
        </div>
      </div>
    </div>
  );
};
