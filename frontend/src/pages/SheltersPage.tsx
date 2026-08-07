import React from 'react';
import { ModuleCard } from '../components/ModuleCard';
import { Home } from 'lucide-react';

export const SheltersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <ModuleCard
        moduleName="Shelters"
        endpoint="shelters"
        icon={Home}
        description="Emergency shelter registry, capacity monitoring, occupancy tracking, and intake management."
      />
    </div>
  );
};
