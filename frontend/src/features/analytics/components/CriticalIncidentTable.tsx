import React from 'react';
import { CriticalIncidentRow } from '../types/analytics.types';
import { useNavigate } from 'react-router-dom';
import { Siren, ExternalLink } from 'lucide-react';

interface CriticalIncidentTableProps {
  incidents: CriticalIncidentRow[];
}

const severityBadge: Record<string, string> = {
  CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/40',
  HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  MEDIUM: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  LOW: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
};

const statusBadge: Record<string, string> = {
  IN_PROGRESS: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  VERIFIED: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
  REPORTED: 'bg-slate-500/20 text-slate-400 border-slate-500/40',
  RESOLVED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
};

export const CriticalIncidentTable: React.FC<CriticalIncidentTableProps> = ({ incidents }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
        <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
          <Siren className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider uppercase">CRITICAL INCIDENT TABLE</h3>
          <p className="text-xs text-slate-400">High-priority incidents requiring immediate operational attention</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] font-mono font-bold text-slate-400 uppercase border-b border-slate-800">
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Incident</th>
              <th className="text-left p-2">Location</th>
              <th className="text-center p-2">Severity</th>
              <th className="text-right p-2">Affected</th>
              <th className="text-center p-2">Status</th>
              <th className="text-left p-2">Resources</th>
              <th className="text-center p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc) => (
              <tr key={inc.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="p-2 font-mono font-bold text-blue-400">{inc.id}</td>
                <td className="p-2 text-white font-medium max-w-[180px] truncate">{inc.title}</td>
                <td className="p-2 text-slate-400 max-w-[150px] truncate">{inc.location}</td>
                <td className="p-2 text-center">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${severityBadge[inc.severity] || ''}`}>
                    {inc.severity}
                  </span>
                </td>
                <td className="p-2 text-right font-mono font-bold text-white">{inc.affected_pop.toLocaleString()}</td>
                <td className="p-2 text-center">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusBadge[inc.status] || 'bg-slate-500/20 text-slate-400 border-slate-500/40'}`}>
                    {inc.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="p-2 text-slate-300 max-w-[140px] truncate">{inc.resources_required}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => navigate(`/incidents/${inc.id}`)}
                    className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 transition-colors"
                    title={`View ${inc.id}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
