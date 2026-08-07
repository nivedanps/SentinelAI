import React from 'react';
import { ModuleCard } from '../components/ModuleCard';
import { BarChart3 } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <ModuleCard
        moduleName="Analytics"
        endpoint="analytics"
        icon={BarChart3}
        description="Data visualization, trend analysis, Recharts-powered dashboards, and operational KPIs."
      />
    </div>
  );
};
