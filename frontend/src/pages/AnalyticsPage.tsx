import React, { useState, useEffect, useCallback } from 'react';
import { OperationalAnalyticsData, AnalyticsFilterState } from '../features/analytics/types/analytics.types';
import { fetchOperationalAnalytics } from '../features/analytics/services/analyticsService';

// Components
import { AnalyticsHeader } from '../features/analytics/components/AnalyticsHeader';
import { AnalyticsKpiGrid } from '../features/analytics/components/AnalyticsKpiGrid';
import { IncidentTrendChart } from '../features/analytics/components/IncidentTrendChart';
import { SeverityDistribution } from '../features/analytics/components/SeverityDistribution';
import { DisasterTypeChart } from '../features/analytics/components/DisasterTypeChart';
import { HotspotMap } from '../features/analytics/components/HotspotMap';
import { PopulationImpact } from '../features/analytics/components/PopulationImpact';
import { ResourceUtilization } from '../features/analytics/components/ResourceUtilization';
import { ResourceShortages } from '../features/analytics/components/ResourceShortages';
import { ResponsePerformance } from '../features/analytics/components/ResponsePerformance';
import { IncidentLifecycle } from '../features/analytics/components/IncidentLifecycle';
import { AIAnalytics } from '../features/analytics/components/AIAnalytics';
import { RiskTrend } from '../features/analytics/components/RiskTrend';
import { CriticalIncidentTable } from '../features/analytics/components/CriticalIncidentTable';
import { OperationalInsights } from '../features/analytics/components/OperationalInsights';
import { AnomalyPanel } from '../features/analytics/components/AnomalyPanel';
import { DataQuality } from '../features/analytics/components/DataQuality';
import { SourceAnalytics } from '../features/analytics/components/SourceAnalytics';
import { Loader2 } from 'lucide-react';

const defaultFilters: AnalyticsFilterState = {
  dateRange: '24h',
  disasterType: 'ALL',
  severity: 'ALL',
  location: 'ALL',
  status: 'ALL',
};

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<OperationalAnalyticsData | null>(null);
  const [filters, setFilters] = useState<AnalyticsFilterState>(defaultFilters);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchOperationalAnalytics(filters);
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="text-sm font-mono text-slate-400">Loading Operational Analytics…</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 pb-8">
      {/* Header & Filter Bar */}
      <AnalyticsHeader
        filters={filters}
        onFilterChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
        onRefresh={loadData}
        onExport={() => {}}
        isRefreshing={loading}
      />

      {/* KPI Strip */}
      <AnalyticsKpiGrid metrics={data.kpis} />

      {/* Row 1: Incident Trend + Severity + Disaster Types */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncidentTrendChart data={data.incident_trend} />
        </div>
        <SeverityDistribution data={data.severity_distribution} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DisasterTypeChart data={data.disaster_types} />
        <RiskTrend data={data.risk_trend} />
      </div>

      {/* Row 2: Hotspot Map */}
      <HotspotMap hotspots={data.hotspots} />

      {/* Row 3: Population + Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PopulationImpact data={data.population_impact} />
        <ResourceUtilization data={data.resource_status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResourceShortages shortages={data.resource_shortages} />
        <ResponsePerformance data={data.response_performance} />
      </div>

      {/* Row 4: Lifecycle + AI Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncidentLifecycle stages={data.lifecycle} />
        <AIAnalytics data={data.ai_analytics} />
      </div>

      {/* Row 5: Critical Incidents Table */}
      {data.critical_incidents && data.critical_incidents.length > 0 && (
        <CriticalIncidentTable incidents={data.critical_incidents} />
      )}

      {/* Row 6: Insights + Anomalies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OperationalInsights insights={data.operational_insights} />
        <AnomalyPanel anomalies={data.anomalies} />
      </div>

      {/* Row 7: Data Quality + Source Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataQuality data={data.data_quality} />
        <SourceAnalytics sources={data.source_analytics} />
      </div>
    </div>
  );
};
