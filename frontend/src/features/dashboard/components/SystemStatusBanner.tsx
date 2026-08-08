import React from 'react';
import { Activity, CheckCircle2 } from 'lucide-react';

interface SystemStatusBannerProps {
  status?: string;
  message?: string;
  lastUpdated?: string;
}

export const SystemStatusBanner: React.FC<SystemStatusBannerProps> = ({
  status = 'OPERATIONAL',
  message = 'Emergency response network operational',
  lastUpdated = 'Live',
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:px-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 text-slate-100 shadow-sm backdrop-blur-md">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              System Status
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wide bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              {status}
            </span>
          </div>
          <p className="text-xs text-slate-300 font-medium mt-0.5">{message}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 self-end sm:self-auto bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
        <Activity className="w-3.5 h-3.5 text-emerald-400" />
        <span>Last updated:</span>
        <span className="text-emerald-400 font-semibold">{lastUpdated}</span>
        <span className="relative flex h-2 w-2 ml-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>
    </div>
  );
};
