import React from 'react';
import { Boxes, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ResourceReadinessItem } from '../types/dashboard.types';

interface ResourceReadinessProps {
  resources?: ResourceReadinessItem[];
}

export const ResourceReadiness: React.FC<ResourceReadinessProps> = ({ resources = [] }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: ResourceReadinessItem['status']) => {
    switch (status) {
      case 'critical':
        return { bar: 'bg-red-500', badge: 'bg-red-500/20 text-red-300 border-red-500/30' };
      case 'limited':
        return { bar: 'bg-amber-500', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      default:
        return { bar: 'bg-emerald-500', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Boxes className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">
              RESOURCE READINESS
            </h3>
          </div>
          <button
            onClick={() => navigate('/resources')}
            className="inline-flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline gap-1"
          >
            <span>View Resources</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Resource Items Grid */}
        <div className="space-y-3 mt-3">
          {resources.map((item) => {
            const percentage = Math.round((item.available / item.total) * 100);
            const style = getStatusColor(item.status);

            return (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{item.name}</span>
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="text-slate-300 font-bold">
                      {item.available} / {item.total} available
                    </span>
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded uppercase border ${style.badge}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${style.bar} transition-all duration-300 rounded-full`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
