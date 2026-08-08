import React from 'react';
import { AlertTriangle, ShieldCheck, Flame, Users, PackageX, Bot } from 'lucide-react';
import { OperationalIntelligenceOverview } from '../types/ai.types';

interface OperationalIntelligenceProps {
  data: OperationalIntelligenceOverview;
}

export const OperationalIntelligence: React.FC<OperationalIntelligenceProps> = ({ data }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Subtle ambient light indicator */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wider uppercase">
              CURRENT OPERATIONAL INTELLIGENCE
            </h2>
            <p className="text-xs text-slate-400">
              Aggregated situation metrics across active district emergency response zones
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-5">
        {/* Overall Risk */}
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Overall Risk</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="mt-2 text-xl font-extrabold text-red-400 tracking-wide">
            {data.overall_risk}
          </div>
        </div>

        {/* Confidence */}
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Confidence</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-xl font-extrabold text-emerald-400 tracking-wide">
            {Math.round(data.confidence * 100)}%
          </div>
        </div>

        {/* Active Critical Incidents */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Critical Incidents</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-xl font-extrabold text-amber-400 tracking-wide">
            {data.active_critical_incidents}
          </div>
        </div>

        {/* Affected Population */}
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Affected Pop.</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-xl font-extrabold text-purple-300 tracking-wide">
            {data.affected_population.toLocaleString()}
          </div>
        </div>

        {/* Resource Shortages */}
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Resource Shortages</span>
            <PackageX className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2 text-xl font-extrabold text-orange-400 tracking-wide">
            {data.resource_shortages}
          </div>
        </div>
      </div>

      {/* AI Situation Summary Box */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-blue-500/30 text-slate-200 leading-relaxed text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold font-mono uppercase text-blue-400 tracking-wider">
            SITUATION SYNTHESIS SUMMARY
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {data.provider_status} • Verified by Hybrid Engine
          </span>
        </div>
        <p className="font-sans text-slate-200 text-sm leading-relaxed">
          &ldquo;{data.situation_summary}&rdquo;
        </p>
      </div>
    </div>
  );
};
