import React from 'react';
import { ShieldAlert, Check, MapPin, Clock, Eye } from 'lucide-react';
import { CriticalAlertItem } from '../types/dashboard.types';
import { useNavigate } from 'react-router-dom';

interface CriticalAlertsProps {
  alerts: CriticalAlertItem[];
  onAcknowledge: (id: string) => void;
}

export const CriticalAlerts: React.FC<CriticalAlertsProps> = ({ alerts, onAcknowledge }) => {
  const navigate = useNavigate();

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'high':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
      default:
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">
              CRITICAL ALERTS
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
            {alerts.filter((a) => !a.acknowledged).length} UNACKNOWLEDGED
          </span>
        </div>

        {/* Alerts List */}
        <div className="space-y-2.5 mt-3">
          {alerts.map((alert) => {
            const isAck = alert.acknowledged;

            return (
              <div
                key={alert.id}
                className={`p-3 rounded-xl border transition-all ${
                  isAck
                    ? 'bg-slate-950/40 border-slate-800 opacity-60'
                    : getSeverityStyle(alert.severity)
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide border ${
                          alert.severity === 'critical'
                            ? 'bg-red-500/20 text-red-300 border-red-500/40'
                            : 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {alert.title}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-3 mt-1.5 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {alert.location}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-slate-500">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    {!isAck ? (
                      <button
                        onClick={() => onAcknowledge(alert.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold transition-all"
                        title="Acknowledge alert"
                      >
                        <Check className="w-3 h-3" />
                        <span>Ack</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800">
                        <Check className="w-3 h-3" />
                        Acked
                      </span>
                    )}

                    <button
                      onClick={() => navigate('/incidents')}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                      title="View details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
