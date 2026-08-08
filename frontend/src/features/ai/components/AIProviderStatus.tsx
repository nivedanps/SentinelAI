import React from 'react';
import { Cpu, CheckCircle2, Sparkles, Activity } from 'lucide-react';

interface AIProviderStatusProps {
  status: string;
  providerName: string;
  providerStatus: string;
  lastAnalysisId?: string;
  lastAnalysisTime?: string;
}

export const AIProviderStatus: React.FC<AIProviderStatusProps> = ({
  status = 'READY',
  providerName = 'Mock Engine',
  providerStatus = 'DEMO INTELLIGENCE',
  lastAnalysisId = 'ANL-109482',
  lastAnalysisTime = 'Just now',
}) => {
  const isLive = providerStatus === 'LIVE AI';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
      {/* Engine Status */}
      <div className="flex items-center space-x-3">
        <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 relative">
          <Cpu className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              AI ENGINE STATUS
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              {status}
            </span>
          </div>
          <p className="text-sm font-bold text-white tracking-wide">
            SENTINELAI DISASTER INTELLIGENCE
          </p>
        </div>
      </div>

      {/* Provider & Model status */}
      <div className="flex items-center space-x-6 text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <div>
            <span className="block text-[10px] text-slate-400 font-mono uppercase">
              PROVIDER / MODEL
            </span>
            <span className="font-semibold text-slate-200">{providerName}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <div>
            <span className="block text-[10px] text-slate-400 font-mono uppercase">
              INTELLIGENCE MODE
            </span>
            <span
              className={`font-extrabold font-mono text-[11px] px-2 py-0.5 rounded ${
                isLive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {providerStatus}
            </span>
          </div>
        </div>

        <div className="hidden md:flex flex-col text-right font-mono text-[11px]">
          <span className="text-[10px] text-slate-400">LAST ANALYSIS: {lastAnalysisId}</span>
          <span className="text-slate-300">{lastAnalysisTime}</span>
        </div>
      </div>
    </div>
  );
};
