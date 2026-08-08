import React, { useState } from 'react';
import { Plus, Boxes, RefreshCw } from 'lucide-react';
import {
  useAgencyDistribution,
  useResourceActivities,
  useResourceAllocations,
  useResourceMetrics,
  useResourceMutations,
  useResources,
  useResourceShortages,
} from '../features/resources/hooks/useResourceData';
import { EmergencyResource } from '../features/resources/types/resource.types';

import { ResourceOverviewMetricsComponent } from '../features/resources/components/ResourceOverviewMetrics';
import { ResourceUtilizationChart } from '../features/resources/components/ResourceUtilizationChart';
import { InterAgencyDistribution } from '../features/resources/components/InterAgencyDistribution';
import { ResourceMap } from '../features/resources/components/ResourceMap';
import { ResourceFilters } from '../features/resources/components/ResourceFilters';
import { ResourceTable } from '../features/resources/components/ResourceTable';
import { ResourceDetailsModal } from '../features/resources/components/ResourceDetailsModal';
import { ResourceFormModal } from '../features/resources/components/ResourceFormModal';
import { ResourceAssignmentModal } from '../features/resources/components/ResourceAssignmentModal';
import { ResourceRecommendationPanel } from '../features/resources/components/ResourceRecommendationPanel';
import { ResourceAllocationPanel } from '../features/resources/components/ResourceAllocationPanel';
import { ResourceShortagesPanel } from '../features/resources/components/ResourceShortagesPanel';
import { ResourceTimeline } from '../features/resources/components/ResourceTimeline';

export const ResourcesPage: React.FC = () => {
  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [agency, setAgency] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('updated_at');

  // Modal States
  const [selectedResource, setSelectedResource] = useState<EmergencyResource | null>(null);
  const [editingResource, setEditingResource] = useState<EmergencyResource | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [assigningResource, setAssigningResource] = useState<EmergencyResource | null>(null);

  // Queries
  const { data: resources = [], isLoading: isResourcesLoading, refetch } = useResources({
    search,
    category,
    status,
    agency,
    availability,
  });

  const { data: metrics } = useResourceMetrics();
  const { data: agencies = [] } = useAgencyDistribution();
  const { data: shortages = [] } = useResourceShortages();
  const { data: allocations = [] } = useResourceAllocations();
  const { data: activities = [] } = useResourceActivities();

  // Mutations
  const mutations = useResourceMutations();

  // Sort resources locally
  const sortedResources = [...resources].sort((a, b) => {
    if (sortBy === 'priority') {
      const pOrder: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
    }
    if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  const handleResetFilters = () => {
    setSearch('');
    setCategory('all');
    setStatus('all');
    setAgency('all');
    setAvailability('all');
    setSortBy('updated_at');
  };

  const handleFormSubmit = async (formData: any) => {
    if (editingResource) {
      await mutations.update.mutateAsync({ id: editingResource.id, payload: formData });
    } else {
      await mutations.create.mutateAsync(formData);
    }
    setEditingResource(null);
  };

  const handleConfirmAssignment = async (
    resourceId: string,
    incidentId: string,
    incidentTitle: string
  ) => {
    await mutations.assign.mutateAsync({ resourceId, incidentId, incidentTitle });
    setAssigningResource(null);
  };

  const handleReleaseResource = async (resource: EmergencyResource) => {
    await mutations.release.mutateAsync(resource.resource_id);
  };

  if (isResourcesLoading || !metrics) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-16 bg-slate-800/60 rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-800/60 rounded-2xl" />
          ))}
        </div>
        <div className="h-96 bg-slate-800/60 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide uppercase">
              EMERGENCY RESOURCE COORDINATION CENTER
            </h1>
            <p className="text-xs text-slate-400">
              Real-time asset tracking, multi-agency allocation, proximity dispatch, and shortage mitigation.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => refetch()}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Refresh Resource Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setEditingResource(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Resource</span>
          </button>
        </div>
      </div>

      {/* 1. Overview Metrics Cards (Derived) */}
      <ResourceOverviewMetricsComponent metrics={metrics} />

      {/* 2. Top Grid: Live Resource Map + Utilization & Agency Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: GIS Map */}
        <div className="xl:col-span-8 space-y-6 min-w-0">
          <ResourceMap
            resources={sortedResources}
            onSelectResource={(r) => setSelectedResource(r)}
            onAssignResource={(r) => setAssigningResource(r)}
          />
        </div>

        {/* Right: Utilization Chart & Inter-Agency Coordination */}
        <div className="xl:col-span-4 space-y-6 min-w-0">
          <ResourceUtilizationChart metrics={metrics} />
          <InterAgencyDistribution agencies={agencies} />
        </div>
      </div>

      {/* 3. Decision Support: Smart Recommendations & Allocation Matrix */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-6 space-y-6 min-w-0">
          <ResourceRecommendationPanel
            onAssignResource={(r) => setAssigningResource(r)}
          />
        </div>

        <div className="xl:col-span-6 space-y-6 min-w-0">
          <ResourceShortagesPanel
            shortages={shortages}
            onRequestReinforcements={() => {
              const available = sortedResources.find((r) => r.status === 'AVAILABLE');
              if (available) setAssigningResource(available);
            }}
          />
          <ResourceAllocationPanel allocations={allocations} />
        </div>
      </div>

      {/* 4. Filters & Table Section */}
      <div className="space-y-4">
        <ResourceFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          status={status}
          onStatusChange={setStatus}
          agency={agency}
          onAgencyChange={setAgency}
          availability={availability}
          onAvailabilityChange={setAvailability}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onReset={handleResetFilters}
        />

        <ResourceTable
          resources={sortedResources}
          onSelectResource={(res) => setSelectedResource(res)}
          onEditResource={(res) => {
            setEditingResource(res);
            setIsFormOpen(true);
          }}
          onAssignResource={(res) => setAssigningResource(res)}
          onReleaseResource={handleReleaseResource}
        />
      </div>

      {/* 5. Deployment Activity Log Timeline */}
      <ResourceTimeline activities={activities} />

      {/* Modals */}
      <ResourceDetailsModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
        onAssign={(res) => setAssigningResource(res)}
        onRelease={handleReleaseResource}
      />

      <ResourceFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingResource(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingResource}
      />

      <ResourceAssignmentModal
        resource={assigningResource}
        isOpen={Boolean(assigningResource)}
        onClose={() => setAssigningResource(null)}
        onConfirmAssignment={handleConfirmAssignment}
      />
    </div>
  );
};
