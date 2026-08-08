import React from 'react';
import { Network, CheckCircle2, AlertCircle, Eye, Lightbulb, Compass, HelpCircle } from 'lucide-react';
import { SourceEvidence, MultiSourceSynthesis } from '../types/ai.types';

interface EvidencePanelProps {
  sources: SourceEvidence[];
  synthesis?: MultiSourceSynthesis;
  observedFacts: string[];
  inferredInsights: string[];
  uncertainties: string[];
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  sources = [],
  synthesis,
  observedFacts = [],
  inferredInsights = [],
  uncertainties = [],
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wider uppercase">
              MULTI-SOURCE EVIDENCE SYNTHESIS & EXPLAINABILITY
            </h3>
            <p className="text-xs text-slate-400">
              Cross-validating citizen, police, hospital, weather, and telemetry feeds
            </p>
          </div>
        </div>
      </div>

      {/* Synthesis Metric Banner */}
      {synthesis && (
        <div className="p-4 rounded-xl bg-slate-950/80 border border-blue-500/40 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-400 uppercase font-mono">
                SOURCES ANALYZED:
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {synthesis.sources_analyzed} Sources
              </span>

              <span className="text-xs font-bold text-slate-400 uppercase font-mono ml-2">
                AGREEMENT:
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {synthesis.agreement}
              </span>

              <span className="text-xs font-bold text-slate-400 uppercase font-mono ml-2">
                CONFIDENCE:
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {Math.round(synthesis.confidence * 100)}%
              </span>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              CONFLICTING INFO:{' '}
              <span className="text-slate-200">{synthesis.conflicting_information || 'None'}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-xs text-slate-200 leading-relaxed font-medium">
            <span className="text-blue-400 font-bold uppercase font-mono tracking-wider mr-2">
              UNIFIED ASSESSMENT:
            </span>
            &ldquo;{synthesis.unified_assessment}&rdquo;
          </div>
        </div>
      )}

      {/* Raw Source Evidence List */}
      <div>
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          SOURCE EVIDENCE LOGS
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sources.map((src, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-blue-400 font-mono uppercase">
                    {src.source_type}
                  </span>
                  {src.timestamp && (
                    <span className="text-[10px] text-slate-500 font-mono">{src.timestamp}</span>
                  )}
                </div>
                <p className="text-xs text-slate-200 italic">&ldquo;{src.statement}&rdquo;</p>
              </div>
              {src.credibility && (
                <div className="mt-2 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                  <span>CREDIBILITY SCORE</span>
                  <span className="text-emerald-400 font-bold">
                    {Math.round(src.credibility * 100)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Distinct Explainability Categorization: OBSERVED vs INFERRED vs UNCERTAINTY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* OBSERVED */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
          <div className="flex items-center space-x-2 text-emerald-400 mb-2">
            <Eye className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono">
              OBSERVED (EMPIRICAL)
            </span>
          </div>
          <ul className="text-xs text-emerald-200 space-y-1.5 list-disc list-inside">
            {observedFacts.map((fact, idx) => (
              <li key={idx}>{fact}</li>
            ))}
          </ul>
        </div>

        {/* INFERRED */}
        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30">
          <div className="flex items-center space-x-2 text-blue-400 mb-2">
            <Lightbulb className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono">
              INFERRED (ANALYTICAL)
            </span>
          </div>
          <ul className="text-xs text-blue-200 space-y-1.5 list-disc list-inside">
            {inferredInsights.map((ins, idx) => (
              <li key={idx}>{ins}</li>
            ))}
          </ul>
        </div>

        {/* UNCERTAINTY */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
          <div className="flex items-center space-x-2 text-amber-400 mb-2">
            <HelpCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider font-mono">
              UNCERTAINTY / GAPS
            </span>
          </div>
          <ul className="text-xs text-amber-200 space-y-1.5 list-disc list-inside">
            {uncertainties.map((unc, idx) => (
              <li key={idx}>{unc}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
