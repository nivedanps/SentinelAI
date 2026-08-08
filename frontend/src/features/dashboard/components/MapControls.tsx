import React from 'react';
import { MapMarkerCategory } from '../types/dashboard.types';
import { RotateCcw } from 'lucide-react';

export type MapFilterType = 'all' | 'incident' | 'hospital' | 'resource' | 'shelter';

interface MapControlsProps {
  activeFilter: MapFilterType;
  onFilterChange: (filter: MapFilterType) => void;
  onRecenter: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  activeFilter,
  onFilterChange,
  onRecenter,
}) => {
  const filters: { id: MapFilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'incident', label: 'Incidents' },
    { id: 'hospital', label: 'Hospitals' },
    { id: 'resource', label: 'Emergency Resources' },
    { id: 'shelter', label: 'Shelters' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-900/90 border border-slate-800 rounded-xl">
      <div className="flex flex-wrap items-center gap-1.5">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <button
        onClick={onRecenter}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
        title="Recenter map view on Karnataka"
      >
        <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
        <span>Recenter Map</span>
      </button>
    </div>
  );
};
