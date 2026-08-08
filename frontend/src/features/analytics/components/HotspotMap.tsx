import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { HotspotClusterItem } from '../types/analytics.types';
import { MapPin } from 'lucide-react';

interface HotspotMapProps {
  hotspots: HotspotClusterItem[];
}

const riskColors: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#f59e0b',
  LOW: '#10b981',
};

export const HotspotMap: React.FC<HotspotMapProps> = ({ hotspots }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">
              DISASTER HOTSPOT MAP
            </h3>
            <p className="text-xs text-slate-400">
              Geographic incident concentration across Karnataka emergency response zones
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[10px] font-mono">
          {Object.entries(riskColors).map(([level, color]) => (
            <div key={level} className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-slate-400">{level}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full h-[380px] rounded-xl overflow-hidden border border-slate-800 z-10">
        <MapContainer
          center={[12.55, 76.65]}
          zoom={8}
          scrollWheelZoom={true}
          className="w-full h-full"
          style={{ background: '#0b0f17' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {hotspots.map((spot) => {
            const color = riskColors[spot.risk_level] || '#3b82f6';
            const radius = Math.max(12, Math.min(spot.incident_count * 4, 30));

            return (
              <CircleMarker
                key={spot.id}
                center={[spot.lat, spot.lng]}
                radius={radius}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.35,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="p-1 text-xs space-y-1.5 min-w-[180px]">
                    <h4 className="font-bold text-sm text-slate-900">{spot.location_name}</h4>
                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      <span className="text-slate-500">Incidents:</span>
                      <span className="font-bold">{spot.incident_count}</span>
                      <span className="text-slate-500">Critical:</span>
                      <span className="font-bold text-red-600">{spot.critical_count}</span>
                      <span className="text-slate-500">Affected Pop:</span>
                      <span className="font-bold">{spot.affected_population.toLocaleString()}</span>
                      <span className="text-slate-500">Disaster Type:</span>
                      <span className="font-bold">{spot.dominant_disaster_type}</span>
                      <span className="text-slate-500">Risk Level:</span>
                      <span className="font-bold" style={{ color }}>{spot.risk_level}</span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
