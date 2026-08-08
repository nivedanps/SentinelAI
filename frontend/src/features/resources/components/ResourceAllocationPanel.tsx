import React from 'react';
import { Layers, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ResourceAllocationItem } from '../types/resource.types';

interface ResourceAllocationPanelProps {
  allocations: ResourceAllocationItem[];
}

export const ResourceAllocationPanel: React.FC<ResourceAllocationPanelProps> = ({
  allocations,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">
              RESOURCE ALLOCATION MATRIX
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Incident Requirement vs Deployment vs Missing Units
            </span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          Active Disaster Matrix
        </span>
      </div>

      {/* Allocations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {allocations.map((alloc) => (
          <div
            key={alloc.incidentId}
            className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 text-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-blue-400">{alloc.incidentId}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    alloc.severity === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-300 border-red-500/40'
                      : 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                  }`}
                >
                  {alloc.severity}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1 leading-tight">
                {alloc.incidentTitle}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{alloc.location}</p>
            </div>

            {/* Demands Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Required Asset Breakdown
              </span>
              {alloc.demands.map((demand) => (
                <div
                  key={demand.category}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px]"
                >
                  <span className="font-semibold text-slate-200">{demand.category}</span>
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="text-slate-400">
                      Req: <strong className="text-white">{demand.required}</strong>
                    </span>
                    <span className="text-emerald-400">
                      Avail: <strong>{demand.available}</strong>
                    </span>
                    {demand.missing > 0 ? (
                      <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/40">
                        -{demand.missing}
                      </span>
                    ) : (
                      <span className="text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 inline-block" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
