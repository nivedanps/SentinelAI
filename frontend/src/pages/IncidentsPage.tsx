import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, List, Plus, Siren } from 'lucide-react';
import { IncidentCard } from '../features/incidents/IncidentCard';
import { IncidentFilters } from '../features/incidents/IncidentFilters';
import { IncidentPagination } from '../features/incidents/IncidentPagination';
import { IncidentTable } from '../features/incidents/IncidentTable';
import { useIncidents } from '../features/incidents/hooks';
import type { IncidentFilters as FilterValues } from '../features/incidents/types';

const LoadingState = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="h-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
    ))}
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/30">
    <p className="font-semibold text-red-700 dark:text-red-300">Unable to load incidents</p>
    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{message}</p>
  </div>
);

const EmptyState = () => (
  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
    <Siren className="mx-auto h-10 w-10 text-slate-400" />
    <h3 className="mt-4 text-lg font-semibold">No incidents found</h3>
    <p className="mt-2 text-sm text-slate-500">Adjust your filters or create a new incident report.</p>
    <Link to="/incidents/new" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
      <Plus className="h-4 w-4" />
      Create Incident
    </Link>
  </div>
);

export const IncidentsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterValues>({});
  const [view, setView] = useState<'table' | 'cards'>('table');
  const { data, isLoading, isError, error } = useIncidents(page, filters);

  const handleFilterChange = (next: FilterValues) => {
    setFilters(next);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Incidents</h1>
          <p className="mt-1 text-sm text-slate-500">Track, filter, and manage disaster incident reports.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setView('table')}
              aria-pressed={view === 'table'}
              className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-semibold ${view === 'table' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
              <List className="h-4 w-4" />
              Table
            </button>
            <button
              type="button"
              onClick={() => setView('cards')}
              aria-pressed={view === 'cards'}
              className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-semibold ${view === 'cards' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
            >
              <LayoutGrid className="h-4 w-4" />
              Cards
            </button>
          </div>
          <Link to="/incidents/new" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            New Incident
          </Link>
        </div>
      </div>

      <IncidentFilters value={filters} onChange={handleFilterChange} />

      {isLoading && <LoadingState />}
      {isError && <ErrorState message={error instanceof Error ? error.message : 'An unexpected error occurred.'} />}
      {!isLoading && !isError && data && data.items.length === 0 && <EmptyState />}
      {!isLoading && !isError && data && data.items.length > 0 && (
        <>
          {view === 'table' ? <IncidentTable items={data.items} /> : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.items.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
          )}
          <IncidentPagination page={data.page} totalPages={data.total_pages} total={data.total} onChange={setPage} />
        </>
      )}
    </div>
  );
};
