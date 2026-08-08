import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ResourceStatusData } from '../types/analytics.types';
import { Package } from 'lucide-react';

interface ResourceUtilizationProps {
  data: ResourceStatusData;
}

const statusColors: Record<string, string> = {
  AVAILABLE: '#10b981',
  DISPATCHED: '#3b82f6',
  RESERVED: '#f59e0b',
  MAINTENANCE: '#6366f1',
  UNAVAILABLE: '#64748b',
};

export const ResourceUtilization: React.FC<ResourceUtilizationProps> = ({ data }) => {
  const pieData = Object.entries(data.status_breakdown).map(([status, count]) => ({
    name: status,
    value: count,
    color: statusColors[status] || '#64748b',
  }));

  const totalResources = Object.values(data.status_breakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
        <div className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider uppercase">RESOURCE UTILIZATION</h3>
          <p className="text-xs text-slate-400">Emergency resource deployment status & category allocation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Donut */}
        <div className="flex flex-col items-center">
          <div className="h-44 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-white font-mono">{totalResources}</span>
              <span className="text-[10px] text-slate-400 font-mono">TOTAL</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center space-x-1.5 text-[10px]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-400 font-mono">{item.name}: <span className="text-white font-bold">{item.value}</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Bars */}
        <div className="space-y-3">
          {data.category_allocations.map((cat) => {
            const pct = cat.total > 0 ? Math.round((cat.deployed / cat.total) * 100) : 0;
            return (
              <div key={cat.type}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">{cat.type}</span>
                  <span className="text-slate-400 font-mono">{cat.deployed} / {cat.total} <span className="text-blue-400">({pct}%)</span></span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: pct > 85 ? '#ef4444' : pct > 65 ? '#f59e0b' : '#3b82f6',
                    }}
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
