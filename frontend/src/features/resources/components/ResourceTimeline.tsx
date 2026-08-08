import React from 'react';
import { Activity, Navigation, Radio, CheckCircle, PlusCircle, Wrench } from 'lucide-react';
import { ResourceActivityItem } from '../types/resource.types';

interface ResourceTimelineProps {
  activities: ResourceActivityItem[];
}

export const ResourceTimeline: React.FC<ResourceTimelineProps> = ({ activities }) => {
  const getIcon = (action: ResourceActivityItem['action']) => {
    switch (action) {
      case 'deployed':
        return <Navigation className="w-3.5 h-3.5 text-blue-400" />;
      case 'assigned':
        return <Radio className="w-3.5 h-3.5 text-purple-400" />;
      case 'released':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
      case 'maintenance':
        return <Wrench className="w-3.5 h-3.5 text-orange-400" />;
      case 'created':
        return <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">
              DEPLOYMENT ACTIVITY TIMELINE
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Live Asset Audit & Event Log
            </span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-slate-400">Real-Time Feed</span>
      </div>

      {/* Timeline */}
      <div className="relative pl-6 mt-4 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {activities.map((act) => (
          <div key={act.id} className="relative flex items-start space-x-3 text-xs">
            <div className="absolute -left-6 top-0.5 p-1 rounded-full bg-slate-900 border border-slate-700 shadow">
              {getIcon(act.action)}
            </div>

            <div className="flex-1 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="font-mono font-bold text-blue-400 mr-2">
                  {act.resourceId}
                </span>
                <span className="text-slate-200 font-medium">{act.details}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 self-start sm:self-auto flex-shrink-0">
                {act.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
