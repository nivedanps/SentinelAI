import React, { useState } from 'react';
import { FileText, Copy, Download, X, Check, ShieldCheck, Printer } from 'lucide-react';
import { SituationReport } from '../types/ai.types';

interface SituationReportModalProps {
  report: SituationReport;
  onClose: () => void;
}

export const SituationReportModal: React.FC<SituationReportModalProps> = ({ report, onClose }) => {
  const [copied, setCopied] = useState(false);

  const formattedReportText = `============================================================
SENTINELAI EMERGENCY SITUATION REPORT (SITREP)
Generated: ${new Date(report.generated_at).toLocaleString()}
Report ID: ${report.report_id}
Target Audiences: ${report.target_audiences.join(', ')}
============================================================

1. EXECUTIVE SUMMARY
------------------------------------------------------------
${report.executive_summary}

2. CURRENT OPERATIONAL SITUATION
------------------------------------------------------------
${report.current_situation}
Total Estimated Affected Population: ${report.affected_population_total.toLocaleString()}

3. ACTIVE CRITICAL INCIDENTS
------------------------------------------------------------
${report.critical_incidents.map((i) => `- [${i.id}] ${i.title} (${i.severity}) — ${i.affected_pop} affected`).join('\n')}

4. INFRASTRUCTURE IMPACT
------------------------------------------------------------
${report.infrastructure_impact_summary}

5. RESOURCE STATUS
------------------------------------------------------------
${report.resource_status_summary}

6. SHELTER STATUS
------------------------------------------------------------
${report.shelter_status_summary}

7. MAJOR RISKS
------------------------------------------------------------
${report.major_risks.map((r) => `- ${r}`).join('\n')}

8. RECOMMENDED RESPONSE ACTIONS
------------------------------------------------------------
${report.recommended_actions.map((a, idx) => `${idx + 1}. ${a}`).join('\n')}

9. INFORMATION GAPS & UNCERTAINTIES
------------------------------------------------------------
${report.uncertainties.map((u) => `- ${u}`).join('\n')}

============================================================
END OF SITUATION REPORT — SENTINELAI DISASTER INTELLIGENCE
============================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedReportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([formattedReportText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `SITREP_${report.report_id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wider uppercase">
                EMERGENCY SITUATION REPORT (SITREP)
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {report.report_id} • Generated {new Date(report.generated_at).toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? 'Copied!' : 'Copy Report'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-xs leading-relaxed font-sans">
          {/* Target Audience Badges */}
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              TARGET AUDIENCE:
            </span>
            {report.target_audiences.map((aud, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30"
              >
                {aud}
              </span>
            ))}
          </div>

          {/* Report Text Content */}
          <div className="space-y-4 font-mono text-xs bg-slate-950/80 p-5 rounded-xl border border-slate-800 whitespace-pre-wrap leading-relaxed text-slate-300">
            {formattedReportText}
          </div>
        </div>
      </div>
    </div>
  );
};
