import React from 'react';
import { ModuleCard } from '../components/ModuleCard';
import { CloudSun } from 'lucide-react';

export const WeatherPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <ModuleCard
        moduleName="Weather"
        endpoint="weather"
        icon={CloudSun}
        description="Live meteorological feeds, severe weather alerts, forecast analysis, and environmental monitoring."
      />
    </div>
  );
};
