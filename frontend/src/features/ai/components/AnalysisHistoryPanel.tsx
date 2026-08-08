import React from 'react';
import { History, ArrowRight } from 'lucide-react';
import { AnalysisHistoryItem } from '../types/ai.types';

interface AnalysisHistoryPanelProps {
  history: AnalysisHistoryItem[];
  selectedAnalysisId?: string;
  onSelectAnalysis: (item: AnalysisHistoryItem) => void;
}

export const AnalysisHistoryPanel: React.FC<AnalysisHistoryPanelProps> = ({
  history = [],
  selectedAnalysisId,
  onSelectAnalysis,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wider uppercase">
              ANALYSIS HISTORY & CACHE
            </h3>
            <p className="text-xs text-slate-400">
              Cached previous AI intelligence runs (reused to prevent redundant API calls)
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400">{history.length} Saved Analysis Records</span>
      </div>

      {/* Table / List of records */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/60 text-[10px] font-mono text-slate-400 uppercase border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Analysis ID</th>
              <th className="py-2.5 px-3">Incident</th>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Risk</th>
              <th className="py-2.5 px-3">Confidence</th>
              <th className="py-2.5 px-3">Provider</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {history.map((item) => {
              const isSelected = item.analysis_id === selectedAnalysisId;
              const isCritical = item.risk === 'CRITICAL';

              return (
                <tr
                  key={item.analysis_id}
                  onClick={() => onSelectAnalysis(item)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-950/40 text-white' : 'hover:bg-slate-950/40'
                  }`}
                >
                  <td className="py-3 px-3 font-mono font-bold text-blue-400">{item.analysis_id}</td>
                  <td className="py-3 px-3 font-medium text-slate-200">{item.incident_title}</td>
                  <td className="py-3 px-3 font-mono text-slate-400">{item.timestamp}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isCritical
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}
                    >
                      {item.risk}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-400 font-mono">
                    {Math.round(item.confidence * 100)}%
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">{item.provider}</td>
                  <td className="py-3 px-3 font-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAnalysis(item);
                      }}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-blue-600/20 text-blue-300 hover:bg-blue-600/40 border border-blue-500/30 text-xs transition-colors"
                    >
                      <span>Load</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
