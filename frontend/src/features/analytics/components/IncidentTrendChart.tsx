import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { IncidentTrendPoint } from '../types/analytics.types';
import { TrendingUp } from 'lucide-react';

interface IncidentTrendChartProps {
  data: IncidentTrendPoint[];
}

export const IncidentTrendChart: React.FC<IncidentTrendChartProps> = ({ data }) => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">
              INCIDENT TREND OVER TIME
            </h3>
            <p className="text-xs text-slate-400">
              Temporal distribution of emergency incidents broken down by severity
            </p>
          </div>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          {(['24h', '7d', '30d'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                timeframe === tf ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf === '24h' ? '24 Hours' : tf === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Area type="monotone" dataKey="total" name="Total Incidents" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
            <Area type="monotone" dataKey="critical" name="Critical" stroke="#ef4444" fillOpacity={1} fill="url(#colorCritical)" strokeWidth={2} />
            <Area type="monotone" dataKey="high" name="High" stroke="#f97316" strokeWidth={1.5} fill="none" />
            <Area type="monotone" dataKey="medium" name="Medium" stroke="#f59e0b" strokeWidth={1.5} fill="none" />
            <Area type="monotone" dataKey="low" name="Low" stroke="#10b981" strokeWidth={1.5} fill="none" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
