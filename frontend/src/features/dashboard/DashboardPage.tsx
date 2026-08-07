import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  Truck,
  Home,
  Hospital,
  Activity,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { LeafletMap } from '../../components/map/LeafletMap';
import { Incident } from '../../types';

// Mock initial data for hackathon demo
const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'inc-1',
    title: 'Urban Flash Flood - Sector 4',
    description: 'Heavy rainfall caused acute waterlogging with 15 houses submerged.',
    category: 'FLOOD',
    status: 'IN_PROGRESS',
    severity_score: 8.5,
    location: { type: 'Point', coordinates: [77.5946, 12.9716] },
    ai_analysis: {
      urgency: 'HIGH',
      extracted_needs: ['BOATS', 'RESCUE', 'FOOD'],
      damage_score: 7.5,
      summary: 'Critical urban flooding requiring boat evacuation.',
    },
  },
  {
    id: 'inc-2',
    title: 'Commercial Building Structural Collapse',
    description: '3-story commercial structure partially collapsed after gas explosion.',
    category: 'BUILDING_COLLAPSE',
    status: 'REPORTED',
    severity_score: 9.0,
    location: { type: 'Point', coordinates: [77.6101, 12.9352] },
    ai_analysis: {
      urgency: 'CRITICAL',
      extracted_needs: ['RESCUE', 'MEDICAL', 'HEAVY_MACHINERY'],
      damage_score: 9.2,
      summary: 'Severe structural failure with potential trapped victims.',
    },
  },
];

export const DashboardPage: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-rose-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Active Incidents
              </p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-1">14</h3>
              <p className="text-xs text-rose-400 mt-1 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> 3 critical unassigned
              </p>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-sky-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Deployed Assets
              </p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-1">28 / 35</h3>
              <p className="text-xs text-sky-400 mt-1 font-medium">80% pool utilization</p>
            </div>
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
              <Truck className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Shelter Occupancy
              </p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-1">1,240</h3>
              <p className="text-xs text-emerald-400 mt-1 font-medium">5 active camps open</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Home className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                ICU Beds Open
              </p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-1">18</h3>
              <p className="text-xs text-indigo-400 mt-1 font-medium">Across 4 hospitals</p>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Hospital className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Command Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[650px]">
        {/* Interactive GIS Canvas */}
        <div className="lg:col-span-2 flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" /> Common Operational Picture (COP) Map
            </h2>
            <span className="text-xs text-slate-400 font-mono">2dsphere Spatial Indexing</span>
          </div>
          <div className="flex-1 w-full h-full min-h-[450px]">
            <LeafletMap
              incidents={MOCK_INCIDENTS}
              onIncidentSelect={(inc) => setSelectedIncident(inc)}
            />
          </div>
        </div>

        {/* AI Tactical Decision Support Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-slate-100">Antigravity AI Decision Engine</h3>
              <p className="text-[11px] text-slate-400">Live operational advisory stream</p>
            </div>
          </div>

          {selectedIncident ? (
            <div className="space-y-4 flex-1 overflow-y-auto">
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                <div className="text-xs text-slate-400 uppercase font-semibold">Selected Incident</div>
                <div className="text-sm font-bold text-slate-100 mt-1">{selectedIncident.title}</div>
                <div className="text-xs text-rose-400 font-mono mt-0.5">
                  Severity Score: {selectedIncident.severity_score} / 10
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Extracted Needs
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedIncident.ai_analysis?.extracted_needs?.map((need) => (
                    <span
                      key={need}
                      className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold rounded-md"
                    >
                      {need}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Recommended Priorities
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="p-2 bg-slate-800 rounded border-l-2 border-amber-400">
                    Dispatch 2 Search & Rescue Boats from Sector 3 Depot.
                  </li>
                  <li className="p-2 bg-slate-800 rounded border-l-2 border-rose-500">
                    Notify St. John Hospital ICU unit for incoming triage intake.
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <ShieldCheck className="w-12 h-12 mb-3 text-slate-700 stroke-1" />
              <p className="text-xs font-medium">
                Click on any incident marker on the Leaflet map to inspect AI analysis and dispatch recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
