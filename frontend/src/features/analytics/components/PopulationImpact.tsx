import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PopulationImpactData } from '../types/analytics.types';
import { Users, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

interface PopulationImpactProps {
  data: PopulationImpactData;
}

export const PopulationImpact: React.FC<PopulationImpactProps> = ({ data }) => {
  const cards = [
    { title: 'TOTAL AFFECTED', value: data.total_affected.toLocaleString(), icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
    { title: 'EVACUATION REQUIRED', value: data.evacuation_required.toLocaleString(), icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
    { title: 'EVACUATED', value: data.evacuated.toLocaleString(), icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    { title: 'REMAINING AT RISK', value: data.remaining_at_risk.toLocaleString(), icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
        <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider uppercase">POPULATION IMPACT</h3>
          <p className="text-xs text-slate-400">Affected civilian population & evacuation progress</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className={`p-3 rounded-xl border ${c.bg}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">{c.title}</span>
                <Icon className={`w-3.5 h-3.5 ${c.color}`} />
              </div>
              <div className={`text-lg font-extrabold font-mono mt-1 ${c.color}`}>{c.value}</div>
            </div>
          );
        })}
      </div>

      <div className="h-48 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAffected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorEvacuated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }} />
            <Area type="monotone" dataKey="affected" name="Affected" stroke="#a855f7" fill="url(#colorAffected)" strokeWidth={2} />
            <Area type="monotone" dataKey="evacuated" name="Evacuated" stroke="#10b981" fill="url(#colorEvacuated)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
