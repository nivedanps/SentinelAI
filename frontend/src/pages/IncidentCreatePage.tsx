import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { IncidentForm } from '../features/incidents/IncidentForm';
import { useIncidentMutations } from '../features/incidents/hooks';
import type { IncidentInput } from '../features/incidents/types';

export const IncidentCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { create } = useIncidentMutations();

  const handleSubmit = async (payload: IncidentInput) => {
    const incident = await create.mutateAsync(payload);
    navigate(`/incidents/${incident.id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link to="/incidents" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to incidents
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Create Incident</h1>
        <p className="mt-1 text-sm text-slate-500">Submit a new disaster incident report for review and coordination.</p>
      </div>

      {create.isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {create.error instanceof Error ? create.error.message : 'Failed to create incident.'}
        </div>
      )}

      <IncidentForm busy={create.isPending} onSubmit={handleSubmit} />
    </div>
  );
};
