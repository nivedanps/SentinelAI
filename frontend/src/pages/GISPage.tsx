import React from 'react';
import { ModuleCard } from '../components/ModuleCard';
import { Map } from 'lucide-react';

export const GISPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <ModuleCard
        moduleName="GIS Mapping"
        endpoint="gis"
        icon={Map}
        description="Geospatial intelligence, interactive Leaflet mapping, zone analysis, and spatial resource overlays."
      />
    </div>
  );
};
