import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapMarkerData } from '../types/dashboard.types';
import { MapControls, MapFilterType } from './MapControls';
import { MapLegend } from './MapLegend';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Siren, Building2, Flame, Shield, Home, Compass } from 'lucide-react';

const DEFAULT_CENTER: [number, number] = [12.55, 76.65];
const DEFAULT_ZOOM = 8;

// Component to handle smooth map center updates
const ChangeMapView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

// Create custom SVG Leaflet Marker DivIcon
function createCustomIcon(category: string, severity?: string): L.DivIcon {
  let bgColor = 'bg-blue-600';
  let pulseColor = 'bg-blue-400';
  let iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;

  if (category === 'incident') {
    if (severity === 'critical') {
      bgColor = 'bg-red-600';
      pulseColor = 'bg-red-400';
    } else if (severity === 'high') {
      bgColor = 'bg-orange-500';
      pulseColor = 'bg-orange-400';
    } else {
      bgColor = 'bg-amber-500';
      pulseColor = 'bg-amber-400';
    }
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h12M12 2v6M12 18v4M4.93 10.93l4.24 4.24M14.83 15.17l4.24-4.24"/></svg>`;
  } else if (category === 'hospital') {
    bgColor = 'bg-blue-600';
    pulseColor = 'bg-blue-400';
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v12M6 12h12"/></svg>`;
  } else if (category === 'fire_station') {
    bgColor = 'bg-rose-600';
    pulseColor = 'bg-rose-400';
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;
  } else if (category === 'police') {
    bgColor = 'bg-purple-600';
    pulseColor = 'bg-purple-400';
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
  } else if (category === 'shelter') {
    bgColor = 'bg-emerald-600';
    pulseColor = 'bg-emerald-400';
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
  } else if (category === 'resource') {
    bgColor = 'bg-cyan-600';
    pulseColor = 'bg-cyan-400';
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/></svg>`;
  }

  const html = `
    <div className="relative flex items-center justify-center">
      <div className="absolute -inset-1 rounded-full ${pulseColor} opacity-50 animate-ping"></div>
      <div className="relative w-8 h-8 rounded-full ${bgColor} border-2 border-white shadow-lg flex items-center justify-center text-white">
        ${iconSvg}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

interface OperationalMapProps {
  markers: MapMarkerData[];
}

export const OperationalMap: React.FC<OperationalMapProps> = ({ markers }) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<MapFilterType>('all');
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(DEFAULT_ZOOM);

  const filteredMarkers = markers.filter((m) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'incident') return m.category === 'incident';
    if (activeFilter === 'hospital') return m.category === 'hospital';
    if (activeFilter === 'shelter') return m.category === 'shelter';
    if (activeFilter === 'resource') return m.category === 'resource' || m.category === 'fire_station' || m.category === 'police';
    return true;
  });

  const handleRecenter = () => {
    setMapCenter([...DEFAULT_CENTER]);
    setMapZoom(DEFAULT_ZOOM);
  };

  return (
    <div className="relative flex flex-col space-y-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              OPERATIONAL MAP — KARNATAKA DISASTER ZONE
            </h2>
            <p className="text-xs text-slate-400">
              Live GIS markers for active incidents, hospitals, emergency response resources & shelters.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <MapControls
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onRecenter={handleRecenter}
      />

      {/* Map View */}
      <div className="relative w-full h-[420px] rounded-xl overflow-hidden border border-slate-800 shadow-inner z-10">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          className="w-full h-full"
          style={{ background: '#0b0f17' }}
        >
          <ChangeMapView center={mapCenter} zoom={mapZoom} />

          {/* CartoDB Dark Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {filteredMarkers.map((marker) => (
            <Marker
              key={marker.id}
              position={[marker.latitude, marker.longitude]}
              icon={createCustomIcon(marker.category, marker.severity)}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 max-w-xs text-slate-900 dark:text-slate-100">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 mb-2">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      {marker.incidentId || marker.id}
                    </span>
                    {marker.severity && (
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          marker.severity === 'critical'
                            ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/40'
                            : marker.severity === 'high'
                            ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/40'
                            : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {marker.severity}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {marker.title}
                  </h4>

                  {marker.details && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {marker.details}
                    </p>
                  )}

                  {marker.affectedPopulation && (
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold">Affected Pop:</span>{' '}
                      {marker.affectedPopulation.toLocaleString()}
                    </div>
                  )}

                  {marker.occupied && (
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold">Status:</span> {marker.occupied}
                    </div>
                  )}

                  {marker.timestamp && (
                    <div className="mt-1 text-[10px] text-slate-400 font-mono">
                      {marker.timestamp}
                    </div>
                  )}

                  {marker.incidentId && (
                    <button
                      onClick={() => navigate(`/incidents/${marker.incidentId}`)}
                      className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow transition-colors"
                    >
                      <span>View Incident</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Map Legend Footer */}
      <MapLegend />
    </div>
  );
};
