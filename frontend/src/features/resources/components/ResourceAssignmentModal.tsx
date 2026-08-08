import React, { useState } from 'react';
import { X, Navigation, AlertTriangle, CheckCircle2, Radio, MapPin } from 'lucide-react';
import { EmergencyResource } from '../types/resource.types';
import { mockLiveIncidents } from '../../dashboard/data/dashboardMockData';
import { calculateHaversineDistance } from '../api/resourceApi';

interface ResourceAssignmentModalProps {
  resource: EmergencyResource | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAssignment: (resourceId: string, incidentId: string, incidentTitle: string) => Promise<void>;
}

export const ResourceAssignmentModal: React.FC<ResourceAssignmentModalProps> = ({
  resource,
  isOpen,
  onClose,
  onConfirmAssignment,
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(
    mockLiveIncidents[0]?.id || 'INC-1042'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen || !resource) return null;

  const isAssignable = resource.status === 'AVAILABLE';

  const selectedIncident =
    mockLiveIncidents.find((inc) => inc.id === selectedIncidentId) || mockLiveIncidents[0];

  // Incidents mock coordinates for distance calculation
  const incidentCoords: Record<string, [number, number]> = {
    'INC-1042': [12.2958, 76.6394],
    'INC-1041': [12.9716, 77.5946],
    'INC-1040': [12.5218, 76.8951],
    'INC-1039': [12.4244, 75.7382],
    'INC-1038': [12.3106, 76.2917],
  };

  const coords = incidentCoords[selectedIncident.id!] || [12.3, 76.6];
  const distance = calculateHaversineDistance(
    coords[0],
    coords[1],
    resource.latitude,
    resource.longitude
  );

  const handleConfirm = async () => {
    if (!isAssignable) return;

    try {
      setIsSubmitting(true);
      await onConfirmAssignment(
        resource.resource_id,
        selectedIncident.id!,
        selectedIncident.title || 'Disaster Incident'
      );
      setSuccessMsg(
        `Successfully dispatched ${resource.resource_id} to ${selectedIncident.title}. Resource status updated to DEPLOYED.`
      );
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    } catch {
      // Error handled by parent hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">DISPATCH & ASSIGN RESOURCE</h2>
              <span className="text-[10px] text-slate-400 font-mono">
                Emergency Operation Directive
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>{successMsg}</div>
          </div>
        ) : (
          <>
            {!isAssignable && (
              <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  Resource is currently <strong>{resource.status}</strong>. Only AVAILABLE
                  resources can be assigned to new incidents.
                </span>
              </div>
            )}

            {/* Step 1: Resource Summary */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  SELECTED RESOURCE
                </span>
                <span className="font-mono font-bold text-blue-400">{resource.resource_id}</span>
              </div>
              <div className="font-bold text-white text-sm">{resource.name}</div>
              <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                <span>Agency: {resource.organization_agency}</span>
                <span>Location: {resource.location_name}</span>
              </div>
            </div>

            {/* Step 2: Target Incident Selector */}
            <div className="space-y-2 text-xs">
              <label className="block text-[10px] font-bold uppercase text-slate-400">
                SELECT TARGET INCIDENT FOR DISPATCH *
              </label>
              <select
                value={selectedIncidentId}
                onChange={(e) => setSelectedIncidentId(e.target.value)}
                disabled={!isAssignable}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white font-semibold focus:border-blue-500"
              >
                {mockLiveIncidents.map((inc) => (
                  <option key={inc.id} value={inc.id}>
                    {inc.id} — {inc.title} ({inc.severity?.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Proximity & Incident Preview */}
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-blue-400 uppercase">
                <span className="flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5" />
                  INCIDENT DETAILS & PROXIMITY
                </span>
                <span className="font-mono text-emerald-400 text-xs">{distance} km away</span>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-white text-sm">{selectedIncident.title}</div>
                <div className="flex items-center space-x-3 text-slate-300 text-[11px]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {selectedIncident.address}
                  </span>
                  <span className="font-mono text-amber-400">
                    Affected: {selectedIncident.affected_population?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={!isAssignable || isSubmitting}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition-colors disabled:opacity-40"
              >
                {isSubmitting ? 'Confirming Dispatch...' : 'Confirm Assignment'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
