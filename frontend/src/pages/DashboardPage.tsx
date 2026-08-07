import React from 'react';
import { ModuleCard } from '../components/ModuleCard';
import { LayoutDashboard } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <ModuleCard
        moduleName="Dashboard"
        endpoint="dashboard"
        icon={LayoutDashboard}
        description="Executive situational awareness dashboard, live telemetry, metrics, and incident summaries."
      />
    </div>
  );
};
