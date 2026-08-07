import React from 'react';
import { ModuleCard } from '../components/ModuleCard';
import { Users } from 'lucide-react';

export const UsersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <ModuleCard
        moduleName="Users"
        endpoint="users"
        icon={Users}
        description="User management, role-based permissions, organization hierarchy, and audit logging."
      />
    </div>
  );
};
