import React from 'react';
import { ModuleCard } from '../components/ModuleCard';
import { Boxes } from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <ModuleCard
        moduleName="Resources"
        endpoint="resources"
        icon={Boxes}
        description="Multi-agency resource inventory, allocation tracking, supply chain logistics, and demand forecasting."
      />
    </div>
  );
};
