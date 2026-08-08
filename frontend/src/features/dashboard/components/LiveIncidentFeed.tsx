import React from 'react';
import { Siren, ArrowRight, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Incident } from '../../incidents/types';
import { mockLiveIncidents } from '../data/dashboardMockData';

interface LiveIncidentFeedProps {
  incidents?: Partial<Incident>[];
}

export const LiveIncidentFeed: React.FC<LiveIncidentFeedProps> = ({
  incidents = mockLiveIncidents,
}) => {
  const navigate = useNavigate();

  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'moderate':
      case 'medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
      <div>
        {/* Title Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <Siren className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">
              LIVE INCIDENT FEED
            </h3>
          </div>
          <button
            onClick={() => navigate('/incidents')}
            className="inline-flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Incident List */}
        <div className="divide-y divide-slate-800/80 mt-2">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              onClick={() => navigate(`/incidents/${inc.id}`)}
              className="py-3 px-2 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer group flex flex-col space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400 group-hover:text-blue-300">
                  {inc.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityBadge(
                    inc.severity
                  )}`}
                >
                  {inc.severity}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors leading-tight">
                {inc.title}
              </h4>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-1 truncate max-w-[200px]">
                  <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                  <span className="truncate">{inc.address}</span>
                </div>
                <div className="flex items-center space-x-1 text-[11px] font-mono text-slate-500 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>
                    {inc.created_at
                      ? `${Math.max(1, Math.round((Date.now() - new Date(inc.created_at).getTime()) / 60000))}m ago`
                      : 'Just now'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
