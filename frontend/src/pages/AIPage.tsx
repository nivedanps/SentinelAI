import React, { useState, useEffect } from 'react';
import { Bot, RefreshCw, FileText, Sparkles, AlertTriangle } from 'lucide-react';
import {
  IncidentIntelligenceAnalysis,
  OperationalIntelligenceOverview,
  SituationReport,
  AnalysisHistoryItem,
} from '../features/ai/types/ai.types';
import {
  fetchOperationalOverview,
  analyzeIncident,
  generateSituationReport,
  fetchAnalysisHistory,
  mockMysuruAnalysis,
  mockOperationalOverview,
} from '../features/ai/services/aiService';

import { AIProviderStatus } from '../features/ai/components/AIProviderStatus';
import { OperationalIntelligence } from '../features/ai/components/OperationalIntelligence';
import {
  IncidentIntelligence,
  defaultIncidents,
} from '../features/ai/components/IncidentIntelligence';
import { IncidentAnalysisPanel } from '../features/ai/components/IncidentAnalysisPanel';
import { EvidencePanel } from '../features/ai/components/EvidencePanel';
import { RiskAssessmentPanel } from '../features/ai/components/RiskAssessmentPanel';
import { RecommendationPanel } from '../features/ai/components/RecommendationPanel';
import { DecisionSupportPanel } from '../features/ai/components/DecisionSupportPanel';
import { SituationReportModal } from '../features/ai/components/SituationReportModal';
import { AnalysisHistoryPanel } from '../features/ai/components/AnalysisHistoryPanel';

export const AIPage: React.FC = () => {
  const [overview, setOverview] = useState<OperationalIntelligenceOverview>(mockOperationalOverview);
  const [analysis, setAnalysis] = useState<IncidentIntelligenceAnalysis>(mockMysuruAnalysis);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-1042');
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [sitrep, setSitrep] = useState<SituationReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);

  // Initial load: Fetch cached overview and history without triggering fresh LLM calls
  useEffect(() => {
    async function loadInitialData() {
      const overviewData = await fetchOperationalOverview();
      setOverview(overviewData);

      const historyData = await fetchAnalysisHistory();
      setHistory(historyData);
    }
    loadInitialData();
  }, []);

  // Top Action Handlers
  const handleAnalyzeActiveIncidents = async () => {
    setIsAnalyzing(true);
    try {
      const res = await analyzeIncident(selectedIncidentId, { force_refresh: true });
      setAnalysis(res);
      const newOverview = await fetchOperationalOverview();
      setOverview(newOverview);
      const updatedHistory = await fetchAnalysisHistory();
      setHistory(updatedHistory);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeSelectedIncident = async (incidentId?: string) => {
    const targetId = incidentId || selectedIncidentId;
    setSelectedIncidentId(targetId);
    setIsAnalyzing(true);
    try {
      const res = await analyzeIncident(targetId, { force_refresh: true });
      setAnalysis(res);
      const updatedHistory = await fetchAnalysisHistory();
      setHistory(updatedHistory);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateReportClick = async () => {
    setIsGeneratingReport(true);
    try {
      const report = await generateSituationReport();
      setSitrep(report);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleRefreshIntelligence = async () => {
    const overviewData = await fetchOperationalOverview();
    setOverview(overviewData);
  };

  const handleSelectHistoryItem = async (item: AnalysisHistoryItem) => {
    setSelectedIncidentId(item.incident_id);
    const res = await analyzeIncident(item.incident_id);
    setAnalysis(res);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-wide">
                SENTINELAI DISASTER INTELLIGENCE
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                AI-powered emergency intelligence, risk assessment and decision support
              </p>
            </div>
          </div>
        </div>

        {/* TOP ACTIONS BUTTONS */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleAnalyzeActiveIncidents}
            disabled={isAnalyzing}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Active Incidents'}</span>
          </button>

          <button
            onClick={() => handleAnalyzeSelectedIncident()}
            disabled={isAnalyzing}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all disabled:opacity-50"
          >
            <Bot className="w-4 h-4 text-blue-400" />
            <span>Analyze Selected Incident</span>
          </button>

          <button
            onClick={handleGenerateReportClick}
            disabled={isGeneratingReport}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all disabled:opacity-50"
          >
            <FileText className={`w-4 h-4 text-emerald-400 ${isGeneratingReport ? 'animate-spin' : ''}`} />
            <span>{isGeneratingReport ? 'Generating...' : 'Generate Situation Report'}</span>
          </button>

          <button
            onClick={handleRefreshIntelligence}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Intelligence</span>
          </button>
        </div>
      </div>

      {/* AI ENGINE & PROVIDER STATUS BADGE */}
      <AIProviderStatus
        status="READY"
        providerName={overview.provider_name || 'Mock Engine'}
        providerStatus={overview.provider_status || 'DEMO INTELLIGENCE'}
        lastAnalysisId={analysis.analysis_id}
        lastAnalysisTime={overview.last_analysis_time}
      />

      {/* CURRENT OPERATIONAL INTELLIGENCE */}
      <OperationalIntelligence data={overview} />

      {/* MAIN TWO-COLUMN COMMAND CENTER LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: INCIDENT SELECTOR & HISTORY */}
        <div className="lg:col-span-4 space-y-6">
          <IncidentIntelligence
            incidents={defaultIncidents}
            selectedIncidentId={selectedIncidentId}
            onSelectIncident={(id) => handleAnalyzeSelectedIncident(id)}
            onAnalyzeIncident={(id) => handleAnalyzeSelectedIncident(id)}
            isAnalyzing={isAnalyzing}
          />

          <AnalysisHistoryPanel
            history={history}
            selectedAnalysisId={analysis.analysis_id}
            onSelectAnalysis={handleSelectHistoryItem}
          />
        </div>

        {/* RIGHT COLUMN: ACTIVE INCIDENT DETAILED ANALYSIS */}
        <div className="lg:col-span-8 space-y-6">
          {/* Incident Structured Analysis */}
          <IncidentAnalysisPanel analysis={analysis} />

          {/* Multi-Source Evidence Synthesis */}
          <EvidencePanel
            sources={analysis.source_evidence}
            synthesis={analysis.multi_source_synthesis}
            observedFacts={analysis.observed_facts}
            inferredInsights={analysis.inferred_insights}
            uncertainties={analysis.uncertainties}
          />

          {/* Deterministic Risk Assessment */}
          <RiskAssessmentPanel riskBreakdown={analysis.risk_assessment_breakdown} />

          {/* Recommended Response Actions */}
          <RecommendationPanel recommendations={analysis.recommended_actions} />

          {/* Commander Decision Support */}
          <DecisionSupportPanel items={analysis.decision_support} />
        </div>
      </div>

      {/* SITUATION REPORT MODAL */}
      {sitrep && <SituationReportModal report={sitrep} onClose={() => setSitrep(null)} />}
    </div>
  );
};
