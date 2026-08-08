import React from 'react';
import { Activity, Radio, Truck, Home, ShieldCheck, AlertCircle } from 'lucide-react';
import { ResponseActivityItem } from '../types/dashboard.types';

interface ResponseActivityProps {
  activities?: ResponseActivityItem[];
}

export const ResponseActivity: React.FC<ResponseActivityProps> = ({ activities = [] }) => {
  const getActivityIcon = (type: ResponseActivityItem['type']) => {
    switch (type) {
      case 'dispatch':
        return <Truck className="w-3.5 h-3.5 text-blue-400" />;
      case 'shelter':
        return <Home className="w-3.5 h-3.5 text-emerald-400" />;
      case 'assignment':
        return <Radio className="w-3.5 h-3.5 text-purple-400" />;
      case 'verification':
        return <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />;
      case 'alert':
        return <AlertCircle className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">
              LIVE RESPONSE ACTIVITY
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Timeline Log</span>
        </div>

        {/* Timeline List */}
        <div className="relative pl-6 mt-4 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {activities.map((act) => (
            <div key={act.id} className="relative flex items-start space-x-3 text-xs">
              {/* Timeline Bullet Node */}
              <div className="absolute -left-6 top-0.5 p-1 rounded-full bg-slate-900 border border-slate-700 shadow">
                {getActivityIcon(act.type)}
              </div>

              <div className="flex-1 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <p className="text-slate-200 font-medium leading-snug">{act.description}</p>
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 ml-2 flex-shrink-0">
                  {act.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
