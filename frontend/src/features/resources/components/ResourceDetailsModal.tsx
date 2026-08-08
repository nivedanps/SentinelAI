import React from 'react';
import { X, MapPin, Phone, Calendar, Shield, Radio, Navigation, ExternalLink } from 'lucide-react';
import { EmergencyResource } from '../types/resource.types';
import { ResourceStatusBadge } from './ResourceStatusBadge';
import { useNavigate } from 'react-router-dom';

interface ResourceDetailsModalProps {
  resource: EmergencyResource | null;
  onClose: () => void;
  onAssign?: (res: EmergencyResource) => void;
  onRelease?: (res: EmergencyResource) => void;
}

export const ResourceDetailsModal: React.FC<ResourceDetailsModalProps> = ({
  resource,
  onClose,
  onAssign,
  onRelease,
}) => {
  const navigate = useNavigate();
  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-blue-400">
                {resource.resource_id}
              </span>
              <ResourceStatusBadge status={resource.status} />
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                {resource.priority} PRIORITY
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">{resource.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">CATEGORY</span>
            <span className="font-semibold text-white">{resource.category}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">RESOURCE TYPE</span>
            <span className="font-semibold text-white">{resource.type}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">ORGANIZATION / AGENCY</span>
            <span className="font-semibold text-purple-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              {resource.organization_agency}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">CAPACITY / SETUP</span>
            <span className="font-semibold text-emerald-400">{resource.capacity || 'Standard'}</span>
          </div>
        </div>

        {/* Location & Coordinates */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              CURRENT LOCATION
            </span>
            <span className="font-mono text-slate-400 text-[11px]">
              {resource.latitude.toFixed(4)}, {resource.longitude.toFixed(4)}
            </span>
          </div>
          <p className="font-bold text-white text-sm">{resource.location_name}</p>
        </div>

        {/* Assigned Incident */}
        <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs space-y-1.5">
          <span className="text-[10px] font-bold text-blue-400 uppercase flex items-center gap-1">
            <Radio className="w-3.5 h-3.5" />
            DEPLOYMENT ASSIGNMENT
          </span>
          {resource.assigned_incident_id ? (
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-blue-300">
                  {resource.assigned_incident_id}
                </span>
                <span className="text-white ml-2 font-medium">
                  {resource.assigned_incident_title}
                </span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  navigate(`/incidents/${resource.assigned_incident_id}`);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:underline"
              >
                <span>View Incident</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <p className="text-slate-400 italic">No active incident assigned. Unit is available for dispatch.</p>
          )}
        </div>

        {/* Contact & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {resource.contact && (
            <div className="flex items-center space-x-2 text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase">CONTACT</span>
                <span className="font-mono font-semibold">{resource.contact}</span>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase">LAST UPDATED</span>
              <span className="font-mono">{new Date(resource.updated_at).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {resource.notes && (
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">OPERATOR NOTES</span>
            {resource.notes}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
          {resource.status === 'AVAILABLE' && onAssign && (
            <button
              onClick={() => {
                onClose();
                onAssign(resource);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow transition-colors"
            >
              Assign to Incident
            </button>
          )}
          {resource.status === 'DEPLOYED' && onRelease && (
            <button
              onClick={() => {
                onClose();
                onRelease(resource);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-colors"
            >
              Release Resource
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
