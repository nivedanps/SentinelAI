import React from 'react';
import { Bot, RefreshCw, AlertTriangle, ShieldCheck, CheckCircle } from 'lucide-react';
import { AISituationIntelligenceData } from '../types/dashboard.types';
import { mockAISituationIntelligence } from '../data/dashboardMockData';

interface SituationIntelligenceProps {
  data?: AISituationIntelligenceData;
  onGenerateReport?: () => void;
  isGenerating?: boolean;
}

export const SituationIntelligence: React.FC<SituationIntelligenceProps> = ({
  data = mockAISituationIntelligence,
  onGenerateReport,
  isGenerating = false,
}) => {
  return (
    <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
      {/* Decorative subtle background gradient */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wider uppercase">
                AI SITUATION INTELLIGENCE
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                Disaster Fusion Model • Updated {data.lastGenerated}
              </span>
            </div>
          </div>

          <button
            onClick={onGenerateReport}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Analyzing...' : 'Generate Report'}</span>
          </button>
        </div>

        {/* Current Situation Box */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed font-normal">
          <div className="font-bold text-slate-200 uppercase text-[10px] tracking-wider mb-1 text-blue-400">
            CURRENT SITUATION
          </div>
          &ldquo;{data.summary}&rdquo;
        </div>

        {/* Risk & Confidence Badges */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                RISK LEVEL
              </span>
              <span className="text-sm font-extrabold text-orange-400 tracking-wide">
                {data.riskLevel}
              </span>
            </div>
            <AlertTriangle className="w-5 h-5 text-orange-400 opacity-80" />
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                CONFIDENCE
              </span>
              <span className="text-sm font-extrabold text-emerald-400 tracking-wide">
                {data.confidence}%
              </span>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-400 opacity-80" />
          </div>
        </div>

        {/* Immediate Priorities */}
        <div className="mt-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            IMMEDIATE PRIORITIES
          </h4>
          <ol className="space-y-2">
            {data.immediatePriorities.map((priority: string, index: number) => (
              <li
                key={index}
                className="flex items-start space-x-2 text-xs text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80"
              >
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 font-mono text-[10px] font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="leading-snug">{priority}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};
