import React from 'react';
import { ShieldAlert, Users, Building, Navigation, Activity, Package, CloudRain } from 'lucide-react';
import { RiskAssessmentBreakdown } from '../types/ai.types';

interface RiskAssessmentPanelProps {
  riskBreakdown?: RiskAssessmentBreakdown;
}

export const defaultRiskBreakdown: RiskAssessmentBreakdown = {
  overall_level: 'CRITICAL',
  overall_score: 88.5,
  population_risk: {
    level: 'HIGH',
    explanation: '3,200 people are within the affected flood zone perimeter.',
  },
  infrastructure_risk: {
    level: 'HIGH',
    explanation: 'Mysuru-Mandya highway bridge & electrical substation 3 impacted.',
  },
  access_risk: {
    level: 'HIGH',
    explanation: 'Two major access corridors are restricted due to water inundation.',
  },
  medical_risk: {
    level: 'MEDIUM',
    explanation: 'Hospital capacity remains available; 12 flood injuries treated.',
  },
  resource_risk: {
    level: 'HIGH',
    explanation: 'Rescue inflatable boat availability is below projected demand.',
  },
  weather_risk: {
    level: 'CRITICAL',
    explanation: 'Torrential 82mm rainfall logging over Kaveri river basin.',
  },
  factor_breakdown: {
    severity_factor: 28.0,
    population_factor: 22.5,
    infrastructure_factor: 20.0,
    access_factor: 15.0,
    resource_shortage_factor: 5.0,
  },
  explanation:
    'Population factor: 22.5, Severity factor: 28.0, Infrastructure factor: 20.0, Access factor: 15.0, Resource shortage: 5.0. Total Score: 88.5/100 (CRITICAL).',
};

export const RiskAssessmentPanel: React.FC<RiskAssessmentPanelProps> = ({
  riskBreakdown = defaultRiskBreakdown,
}) => {
  const categories = [
    { key: 'Population Risk', icon: Users, data: riskBreakdown.population_risk },
    { key: 'Infrastructure Risk', icon: Building, data: riskBreakdown.infrastructure_risk },
    { key: 'Access Risk', icon: Navigation, data: riskBreakdown.access_risk },
    { key: 'Medical Risk', icon: Activity, data: riskBreakdown.medical_risk },
    { key: 'Resource Risk', icon: Package, data: riskBreakdown.resource_risk },
    { key: 'Weather Risk', icon: CloudRain, data: riskBreakdown.weather_risk },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wider uppercase">
              DETERMINISTIC RISK ASSESSMENT
            </h3>
            <p className="text-xs text-slate-400">
              Multi-parameter mathematical risk scoring without LLM intervention
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-mono">DETERMINISTIC SCORE:</span>
          <span className="px-3 py-1 rounded-xl text-sm font-extrabold font-mono bg-red-500/20 text-red-400 border border-red-500/30">
            {riskBreakdown.overall_score} / 100 ({riskBreakdown.overall_level})
          </span>
        </div>
      </div>

      {/* Numerical Factor Breakdown Banner */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300">
        <span className="text-blue-400 font-bold uppercase tracking-wider block mb-1">
          DETERMINISTIC FACTOR CALCULATION:
        </span>
        <p className="text-slate-300 leading-relaxed font-sans text-xs">
          {riskBreakdown.explanation}
        </p>
      </div>

      {/* Risk Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(({ key, icon: Icon, data }) => (
          <div
            key={key}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                    {key}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded border ${getLevelColor(
                    data.level
                  )}`}
                >
                  {data.level}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">{data.explanation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
