import React from 'react';
import { AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';
import { ResourceShortageItem } from '../types/resource.types';

interface ResourceShortagesPanelProps {
  shortages: ResourceShortageItem[];
  onRequestReinforcements?: (shortage: ResourceShortageItem) => void;
}

export const ResourceShortagesPanel: React.FC<ResourceShortagesPanelProps> = ({
  shortages,
  onRequestReinforcements,
}) => {
  return (
    <div className="bg-slate-900 border border-rose-500/40 rounded-2xl p-4 shadow-xl space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">
              RESOURCE SHORTAGE ALERTS
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Automatic Deficit Identification Engine
            </span>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
          {shortages.length} CRITICAL DEFICITS
        </span>
      </div>

      {/* Shortages List */}
      <div className="space-y-3">
        {shortages.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span className="font-extrabold text-white">{item.resourceCategory} Deficit</span>
                <span className="font-mono text-slate-400">({item.incidentId})</span>
              </div>
              <div className="flex items-center space-x-2 font-mono self-start sm:self-auto">
                <span className="text-slate-300">
                  Req: <strong className="text-white">{item.required}</strong> | Avail:{' '}
                  <strong className="text-emerald-400">{item.available}</strong>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  SHORTAGE: -{item.shortage}
                </span>
              </div>
            </div>

            <p className="text-slate-300 leading-snug">
              <strong className="text-white">{item.incidentTitle}:</strong> {item.recommendedAction}
            </p>

            {onRequestReinforcements && (
              <div className="pt-1 flex justify-end">
                <button
                  onClick={() => onRequestReinforcements(item)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-[11px] font-semibold transition-all"
                >
                  <span>Request Reallocation</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
