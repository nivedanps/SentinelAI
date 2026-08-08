import React from 'react';
import {
  useDashboardAlerts,
  useDashboardOverview,
  useGenerateSituationReportMutation,
  useOperationalMapData,
  useSituationIntelligence,
} from '../features/dashboard/hooks/useDashboardData';
import { SystemStatusBanner } from '../features/dashboard/components/SystemStatusBanner';
import { MetricCard } from '../features/dashboard/components/MetricCard';
import { OperationalMap } from '../features/dashboard/components/OperationalMap';
import { LiveIncidentFeed } from '../features/dashboard/components/LiveIncidentFeed';
import { SituationIntelligence } from '../features/dashboard/components/SituationIntelligence';
import { ResourceReadiness } from '../features/dashboard/components/ResourceReadiness';
import { ShelterOperations } from '../features/dashboard/components/ShelterOperations';
import { CriticalAlerts } from '../features/dashboard/components/CriticalAlerts';
import { ResponseActivity } from '../features/dashboard/components/ResponseActivity';
import { AnalyticsCharts } from '../features/dashboard/components/AnalyticsCharts';

export const DashboardPage: React.FC = () => {
  const { data: overview, isLoading: isOverviewLoading } = useDashboardOverview();
  const { data: mapMarkers } = useOperationalMapData();
  const { data: situationData } = useSituationIntelligence();
  const generateReportMutation = useGenerateSituationReportMutation();

  const initialAlerts = overview?.alerts ?? [];
  const { alerts, acknowledgeAlert } = useDashboardAlerts(initialAlerts);

  if (isOverviewLoading || !overview) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-16 bg-slate-800/60 rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-800/60 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 space-y-6">
            <div className="h-[480px] bg-slate-800/60 rounded-2xl" />
            <div className="h-56 bg-slate-800/60 rounded-2xl" />
          </div>
          <div className="xl:col-span-4 space-y-6">
            <div className="h-64 bg-slate-800/60 rounded-2xl" />
            <div className="h-64 bg-slate-800/60 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Operational Status Banner */}
      <SystemStatusBanner
        status={overview.systemStatus}
        message={overview.networkStatusMessage}
        lastUpdated={overview.lastUpdated}
      />

      {/* 2. Situational Awareness Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {overview.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* 3. Main Command Center Multi-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Primary Column (8 Cols) */}
        <div className="xl:col-span-8 space-y-6 min-w-0">
          {/* Operational GIS Map */}
          <OperationalMap markers={mapMarkers ?? []} />

          {/* Analytics Charts Section */}
          <AnalyticsCharts
            trendData={overview.analytics.incidentTrend}
            severityData={overview.analytics.severityDistribution}
            resourceData={overview.analytics.resourceUtilization}
          />

          {/* Live Response Activity Timeline */}
          <ResponseActivity activities={overview.activities} />
        </div>

        {/* Right Secondary Column (4 Cols) */}
        <div className="xl:col-span-4 space-y-6 min-w-0">
          {/* AI Situation Intelligence */}
          <SituationIntelligence
            data={situationData}
            onGenerateReport={() => generateReportMutation.mutate()}
            isGenerating={generateReportMutation.isPending}
          />

          {/* Live Incident Feed */}
          <LiveIncidentFeed />

          {/* Critical Alerts */}
          <CriticalAlerts alerts={alerts.length > 0 ? alerts : overview.alerts} onAcknowledge={acknowledgeAlert} />

          {/* Resource Readiness */}
          <ResourceReadiness resources={overview.resourceReadiness} />

          {/* Shelter Operations */}
          <ShelterOperations
            activeShelters={overview.shelterOverview.activeShelters}
            totalCapacity={overview.shelterOverview.totalCapacity}
            occupied={overview.shelterOverview.occupied}
            available={overview.shelterOverview.available}
            utilizationPercentage={overview.shelterOverview.utilizationPercentage}
            shelters={overview.shelterOverview.shelters}
          />
        </div>
      </div>
    </div>
  );
};
