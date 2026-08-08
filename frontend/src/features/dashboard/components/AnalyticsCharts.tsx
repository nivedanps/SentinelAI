import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import {
  IncidentTrendPoint,
  ResourceUtilizationItem,
  SeverityDistributionItem,
} from '../types/dashboard.types';

interface AnalyticsChartsProps {
  trendData: IncidentTrendPoint[];
  severityData: SeverityDistributionItem[];
  resourceData: ResourceUtilizationItem[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  trendData,
  severityData,
  resourceData,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col space-y-4">
      {/* Section Header */}
      <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
          <BarChart3 className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-white tracking-wider uppercase">
          OPERATIONAL ANALYTICS & TRENDS
        </h3>
      </div>

      {/* Grid of 3 Compact Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chart 1: 24h Incident Trend */}
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wide text-[10px]">
              24H INCIDENT TREND
            </span>
            <span className="text-[10px] font-mono text-slate-400">Past 24 hrs</span>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
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
                <Area
                  type="monotone"
                  dataKey="incidents"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorIncidents)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="critical"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorCritical)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Severity Distribution */}
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wide text-[10px]">
              SEVERITY DISTRIBUTION
            </span>
            <span className="text-[10px] font-mono text-slate-400">Current</span>
          </div>
          <div className="h-40 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={55}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    fontSize: '11px',
                    color: '#f8fafc',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Resource Utilization */}
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wide text-[10px]">
              RESOURCE DEPLOYMENT
            </span>
            <span className="text-[10px] font-mono text-slate-400">Deployed vs Available</span>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <XAxis dataKey="category" stroke="#64748b" fontSize={9} tickLine={false} />
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
                <Bar dataKey="available" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="deployed" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
