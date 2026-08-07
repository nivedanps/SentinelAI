import React from 'react';
import { useForm } from 'react-hook-form';
import type { Incident, IncidentInput } from './types';
import { formatLabel } from './utils';

const disasters = ['flood', 'fire', 'earthquake', 'cyclone', 'landslide', 'industrial_accident', 'chemical_leak', 'road_accident', 'medical_emergency', 'other'];
const severities = ['low', 'moderate', 'high', 'critical'];
const statuses = ['reported', 'under_review', 'verified', 'in_progress', 'resolved', 'closed'];
const reporters = ['citizen', 'first_responder', 'government_agency', 'ngo', 'sensor', 'other'];
const verifications = ['unverified', 'pending', 'verified', 'rejected'];

const defaults: IncidentInput = { title: '', description: '', disaster_type: 'flood', severity: 'moderate', confidence_score: 0, latitude: 0, longitude: 0, address: '', affected_population: 0, casualties: 0, injuries: 0, infrastructure_damage: '', reporter_type: 'citizen', source: 'manual', verification_status: 'unverified', current_status: 'reported', status: 'active' };
const labels: Record<string, string> = { industrial_accident: 'Industrial Accident', chemical_leak: 'Chemical Leak', road_accident: 'Road Accident', medical_emergency: 'Medical Emergency', under_review: 'Under Review', in_progress: 'In Progress', first_responder: 'First Responder', government_agency: 'Government Agency' };
const readable = (value: string) => labels[value] ?? formatLabel(value);
const selectClass = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800';

export const IncidentForm: React.FC<{ incident?: Incident; busy?: boolean; onSubmit: (data: IncidentInput) => void }> = ({ incident, busy, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<IncidentInput>({ defaultValues: incident ?? defaults });
  const field = (label: string, name: keyof IncidentInput, options: Record<string, unknown> = {}) => <label className="block text-sm font-medium">{label}<input {...register(name, options)} className={selectClass} />{errors[name] && <span className="mt-1 block text-xs text-red-500">{String(errors[name]?.message)}</span>}</label>;
  const menu = (label: string, name: keyof IncidentInput, items: string[]) => <label className="block text-sm font-medium">{label}<select {...register(name)} className={selectClass}>{items.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></label>;
  return <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
    <div className="grid gap-4 md:grid-cols-2">{field('Title', 'title', { required: 'Title is required', minLength: { value: 3, message: 'Use at least 3 characters' } })}{menu('Disaster Type', 'disaster_type', disasters)}
      <label className="block text-sm font-medium md:col-span-2">Description<textarea {...register('description', { required: 'Description is required', minLength: { value: 10, message: 'Use at least 10 characters' } })} rows={5} className={selectClass} />{errors.description && <span className="mt-1 block text-xs text-red-500">{errors.description.message}</span>}</label>
      {menu('Severity', 'severity', severities)}{menu('Incident Status', 'current_status', statuses)}{menu('Reporter Type', 'reporter_type', reporters)}{menu('Verification Status', 'verification_status', verifications)}
      {field('Latitude', 'latitude', { valueAsNumber: true, min: { value: -90, message: 'Minimum is -90' }, max: { value: 90, message: 'Maximum is 90' } })}{field('Longitude', 'longitude', { valueAsNumber: true, min: { value: -180, message: 'Minimum is -180' }, max: { value: 180, message: 'Maximum is 180' } })}
      <label className="block text-sm font-medium md:col-span-2">Address<input {...register('address')} className={selectClass} /></label>
      {field('Affected Population', 'affected_population', { valueAsNumber: true, min: 0 })}{field('Casualties', 'casualties', { valueAsNumber: true, min: 0 })}{field('Injuries', 'injuries', { valueAsNumber: true, min: 0 })}{field('Infrastructure Damage', 'infrastructure_damage')}
    </div>
    <div className="flex justify-end"><button disabled={busy} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">{busy ? 'Saving…' : incident ? 'Save Changes' : 'Create Incident'}</button></div>
  </form>;
};
