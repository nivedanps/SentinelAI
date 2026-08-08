import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SourceAnalyticsItem } from '../types/analytics.types';
import { Radio } from 'lucide-react';

interface SourceAnalyticsProps {
  sources: SourceAnalyticsItem[];
}

export const SourceAnalytics: React.FC<SourceAnalyticsProps> = ({ sources }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
        <div className="p-2 rounded-xl bg-teal-600/20 text-teal-400 border border-teal-500/30">
          <Radio className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider uppercase">MULTI-SOURCE ANALYTICS</h3>
          <p className="text-xs text-slate-400">Report volume & verification rates by intelligence source</p>
        </div>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sources} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="source_name" stroke="#64748b" tick={{ fontSize: 11 }} width={100} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
            <Bar dataKey="report_count" name="Reports" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={10} />
            <Bar dataKey="verified_count" name="Verified" fill="#10b981" radius={[0, 4, 4, 0]} barSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Confidence table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] font-mono font-bold text-slate-400 uppercase border-b border-slate-800">
              <th className="text-left p-1.5">Source</th>
              <th className="text-right p-1.5">Reports</th>
              <th className="text-right p-1.5">Verified</th>
              <th className="text-right p-1.5">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.source_name} className="border-b border-slate-800/50">
                <td className="p-1.5 text-white font-medium">{s.source_name}</td>
                <td className="p-1.5 text-right font-mono text-slate-300">{s.report_count}</td>
                <td className="p-1.5 text-right font-mono text-emerald-400">{s.verified_count}</td>
                <td className="p-1.5 text-right font-mono">
                  <span className={s.confidence_pct >= 95 ? 'text-emerald-400' : s.confidence_pct >= 90 ? 'text-blue-400' : 'text-amber-400'}>
                    {s.confidence_pct}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
