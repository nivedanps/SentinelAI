import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Incident, Resource, Shelter, Hospital } from '../../types';

// Fix default leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  incidents?: Incident[];
  resources?: Resource[];
  shelters?: Shelter[];
  hospitals?: Hospital[];
  onIncidentSelect?: (incident: Incident) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center = [12.9716, 77.5946], // Default center (Bengaluru)
  zoom = 12,
  incidents = [],
  resources = [],
  shelters = [],
  hospitals = [],
  onIncidentSelect,
}) => {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[400px]"
      >
        {/* OpenStreetMap Dark CartoDB Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Incident Markers & Hazard Radius Circles */}
        {incidents.map((incident) => {
          const [lng, lat] = incident.location.coordinates;
          const isCritical = incident.severity_score >= 7.0;

          return (
            <React.Fragment key={incident.id}>
              {isCritical && (
                <Circle
                  center={[lat, lng]}
                  radius={1000} // 1km hazard radius
                  pathOptions={{
                    color: '#ef4444',
                    fillColor: '#ef4444',
                    fillOpacity: 0.2,
                    weight: 1.5,
                  }}
                />
              )}
              <Marker
                position={[lat, lng]}
                eventHandlers={{
                  click: () => onIncidentSelect?.(incident),
                }}
              >
                <Popup>
                  <div className="p-1 max-w-xs">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-slate-100 text-sm">{incident.title}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCritical
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        SEV {incident.severity_score}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2 mb-2">
                      {incident.description}
                    </p>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Category: {incident.category} • Status: {incident.status}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        {/* Resource Markers */}
        {resources.map((res) => {
          const [lng, lat] = res.current_location.coordinates;
          return (
            <Marker key={res.id} position={[lat, lng]}>
              <Popup>
                <div className="p-1">
                  <div className="font-bold text-sm text-sky-400">{res.name}</div>
                  <div className="text-xs text-slate-300">
                    Type: {res.type} | Qty: {res.quantity}
                  </div>
                  <div className="text-[10px] text-slate-400">Status: {res.status}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Shelter Markers */}
        {shelters.map((shelter) => {
          const [lng, lat] = shelter.location.coordinates;
          return (
            <Marker key={shelter.id} position={[lat, lng]}>
              <Popup>
                <div className="p-1">
                  <div className="font-bold text-sm text-emerald-400">{shelter.name}</div>
                  <div className="text-xs text-slate-300">
                    Occupancy: {shelter.capacity_current} / {shelter.capacity_total} (
                    {shelter.occupancy_percentage}%)
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold mt-1">
                    Status: {shelter.status_label}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Hospital Markers */}
        {hospitals.map((hospital) => {
          const [lng, lat] = hospital.location.coordinates;
          return (
            <Marker key={hospital.id} position={[lat, lng]}>
              <Popup>
                <div className="p-1">
                  <div className="font-bold text-sm text-indigo-400">{hospital.name}</div>
                  <div className="text-xs text-slate-300">
                    ICU Beds Available: {hospital.available_icu_beds}
                  </div>
                  <div className="text-xs text-slate-300">
                    General Beds: {hospital.available_general_beds}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Oxygen: {hospital.oxygen_status}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
