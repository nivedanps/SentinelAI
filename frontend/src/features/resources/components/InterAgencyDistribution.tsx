import React from 'react';
import { Building2, Shield } from 'lucide-react';
import { AgencyDistributionItem } from '../types/resource.types';

interface InterAgencyDistributionProps {
  agencies: AgencyDistributionItem[];
}

export const InterAgencyDistribution: React.FC<InterAgencyDistributionProps> = ({ agencies }) => {
  return (
    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase">
              INTER-AGENCY RESOURCE COORDINATION
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Multi-Organization Asset Distribution
            </span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
          7 Agencies
        </span>
      </div>

      {/* Agency Items */}
      <div className="space-y-2.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
        {agencies.map((agency) => {
          const availPercent = Math.round((agency.available / agency.total) * 100);
          const depPercent = Math.round((agency.deployed / agency.total) * 100);

          return (
            <div
              key={agency.agency}
              className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-purple-400" />
                  {agency.agency}
                </span>
                <span className="font-mono text-slate-400 text-[11px]">
                  <strong className="text-white">{agency.total}</strong> total units
                </span>
              </div>

              {/* Multi-color progress bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${availPercent}%` }}
                  title={`${agency.available} Available`}
                />
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${depPercent}%` }}
                  title={`${agency.deployed} Deployed`}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
                <span className="text-emerald-400 font-semibold">
                  {agency.available} Available ({availPercent}%)
                </span>
                <span className="text-blue-400 font-semibold">
                  {agency.deployed} Deployed ({depPercent}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
