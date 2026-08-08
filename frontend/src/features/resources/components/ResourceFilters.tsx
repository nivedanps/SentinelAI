import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface ResourceFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  agency: string;
  onAgencyChange: (val: string) => void;
  availability: string;
  onAvailabilityChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
  onReset: () => void;
}

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  agency,
  onAgencyChange,
  availability,
  onAvailabilityChange,
  sortBy,
  onSortByChange,
  onReset,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Resource ID, Name, Agency, or Location..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 self-end md:self-auto">
          <button
            onClick={() =>
              onAvailabilityChange(availability === 'available_only' ? 'all' : 'available_only')
            }
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
              availability === 'available_only'
                ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            Available Only
          </button>

          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-800/80">
        {/* Category */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="Emergency Vehicles">Emergency Vehicles</option>
            <option value="Rescue Equipment">Rescue Equipment</option>
            <option value="Personnel">Personnel</option>
            <option value="Supplies">Supplies</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="DEPLOYED">DEPLOYED</option>
            <option value="RESERVED">RESERVED</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
            <option value="UNAVAILABLE">UNAVAILABLE</option>
            <option value="LOST">LOST</option>
          </select>
        </div>

        {/* Agency */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
            Agency
          </label>
          <select
            value={agency}
            onChange={(e) => onAgencyChange(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Agencies</option>
            <option value="Health Department">Health Department</option>
            <option value="Fire Department">Fire Department</option>
            <option value="Police Department">Police Department</option>
            <option value="NDRF">NDRF</option>
            <option value="SDRF">SDRF</option>
            <option value="Municipal Corporation">Municipal Corporation</option>
            <option value="Indian Red Cross">Indian Red Cross</option>
            <option value="Civil Defense Volunteers">Civil Defense Volunteers</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="updated_at">Last Updated</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
            <option value="name">Resource Name</option>
          </select>
        </div>
      </div>
    </div>
  );
};
