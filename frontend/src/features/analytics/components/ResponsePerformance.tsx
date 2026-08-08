import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ResponsePerformanceData } from '../types/analytics.types';
import { Timer } from 'lucide-react';

interface ResponsePerformanceProps {
  data: ResponsePerformanceData;
}

export const ResponsePerformance: React.FC<ResponsePerformanceProps> = ({ data }) => {
  const slaCards = [
    { label: 'Avg Response', value: data.avg_response_time, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
    { label: 'Avg Verification', value: data.avg_verification_time, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
    { label: 'Avg Assignment', value: data.avg_assignment_time, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' },
    { label: 'Avg Resolution', value: data.avg_resolution_time, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
        <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
          <Timer className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider uppercase">RESPONSE PERFORMANCE</h3>
          <p className="text-xs text-slate-400">SLA compliance & response time benchmarks</p>
        </div>
      </div>

      {/* SLA Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {slaCards.map((card, i) => (
          <div key={i} className={`p-3 rounded-xl border ${card.bg}`}>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">{card.label}</div>
            <div className={`text-lg font-extrabold font-mono mt-1 ${card.color}`}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Period Comparison Chart */}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.performance_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
            <Bar dataKey="response_time" name="Response (min)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={14} />
            <Bar dataKey="resolution_time" name="Resolution (min)" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
