import React, { useState } from 'react';
import { AlertTriangle, Filter, Plus, Search, MapPin, Cpu } from 'lucide-react';
import { Incident } from '../../types';

const MOCK_FEED: Incident[] = [
  {
    id: 'inc-101',
    title: 'Flash Flood Submerged Highway 44',
    description: 'Road impassable due to 4ft water logging. 2 vehicles stranded.',
    category: 'FLOOD',
    status: 'REPORTED',
    severity_score: 7.8,
    location: { type: 'Point', coordinates: [77.59, 12.97] },
    address_metadata: { district: 'Central', block: 'Highway 44', landmark: 'Mile 12' },
    created_at: '2026-08-07T14:30:00Z',
    ai_analysis: { urgency: 'HIGH', summary: 'Severe road obstruction requiring rescue boat.' },
  },
  {
    id: 'inc-102',
    title: 'Transformer Fire near City Hospital',
    description: 'Electrical transformer caught fire. Thick smoke drifting toward ICU wing.',
    category: 'FIRE',
    status: 'VERIFIED',
    severity_score: 8.9,
    location: { type: 'Point', coordinates: [77.61, 12.94] },
    address_metadata: { district: 'East', block: 'Hospital Road', landmark: 'City Hospital' },
    created_at: '2026-08-07T14:42:00Z',
    ai_analysis: { urgency: 'CRITICAL', summary: 'Hospital proximity hazard.' },
  },
];

export const IncidentFeedPage: React.FC = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" /> Incident Triage Stream
          </h1>
          <p className="text-xs text-slate-400">Real-time incoming distress signals and fused clusters</p>
        </div>
        <button className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-colors">
          <Plus className="w-4 h-4" /> Report New Incident
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search incident title, location, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
        <button className="px-3 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-lg flex items-center gap-2 border border-slate-700 hover:bg-slate-700">
          <Filter className="w-3.5 h-3.5" /> Filter Category
        </button>
      </div>

      {/* Incident Cards Feed */}
      <div className="space-y-3">
        {MOCK_FEED.map((inc) => (
          <div
            key={inc.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all hover:shadow-lg flex flex-col md:flex-row justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-rose-500/20 border border-rose-500/30 text-rose-400 font-mono text-[10px] font-bold rounded">
                  SEV {inc.severity_score}
                </span>
                <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-semibold rounded">
                  {inc.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(inc.created_at || '').toLocaleTimeString()}
                </span>
              </div>

              <h3 className="font-bold text-slate-100 text-base">{inc.title}</h3>
              <p className="text-xs text-slate-300 line-clamp-2">{inc.description}</p>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{inc.address_metadata?.landmark}, {inc.address_metadata?.district}</span>
              </div>
            </div>

            <div className="flex flex-col justify-between items-end gap-3 shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                <Cpu className="w-3.5 h-3.5" />
                <span>{inc.ai_analysis?.urgency} Urgency</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-md transition-colors">
                  Verify & Merge
                </button>
                <button className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-md shadow-md transition-colors">
                  Dispatch Unit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
