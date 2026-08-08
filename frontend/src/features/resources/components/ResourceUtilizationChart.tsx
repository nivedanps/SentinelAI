import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import { ResourceOverviewMetrics } from '../types/resource.types';

interface ResourceUtilizationChartProps {
  metrics: ResourceOverviewMetrics;
}

export const ResourceUtilizationChart: React.FC<ResourceUtilizationChartProps> = ({
  metrics,
}) => {
  const chartData = [
    { name: 'Available', value: metrics.available, color: '#10b981' },
    { name: 'Deployed', value: metrics.deployed, color: '#3b82f6' },
    { name: 'Reserved', value: metrics.reserved, color: '#f59e0b' },
    { name: 'Maintenance', value: metrics.maintenance, color: '#f97316' },
    { name: 'Unavailable', value: metrics.unavailable, color: '#ef4444' },
  ];

  return (
    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase">
              RESOURCE UTILIZATION & STATUS
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Operational Fleet Allocation Breakdown
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="block text-sm font-extrabold text-blue-400 font-mono">
            {metrics.deploymentPercentage}%
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">
            Currently Deployed
          </span>
        </div>
      </div>

      {/* Deployment Bar Gauge */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-mono">
          <span className="text-slate-400">Deployment Ratio</span>
          <span className="text-blue-400 font-bold">
            {metrics.deployed} of {metrics.total} units active
          </span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
            style={{ width: `${metrics.deploymentPercentage}%` }}
          />
        </div>
      </div>

      {/* Recharts Bar Breakdown */}
      <div className="h-36 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.5rem',
                fontSize: '11px',
                color: '#f8fafc',
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
