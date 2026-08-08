import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { SeverityDistributionItem } from '../types/analytics.types';
import { PieChart as PieIcon } from 'lucide-react';

interface SeverityDistributionProps {
  data: SeverityDistributionItem[];
  onSelectSeverity?: (severity: string) => void;
}

export const SeverityDistribution: React.FC<SeverityDistributionProps> = ({
  data,
  onSelectSeverity,
}) => {
  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <PieIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">
              SEVERITY DISTRIBUTION
            </h3>
            <p className="text-xs text-slate-400">Incident breakdown by threat level</p>
          </div>
        </div>
      </div>

      <div className="h-56 relative w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="count"
              onClick={(entry) => onSelectSeverity && onSelectSeverity(entry.severity)}
              className="cursor-pointer"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-white font-mono">{total}</span>
          <span className="text-[10px] text-slate-400 font-mono uppercase">TOTAL</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
        {data.map((item) => (
          <button
            key={item.severity}
            onClick={() => onSelectSeverity && onSelectSeverity(item.severity)}
            className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-xs transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-semibold text-slate-300">{item.severity}</span>
            </div>
            <span className="font-mono font-bold text-white">{item.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
