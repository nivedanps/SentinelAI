import React from 'react';
import { ModuleCard } from '../components/ModuleCard';
import { Lock } from 'lucide-react';

export const AuthPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <ModuleCard
        moduleName="Auth"
        endpoint="auth"
        icon={Lock}
        description="Authentication, JWT session management, RBAC access policies, and identity verification."
      />
    </div>
  );
};
