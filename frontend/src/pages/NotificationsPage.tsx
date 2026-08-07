import React from 'react';
import { ModuleCard } from '../components/ModuleCard';
import { Bell } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <ModuleCard
        moduleName="Notifications"
        endpoint="notifications"
        icon={Bell}
        description="Multi-channel alert dispatching, SMS/email integration, escalation chains, and notification history."
      />
    </div>
  );
};
