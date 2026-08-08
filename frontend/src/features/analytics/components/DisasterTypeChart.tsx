import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DisasterTypeItem } from '../types/analytics.types';
import { Flame } from 'lucide-react';

interface DisasterTypeChartProps {
  data: DisasterTypeItem[];
}

export const DisasterTypeChart: React.FC<DisasterTypeChartProps> = ({ data }) => {
  const [sortBy, setSortBy] = useState<'incident_count' | 'affected_population' | 'critical_count'>(
    'incident_count'
  );

  const sortedData = [...data].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">
              DISASTER TYPE ANALYSIS
            </h3>
            <p className="text-xs text-slate-400">Categorical breakdown of active emergency events</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-slate-400 font-mono uppercase">SORT BY:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1 text-xs focus:outline-none font-mono"
          >
            <option value="incident_count">Incident Count</option>
            <option value="affected_population">Affected Population</option>
            <option value="critical_count">Critical Incidents</option>
          </select>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis dataKey="disaster_type" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={120} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                fontSize: '12px',
              }}
            />
            <Bar dataKey={sortBy} fill="#3b82f6" radius={[0, 6, 6, 0]}>
              {sortedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : index === 1 ? '#f97316' : '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
