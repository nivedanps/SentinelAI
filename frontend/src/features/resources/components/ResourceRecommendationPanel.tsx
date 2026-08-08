import React, { useState } from 'react';
import { Sparkles, MapPin, Navigation, ArrowRight } from 'lucide-react';
import { EmergencyResource } from '../types/resource.types';
import { getRecommendedResourcesForIncident } from '../api/resourceApi';
import { mockLiveIncidents } from '../../dashboard/data/dashboardMockData';
import { ResourceStatusBadge } from './ResourceStatusBadge';

interface ResourceRecommendationPanelProps {
  onAssignResource: (res: EmergencyResource) => void;
}

export const ResourceRecommendationPanel: React.FC<ResourceRecommendationPanelProps> = ({
  onAssignResource,
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-1042');

  const selectedIncident =
    mockLiveIncidents.find((inc) => inc.id === selectedIncidentId) || mockLiveIncidents[0];

  const incidentCoords: Record<string, [number, number]> = {
    'INC-1042': [12.2958, 76.6394],
    'INC-1041': [12.9716, 77.5946],
    'INC-1040': [12.5218, 76.8951],
    'INC-1039': [12.4244, 75.7382],
    'INC-1038': [12.3106, 76.2917],
  };

  const coords = incidentCoords[selectedIncident.id!] || [12.3, 76.6];

  const recommendations = getRecommendedResourcesForIncident(
    coords[0],
    coords[1],
    selectedIncident.disaster_type || 'flood',
    selectedIncident.severity || 'critical'
  );

  return (
    <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">
              SMART RECOMMENDED RESOURCES
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Deterministic Proximity & Disaster Suitability Engine
            </span>
          </div>
        </div>

        {/* Incident selector */}
        <select
          value={selectedIncidentId}
          onChange={(e) => setSelectedIncidentId(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white font-semibold focus:border-blue-500 self-start sm:self-auto"
        >
          {mockLiveIncidents.map((inc) => (
            <option key={inc.id} value={inc.id}>
              {inc.id} — {inc.title}
            </option>
          ))}
        </select>
      </div>

      {/* Incident Context Preview */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div>
          <span className="text-[10px] font-bold text-blue-400 uppercase font-mono">
            {selectedIncident.id} ({selectedIncident.severity?.toUpperCase()})
          </span>
          <h4 className="text-sm font-bold text-white mt-0.5">{selectedIncident.title}</h4>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-slate-500" />
            <span>{selectedIncident.address}</span>
          </div>
        </div>
        <div className="text-right font-mono text-[11px] text-slate-400">
          <div>Affected: {selectedIncident.affected_population?.toLocaleString()}</div>
          <div className="text-emerald-400 font-bold">
            {recommendations.length} Available Matches
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-2.5">
        {recommendations.length === 0 ? (
          <div className="p-4 text-center text-slate-400 text-xs italic">
            No available resources nearby matching this incident criteria.
          </div>
        ) : (
          recommendations.slice(0, 4).map((rec) => (
            <div
              key={rec.resource.id}
              className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-blue-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-blue-400">
                    {rec.resource.resource_id}
                  </span>
                  <span className="font-bold text-white">{rec.resource.name}</span>
                  <ResourceStatusBadge status={rec.availability} />
                </div>
                <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                  &ldquo;{rec.reason}&rdquo;
                </p>
                <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-mono">
                  <span>Agency: {rec.resource.organization_agency}</span>
                  <span className="text-emerald-400 font-bold">
                    Distance: {rec.distance_km} km
                  </span>
                </div>
              </div>

              <button
                onClick={() => onAssignResource(rec.resource)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1 shadow flex-shrink-0"
              >
                <span>Dispatch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
