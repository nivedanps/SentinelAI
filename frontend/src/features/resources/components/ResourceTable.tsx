import React from 'react';
import { Eye, Edit3, Navigation, RotateCcw, MapPin } from 'lucide-react';
import { EmergencyResource } from '../types/resource.types';
import { ResourceStatusBadge } from './ResourceStatusBadge';
import { useNavigate } from 'react-router-dom';

interface ResourceTableProps {
  resources: EmergencyResource[];
  onSelectResource: (res: EmergencyResource) => void;
  onEditResource: (res: EmergencyResource) => void;
  onAssignResource: (res: EmergencyResource) => void;
  onReleaseResource: (res: EmergencyResource) => void;
}

export const ResourceTable: React.FC<ResourceTableProps> = ({
  resources,
  onSelectResource,
  onEditResource,
  onAssignResource,
  onReleaseResource,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Resource ID</th>
              <th className="py-3 px-4">Resource Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Agency</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Assigned Incident</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {resources.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No emergency resources match the selected criteria.
                </td>
              </tr>
            ) : (
              resources.map((res) => (
                <tr
                  key={res.id}
                  className="hover:bg-slate-800/50 transition-colors group"
                >
                  {/* Resource ID */}
                  <td className="py-3 px-4 font-mono font-bold text-blue-400">
                    {res.resource_id}
                  </td>

                  {/* Name & Type */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {res.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{res.type}</div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-slate-300">{res.category}</td>

                  {/* Agency */}
                  <td className="py-3 px-4 text-slate-300 font-medium">
                    {res.organization_agency}
                  </td>

                  {/* Location */}
                  <td className="py-3 px-4 text-slate-300">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      <span className="truncate max-w-[140px]">{res.location_name}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    <ResourceStatusBadge status={res.status} />
                  </td>

                  {/* Assigned Incident */}
                  <td className="py-3 px-4">
                    {res.assigned_incident_id ? (
                      <button
                        onClick={() => navigate(`/incidents/${res.assigned_incident_id}`)}
                        className="inline-flex items-center space-x-1.5 px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[11px] font-mono font-bold transition-all"
                      >
                        <Navigation className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">
                          {res.assigned_incident_id}
                        </span>
                      </button>
                    ) : (
                      <span className="text-slate-500 font-mono">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {/* View Details */}
                      <button
                        onClick={() => onSelectResource(res)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => onEditResource(res)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Edit Resource"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Assign / Release */}
                      {res.status === 'AVAILABLE' ? (
                        <button
                          onClick={() => onAssignResource(res)}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] shadow transition-colors"
                        >
                          Assign
                        </button>
                      ) : res.status === 'DEPLOYED' ? (
                        <button
                          onClick={() => onReleaseResource(res)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Release</span>
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
