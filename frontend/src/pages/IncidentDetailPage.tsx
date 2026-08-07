import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Archive, ArrowLeft, Pencil, RotateCcw, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '../features/incidents/ConfirmDialog';
import { IncidentStatusBadge } from '../features/incidents/IncidentStatusBadge';
import { useIncident, useIncidentMutations } from '../features/incidents/hooks';
import { formatLabel } from '../features/incidents/utils';

type DialogAction = 'delete' | 'archive' | 'restore' | null;

const DetailField: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
    <dd className="mt-1 text-sm font-medium">{value}</dd>
  </div>
);

export const IncidentDetailPage: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: incident, isLoading, isError, error } = useIncident(id);
  const { archive, remove, restore } = useIncidentMutations();
  const [dialog, setDialog] = useState<DialogAction>(null);

  const busy = archive.isPending || remove.isPending || restore.isPending;

  const handleConfirm = async () => {
    if (!id || !dialog) return;
    if (dialog === 'delete') {
      await remove.mutateAsync(id);
      navigate('/incidents');
      return;
    }
    if (dialog === 'archive') {
      await archive.mutateAsync(id);
    }
    if (dialog === 'restore') {
      await restore.mutateAsync(id);
    }
    setDialog(null);
  };

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />;
  }

  if (isError || !incident) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/30">
        <p className="font-semibold text-red-700 dark:text-red-300">Incident not found</p>
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error instanceof Error ? error.message : 'Unable to load incident details.'}</p>
        <Link to="/incidents" className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline">Return to list</Link>
      </div>
    );
  }

  const dialogCopy = {
    delete: { title: 'Delete incident', message: 'This will soft-delete the incident. It can be restored later.', confirmLabel: 'Delete' },
    archive: { title: 'Archive incident', message: 'Archived incidents are hidden from default list views.', confirmLabel: 'Archive' },
    restore: { title: 'Restore incident', message: 'This will restore the incident to active status.', confirmLabel: 'Restore' },
  }[dialog ?? 'delete'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link to="/incidents" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to incidents
          </Link>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">{incident.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <IncidentStatusBadge value={incident.severity} />
            <IncidentStatusBadge value={incident.current_status} />
            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {formatLabel(incident.disaster_type)}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/incidents/${incident.id}/edit`} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
          {incident.is_deleted ? (
            <button type="button" onClick={() => setDialog('restore')} className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-950/30">
              <RotateCcw className="h-4 w-4" />
              Restore
            </button>
          ) : (
            <>
              <button type="button" onClick={() => setDialog('archive')} className="inline-flex items-center gap-2 rounded-lg border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 dark:border-amber-900 dark:text-amber-300 dark:hover:bg-amber-950/30">
                <Archive className="h-4 w-4" />
                Archive
              </button>
              <button type="button" onClick={() => setDialog('delete')} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/30">
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300">{incident.description}</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailField label="Verification" value={<IncidentStatusBadge value={incident.verification_status} />} />
          <DetailField label="Reporter Type" value={formatLabel(incident.reporter_type)} />
          <DetailField label="Record Status" value={formatLabel(incident.status)} />
          <DetailField label="Source" value={incident.source} />
          <DetailField label="Confidence Score" value={`${Math.round(incident.confidence_score * 100)}%`} />
          <DetailField label="Reported" value={new Date(incident.created_at).toLocaleString()} />
          <DetailField label="Last Updated" value={new Date(incident.updated_at).toLocaleString()} />
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">Location & Impact</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailField label="Latitude" value={incident.latitude} />
          <DetailField label="Longitude" value={incident.longitude} />
          <DetailField label="Address" value={incident.address || 'Not provided'} />
          <DetailField label="Affected Population" value={incident.affected_population.toLocaleString()} />
          <DetailField label="Casualties" value={incident.casualties.toLocaleString()} />
          <DetailField label="Injuries" value={incident.injuries.toLocaleString()} />
          <DetailField label="Infrastructure Damage" value={incident.infrastructure_damage || 'Not reported'} />
        </dl>
      </section>

      {dialog && (
        <ConfirmDialog
          title={dialogCopy.title}
          message={dialogCopy.message}
          confirmLabel={dialogCopy.confirmLabel}
          busy={busy}
          onConfirm={handleConfirm}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
};
