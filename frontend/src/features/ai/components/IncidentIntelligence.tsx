import React from 'react';
import { AlertCircle, Eye, Search, Sparkles } from 'lucide-react';

export interface IncidentSummaryItem {
  id: string;
  title: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;
  location: string;
  status: string;
  affectedPop: number;
}

interface IncidentIntelligenceProps {
  incidents: IncidentSummaryItem[];
  selectedIncidentId: string;
  onSelectIncident: (id: string) => void;
  onAnalyzeIncident: (id: string) => void;
  isAnalyzing: boolean;
}

export const defaultIncidents: IncidentSummaryItem[] = [
  {
    id: 'INC-1042',
    title: 'Flood near Mysuru',
    category: 'FLOOD',
    severity: 'CRITICAL',
    confidence: 0.96,
    location: 'Mysuru District, Sector A',
    status: 'REPORTED',
    affectedPop: 3200,
  },
  {
    id: 'INC-1041',
    title: 'Industrial fire — Bengaluru',
    category: 'FIRE',
    severity: 'CRITICAL',
    confidence: 0.91,
    location: 'Peenya Industrial Area',
    status: 'IN_PROGRESS',
    affectedPop: 4500,
  },
  {
    id: 'INC-1040',
    title: 'Road disruption — Mandya',
    category: 'LANDSLIDE',
    severity: 'HIGH',
    confidence: 0.87,
    location: 'Mandya Highway Corridor',
    status: 'VERIFIED',
    affectedPop: 1800,
  },
  {
    id: 'INC-1039',
    title: 'Landslide risk — Kodagu',
    category: 'LANDSLIDE',
    severity: 'HIGH',
    confidence: 0.89,
    location: 'Madikeri Slope Zone',
    status: 'REPORTED',
    affectedPop: 2980,
  },
];

export const IncidentIntelligence: React.FC<IncidentIntelligenceProps> = ({
  incidents = defaultIncidents,
  selectedIncidentId,
  onSelectIncident,
  onAnalyzeIncident,
  isAnalyzing,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold text-white tracking-wider uppercase">
            INCIDENT INTELLIGENCE
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {incidents.length} Requiring Attention
        </span>
      </div>

      {/* Incident Cards List */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {incidents.map((inc) => {
          const isSelected = inc.id === selectedIncidentId;
          const isCritical = inc.severity === 'CRITICAL';

          return (
            <div
              key={inc.id}
              onClick={() => onSelectIncident(inc.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {inc.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isCritical
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">{inc.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{inc.location}</p>
                </div>

                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 font-mono">CONFIDENCE</span>
                  <span className="text-xs font-bold text-emerald-400">
                    {Math.round(inc.confidence * 100)}%
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-end space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectIncident(inc.id);
                  }}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Incident</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAnalyzeIncident(inc.id);
                  }}
                  disabled={isAnalyzing}
                  className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing && isSelected ? 'Analyzing...' : 'Analyze'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
