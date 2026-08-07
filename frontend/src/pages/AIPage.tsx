import React from 'react';
import { ModuleCard } from '../components/ModuleCard';
import { Bot } from 'lucide-react';

export const AIPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <ModuleCard
        moduleName="AI Engine"
        endpoint="ai"
        icon={Bot}
        description="Predictive threat analytics, NLP-driven intelligence extraction, anomaly detection, and risk scoring."
      />
    </div>
  );
};
