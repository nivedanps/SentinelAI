import React from 'react';
import { ModuleCard } from '../components/ModuleCard';
import { FileText } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <ModuleCard
        moduleName="Reports"
        endpoint="reports"
        icon={FileText}
        description="Automated reporting engine, situational summaries, PDF generation, and compliance documentation."
      />
    </div>
  );
};
