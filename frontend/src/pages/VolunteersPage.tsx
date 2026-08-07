import React from 'react';
import { ModuleCard } from '../components/ModuleCard';
import { UserCheck } from 'lucide-react';

export const VolunteersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <ModuleCard
        moduleName="Volunteers"
        endpoint="volunteers"
        icon={UserCheck}
        description="Volunteer registration, skill-based assignment, deployment tracking, and availability management."
      />
    </div>
  );
};
