import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { RiskTrendPoint } from '../types/analytics.types';
import { TrendingUp } from 'lucide-react';

interface RiskTrendProps {
  data: RiskTrendPoint[];
}

const riskLevelColor = (level: string): string => {
  switch (level) {
    case 'CRITICAL': return '#ef4444';
    case 'HIGH': return '#f97316';
    case 'MEDIUM': return '#f59e0b';
    default: return '#10b981';
  }
};

export const RiskTrend: React.FC<RiskTrendProps> = ({ data }) => {
  const latest = data.length > 0 ? data[data.length - 1] : null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">OPERATIONAL RISK TREND</h3>
            <p className="text-xs text-slate-400">Deterministic composite risk score over time</p>
          </div>
        </div>
        {latest && (
          <div className="text-right">
            <div className="text-2xl font-extrabold font-mono" style={{ color: riskLevelColor(latest.level) }}>
              {latest.score}
            </div>
            <div className="text-[10px] font-mono font-bold uppercase" style={{ color: riskLevelColor(latest.level) }}>
              {latest.level}
            </div>
          </div>
        )}
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }}
            />
            <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'CRITICAL', fill: '#ef4444', fontSize: 10, position: 'right' }} />
            <ReferenceLine y={60} stroke="#f97316" strokeDasharray="3 3" label={{ value: 'HIGH', fill: '#f97316', fontSize: 10, position: 'right' }} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#f97316"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#f97316', stroke: '#0f172a', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
