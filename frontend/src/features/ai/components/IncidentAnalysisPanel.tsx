import React from 'react';
import {
  ShieldAlert,
  Users,
  Building,
  Truck,
  AlertTriangle,
  HelpCircle,
  Activity,
  Layers,
} from 'lucide-react';
import { IncidentIntelligenceAnalysis } from '../types/ai.types';

interface IncidentAnalysisPanelProps {
  analysis: IncidentIntelligenceAnalysis;
}

export const IncidentAnalysisPanel: React.FC<IncidentAnalysisPanelProps> = ({ analysis }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header info */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {analysis.incident_id}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ANALYSIS ID: {analysis.analysis_id}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">{analysis.incident_title}</h2>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="block text-[10px] font-mono text-slate-400">DISASTER TYPE</span>
            <span className="text-sm font-bold text-blue-400">{analysis.incident_type}</span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-mono text-slate-400">SEVERITY / URGENCY</span>
            <span className="text-sm font-bold text-red-400">
              {analysis.severity} / {analysis.urgency}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-mono text-slate-400">CONFIDENCE</span>
            <span className="text-sm font-bold text-emerald-400">
              {Math.round(analysis.confidence * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Affected Population */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center space-x-2 text-purple-400 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Affected Population</span>
          </div>
          <p className="text-lg font-extrabold text-white">
            {analysis.affected_population_estimate.toLocaleString()} residents
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Estimated in direct inundation zone</p>
        </div>

        {/* Potential Impact */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center space-x-2 text-amber-400 mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Potential Impact</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
            {analysis.potential_impacts.map((imp, idx) => (
              <li key={idx}>{imp}</li>
            ))}
          </ul>
        </div>

        {/* Infrastructure Impact */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center space-x-2 text-blue-400 mb-1">
            <Building className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Infrastructure Impact</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
            {analysis.infrastructure_impacts.map((inf, idx) => (
              <li key={idx}>{inf}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Requirements Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Response Teams */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center space-x-2 text-emerald-400 mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Required Response Teams
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.required_response_teams.map((team, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
              >
                {team}
              </span>
            ))}
          </div>
        </div>

        {/* Required Resources */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center space-x-2 text-cyan-400 mb-2">
            <Truck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Required Resources
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.required_resources.map((res, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
              >
                {res}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Risks & Uncertainties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30">
          <div className="flex items-center space-x-2 text-red-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Identified Risks</span>
          </div>
          <ul className="text-xs text-red-200 space-y-1 list-disc list-inside">
            {analysis.risks.map((risk, idx) => (
              <li key={idx}>{risk}</li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
          <div className="flex items-center space-x-2 text-amber-400 mb-2">
            <HelpCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Information Gaps & Uncertainties
            </span>
          </div>
          <ul className="text-xs text-amber-200 space-y-1 list-disc list-inside">
            {analysis.uncertainties.map((unc, idx) => (
              <li key={idx}>{unc}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
