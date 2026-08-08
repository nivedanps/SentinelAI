import React from 'react';
import { ListOrdered, CheckSquare, ShieldAlert, FileText, Wrench } from 'lucide-react';
import { ActionRecommendation } from '../types/ai.types';

interface RecommendationPanelProps {
  recommendations: ActionRecommendation[];
}

export const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  recommendations = [],
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <ListOrdered className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wider uppercase">
              RECOMMENDED RESPONSE ACTIONS
            </h3>
            <p className="text-xs text-slate-400">
              Prioritized tactical action items generated with clear rationale and evidence tracing
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400">
          {recommendations.length} Action Directives
        </span>
      </div>

      {/* Action Cards List */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const isCritical = rec.priority === 'CRITICAL';
          const isHigh = rec.priority === 'HIGH';

          return (
            <div
              key={rec.id || index}
              className={`p-4 rounded-xl border transition-all ${
                isCritical
                  ? 'bg-red-950/20 border-red-500/40'
                  : isHigh
                  ? 'bg-orange-950/20 border-orange-500/40'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 font-mono text-xs font-bold flex-shrink-0 mt-0.5 border border-blue-500/30">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-white leading-snug">{rec.action}</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      <span className="font-bold text-slate-400 font-mono uppercase mr-1">
                        REASON:
                      </span>
                      &ldquo;{rec.reason}&rdquo;
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono font-extrabold px-2.5 py-1 rounded border ${
                    isCritical
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : isHigh
                      ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  }`}
                >
                  PRIORITY: {rec.priority}
                </span>
              </div>

              {/* Detail Pills */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* Supporting Evidence */}
                <div className="flex items-start space-x-1.5 text-slate-400">
                  <FileText className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-mono text-[10px] text-slate-500 uppercase">
                      SUPPORTING EVIDENCE
                    </span>
                    <span className="text-slate-300">
                      {rec.supporting_evidence?.join(', ') || 'Incident Report'}
                    </span>
                  </div>
                </div>

                {/* Related Incident */}
                <div className="flex items-start space-x-1.5 text-slate-400">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-mono text-[10px] text-slate-500 uppercase">
                      RELATED INCIDENT
                    </span>
                    <span className="text-slate-300">{rec.related_incident}</span>
                  </div>
                </div>

                {/* Recommended Resource */}
                <div className="flex items-start space-x-1.5 text-slate-400">
                  <Wrench className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-mono text-[10px] text-slate-500 uppercase">
                      RECOMMENDED RESOURCE
                    </span>
                    <span className="text-emerald-300 font-medium">
                      {rec.recommended_resource}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
