import React from 'react';
import { Home, ArrowRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShelterOperationItem } from '../types/dashboard.types';

interface ShelterOperationsProps {
  activeShelters?: number;
  totalCapacity?: number;
  occupied?: number;
  available?: number;
  utilizationPercentage?: number;
  shelters?: ShelterOperationItem[];
}

export const ShelterOperations: React.FC<ShelterOperationsProps> = ({
  activeShelters = 12,
  totalCapacity = 4500,
  occupied = 3240,
  available = 1260,
  utilizationPercentage = 72,
  shelters = [],
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Home className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">
              SHELTER OPERATIONS
            </h3>
          </div>
          <button
            onClick={() => navigate('/shelters')}
            className="inline-flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline gap-1"
          >
            <span>View Shelters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Capacity Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-center">
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">ACTIVE</span>
            <span className="text-lg font-bold text-white">{activeShelters}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">CAPACITY</span>
            <span className="text-lg font-bold text-white">{totalCapacity.toLocaleString()}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="block text-[10px] font-bold text-amber-400 uppercase">OCCUPIED</span>
            <span className="text-lg font-bold text-amber-400">{occupied.toLocaleString()}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="block text-[10px] font-bold text-emerald-400 uppercase">AVAILABLE</span>
            <span className="text-lg font-bold text-emerald-400">{available.toLocaleString()}</span>
          </div>
        </div>

        {/* Utilization Bar */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Overall Utilization</span>
            <span className="font-bold text-amber-400 font-mono">{utilizationPercentage}% occupied</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 rounded-full transition-all duration-300"
              style={{ width: `${utilizationPercentage}%` }}
            />
          </div>
        </div>

        {/* High Capacity Warnings */}
        <div className="mt-4 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Capacity Alerts
          </span>
          {shelters
            .filter((s) => s.isHighCapacity)
            .map((shelter) => {
              const occPercent = Math.round((shelter.occupied / shelter.capacity) * 100);
              return (
                <div
                  key={shelter.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-white">{shelter.code}</span>
                      <span className="text-slate-300 ml-1.5">{shelter.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-amber-400">{occPercent}% occupied</span>
                    <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      HIGH CAPACITY
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
