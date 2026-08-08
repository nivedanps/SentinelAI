import React from 'react';
import { DataQualityData } from '../types/analytics.types';
import { ShieldCheck } from 'lucide-react';

interface DataQualityProps {
  data: DataQualityData;
}

export const DataQuality: React.FC<DataQualityProps> = ({ data }) => {
  const verifiedPct = data.reports_received > 0 ? Math.round((data.verified / data.reports_received) * 100) : 0;

  const items = [
    { label: 'Reports Received', value: data.reports_received, color: 'text-blue-400' },
    { label: 'Verified', value: data.verified, color: 'text-emerald-400' },
    { label: 'Unverified', value: data.unverified, color: 'text-amber-400' },
    { label: 'Potential Duplicates', value: data.potential_duplicates, color: 'text-orange-400' },
    { label: 'Conflicting', value: data.conflicting, color: 'text-red-400' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">DATA QUALITY</h3>
            <p className="text-xs text-slate-400">Report verification, duplication & conflict analysis</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-extrabold font-mono text-emerald-400">{verifiedPct}%</div>
          <div className="text-[10px] font-mono text-slate-500">Verified</div>
        </div>
      </div>

      {/* Verification progress bar */}
      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(data.verified / data.reports_received) * 100}%` }} title="Verified" />
        <div className="h-full bg-amber-500 transition-all" style={{ width: `${(data.unverified / data.reports_received) * 100}%` }} title="Unverified" />
        <div className="h-full bg-orange-500 transition-all" style={{ width: `${(data.potential_duplicates / data.reports_received) * 100}%` }} title="Duplicates" />
        <div className="h-full bg-red-500 transition-all" style={{ width: `${(data.conflicting / data.reports_received) * 100}%` }} title="Conflicting" />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {items.map((item) => (
          <div key={item.label} className="text-center p-2 rounded-xl bg-slate-800/40 border border-slate-700/30">
            <div className={`text-lg font-extrabold font-mono ${item.color}`}>{item.value}</div>
            <div className="text-[9px] font-mono font-bold text-slate-500 uppercase leading-tight mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
