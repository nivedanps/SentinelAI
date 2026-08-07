import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { IncidentForm } from '../features/incidents/IncidentForm';
import { useIncident, useIncidentMutations } from '../features/incidents/hooks';
import type { IncidentInput } from '../features/incidents/types';

export const IncidentEditPage: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: incident, isLoading, isError, error } = useIncident(id);
  const { update } = useIncidentMutations();

  const handleSubmit = async (payload: IncidentInput) => {
    await update.mutateAsync({ id, payload });
    navigate(`/incidents/${id}`);
  };

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />;
  }

  if (isError || !incident) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/30">
        <p className="font-semibold text-red-700 dark:text-red-300">Incident not found</p>
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error instanceof Error ? error.message : 'Unable to load incident.'}</p>
        <Link to="/incidents" className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline">Return to list</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to={`/incidents/${id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to incident
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Edit Incident</h1>
        <p className="mt-1 text-sm text-slate-500">Update incident details, status, and impact information.</p>
      </div>

      {update.isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {update.error instanceof Error ? update.error.message : 'Failed to update incident.'}
        </div>
      )}

      <IncidentForm incident={incident} busy={update.isPending} onSubmit={handleSubmit} />
    </div>
  );
};
