import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users } from 'lucide-react';
import { IncidentStatusBadge } from './IncidentStatusBadge';
import type { Incident } from './types';
import { formatLabel } from './utils';

export const IncidentCard: React.FC<{ incident: Incident }> = ({ incident }) => (
  <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold">{incident.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{incident.description}</p>
      </div>
      <IncidentStatusBadge value={incident.severity} />
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      <IncidentStatusBadge value={incident.current_status} />
      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-300">
        {formatLabel(incident.disaster_type)}
      </span>
    </div>

    <dl className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
      {incident.address && (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0" />
          <dd className="truncate">{incident.address}</dd>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 shrink-0" />
        <dd>{incident.affected_population.toLocaleString()} affected</dd>
      </div>
    </dl>

    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
      <time className="text-xs text-slate-500">{new Date(incident.created_at).toLocaleString()}</time>
      <Link to={`/incidents/${incident.id}`} className="text-sm font-semibold text-blue-600 hover:underline">
        View details
      </Link>
    </div>
  </article>
);
