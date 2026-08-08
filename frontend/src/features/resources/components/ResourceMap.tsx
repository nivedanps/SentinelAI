import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { EmergencyResource } from '../types/resource.types';
import { MapPin, RotateCcw, ExternalLink } from 'lucide-react';
import { ResourceStatusBadge } from './ResourceStatusBadge';

const DEFAULT_CENTER: [number, number] = [12.55, 76.65];
const DEFAULT_ZOOM = 8;

const ChangeMapView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

function createResourceIcon(status: string, category: string): L.DivIcon {
  let bgColor = 'bg-emerald-600';
  let pulseColor = 'bg-emerald-400';
  let iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;

  if (status === 'DEPLOYED') {
    bgColor = 'bg-blue-600';
    pulseColor = 'bg-blue-400';
  } else if (status === 'RESERVED') {
    bgColor = 'bg-amber-500';
    pulseColor = 'bg-amber-400';
  } else if (status === 'MAINTENANCE') {
    bgColor = 'bg-orange-500';
    pulseColor = 'bg-orange-400';
  } else if (status === 'UNAVAILABLE' || status === 'LOST') {
    bgColor = 'bg-red-600';
    pulseColor = 'bg-red-400';
  }

  if (category === 'Emergency Vehicles') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`;
  } else if (category === 'Rescue Equipment') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
  } else if (category === 'Personnel') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
  } else if (category === 'Supplies') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>`;
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
    className: 'custom-resource-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

interface ResourceMapProps {
  resources: EmergencyResource[];
  onSelectResource?: (resource: EmergencyResource) => void;
  onAssignResource?: (resource: EmergencyResource) => void;
}

export const ResourceMap: React.FC<ResourceMapProps> = ({
  resources,
  onSelectResource,
  onAssignResource,
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(DEFAULT_ZOOM);

  const handleRecenter = () => {
    setMapCenter([...DEFAULT_CENTER]);
    setMapZoom(DEFAULT_ZOOM);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase">
              LIVE RESOURCE POSITION MAP
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Geographic Deployment & Stationing Locations
            </span>
          </div>
        </div>

        <button
          onClick={handleRecenter}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
          <span>Recenter Map</span>
        </button>
      </div>

      {/* Map Container */}
      <div className="w-full h-[380px] rounded-xl overflow-hidden border border-slate-800 shadow-inner z-10 relative">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          className="w-full h-full"
          style={{ background: '#0b0f17' }}
        >
          <ChangeMapView center={mapCenter} zoom={mapZoom} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {resources.map((res) => (
            <Marker
              key={res.id}
              position={[res.latitude, res.longitude]}
              icon={createResourceIcon(res.status, res.category)}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 max-w-xs text-slate-900 dark:text-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      {res.resource_id}
                    </span>
                    <ResourceStatusBadge status={res.status} />
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {res.name}
                  </h4>

                  <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 font-mono">
                    <div>
                      <span className="font-semibold text-slate-400">Agency:</span>{' '}
                      {res.organization_agency}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-400">Location:</span>{' '}
                      {res.location_name}
                    </div>
                    {res.capacity && (
                      <div>
                        <span className="font-semibold text-slate-400">Capacity:</span>{' '}
                        {res.capacity}
                      </div>
                    )}
                    {res.assigned_incident_title && (
                      <div className="text-blue-600 dark:text-blue-400 font-bold">
                        Assigned to: {res.assigned_incident_title}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => onSelectResource?.(res)}
                      className="flex-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    {res.status === 'AVAILABLE' && onAssignResource && (
                      <button
                        onClick={() => onAssignResource(res)}
                        className="flex-1 px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold transition-colors"
                      >
                        Assign
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
