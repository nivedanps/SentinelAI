import React from 'react';
import { UserCheck, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DecisionSupportItem } from '../types/ai.types';

interface DecisionSupportPanelProps {
  items: DecisionSupportItem[];
}

export const DecisionSupportPanel: React.FC<DecisionSupportPanelProps> = ({ items = [] }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wider uppercase">
              COMMANDER DECISION SUPPORT
            </h3>
            <p className="text-xs text-slate-400">
              Evaluates trade-offs, expected benefits, and resource impact for human command verification
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400">{items.length} Decision Vectors</span>
      </div>

      {/* Human Oversight Mandatory Banner */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3 text-xs text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300 font-mono uppercase tracking-wider block mb-0.5">
            MANDATORY HUMAN OVERSIGHT SAFEGUARD
          </span>
          <p className="leading-relaxed">
            AI recommendations are decision-support suggestions and require operator verification.
            The AI engine will never automatically dispatch resources, evacuate populations, or alter operational states.
          </p>
        </div>
      </div>

      {/* Decision Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between border-b border-slate-800/80 pb-2 mb-3">
                <span className="text-sm font-bold text-white leading-snug">{item.action}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {Math.round(item.confidence * 100)}% CONFIDENCE
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold font-mono text-[10px] text-emerald-400 uppercase block">
                    EXPECTED BENEFIT:
                  </span>
                  <p className="text-slate-200">{item.expected_benefit}</p>
                </div>

                <div>
                  <span className="font-bold font-mono text-[10px] text-orange-400 uppercase block">
                    RESOURCE IMPACT & POTENTIAL RISK:
                  </span>
                  <p className="text-slate-300">{item.potential_risk}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400 font-mono uppercase">
                REQUIRED RESOURCES
              </span>
              <div className="flex flex-wrap gap-1">
                {item.required_resources.map((r, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
