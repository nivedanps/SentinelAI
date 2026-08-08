import React from 'react';

export const MapLegend: React.FC = () => {
  const legendItems = [
    { label: 'Critical Incident', color: 'bg-red-500 ring-red-400/40' },
    { label: 'High Incident', color: 'bg-orange-500 ring-orange-400/40' },
    { label: 'Hospital', color: 'bg-blue-500 ring-blue-400/40' },
    { label: 'Fire Station', color: 'bg-rose-600 ring-rose-400/40' },
    { label: 'Police Station', color: 'bg-purple-500 ring-purple-400/40' },
    { label: 'Shelter', color: 'bg-emerald-500 ring-emerald-400/40' },
    { label: 'Emergency Resource', color: 'bg-cyan-500 ring-cyan-400/40' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 p-2.5 px-4 bg-slate-900/90 border border-slate-800 rounded-xl text-xs">
      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
        Legend:
      </span>
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center space-x-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${item.color} ring-2`} />
          <span className="text-slate-300 font-medium text-[11px]">{item.label}</span>
        </div>
      ))}
    </div>
  );
};
