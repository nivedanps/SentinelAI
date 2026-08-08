import React from 'react';
import { BarChart3, RefreshCw, Download, Filter } from 'lucide-react';
import { AnalyticsFilterState } from '../types/analytics.types';

interface AnalyticsHeaderProps {
  filters: AnalyticsFilterState;
  onFilterChange: (updated: Partial<AnalyticsFilterState>) => void;
  onRefresh: () => void;
  onExport: () => void;
  isRefreshing?: boolean;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  filters,
  onFilterChange,
  onRefresh,
  onExport,
  isRefreshing = false,
}) => {
  return (
    <div className="space-y-4 border-b border-slate-800 pb-5">
      {/* Title & Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-wide">
              OPERATIONAL INTELLIGENCE & ANALYTICS
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Disaster trends, response performance, resource utilization and risk intelligence
            </p>
          </div>
        </div>

        {/* Date Range Selector & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Pills */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            {(['24h', '7d', '30d', 'custom'] as const).map((range) => (
              <button
                key={range}
                onClick={() => onFilterChange({ dateRange: range })}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  filters.dateRange === range
                    ? 'bg-blue-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range === '24h'
                  ? 'Last 24 Hours'
                  : range === '7d'
                  ? 'Last 7 Days'
                  : range === '30d'
                  ? 'Last 30 Days'
                  : 'Custom'}
              </button>
            ))}
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={onExport}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Secondary Filter Controls */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center space-x-1.5 text-slate-400 font-mono text-[11px] uppercase mr-1">
          <Filter className="w-3.5 h-3.5 text-blue-400" />
          <span>Filters:</span>
        </div>

        {/* Disaster Type */}
        <select
          value={filters.disasterType}
          onChange={(e) => onFilterChange({ disasterType: e.target.value })}
          className="bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Disaster Types</option>
          <option value="FLOOD">Flood</option>
          <option value="FIRE">Fire / Industrial</option>
          <option value="LANDSLIDE">Landslide</option>
          <option value="HAZMAT">Hazmat</option>
        </select>

        {/* Severity */}
        <select
          value={filters.severity}
          onChange={(e) => onFilterChange({ severity: e.target.value })}
          className="bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        {/* Location */}
        <select
          value={filters.location}
          onChange={(e) => onFilterChange({ location: e.target.value })}
          className="bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Locations (Karnataka)</option>
          <option value="Mysuru">Mysuru Sector</option>
          <option value="Bengaluru">Bengaluru Sector</option>
          <option value="Mandya">Mandya Corridor</option>
          <option value="Kodagu">Kodagu Belt</option>
        </select>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="REPORTED">Reported</option>
          <option value="VERIFIED">Verified</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>
    </div>
  );
};
