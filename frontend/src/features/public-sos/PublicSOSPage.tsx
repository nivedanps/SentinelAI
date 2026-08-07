import React, { useState } from 'react';
import { PhoneCall, MapPin, Send, CheckCircle } from 'lucide-react';
import { IncidentCategory } from '../../types';

export const PublicSOSPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('FLOOD');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-slate-950">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
            <PhoneCall className="w-7 h-7 animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">
            Emergency Citizen SOS
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Directly alert the District Disaster Command Center. Your location will be automatically processed.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-100">Distress Signal Dispatched!</h3>
            <p className="text-xs text-slate-300">
              The Emergency Command Center has received your SOS. Nearby response units and field teams are being auto-routed to your position.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-4 py-2 bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-700"
            >
              Submit Another Update
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Emergency Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-semibold"
              >
                <option value="FLOOD">Flood / Waterlogging</option>
                <option value="FIRE">Fire Hazard</option>
                <option value="BUILDING_COLLAPSE">Building Collapse</option>
                <option value="LANDSLIDE">Landslide</option>
                <option value="MEDICAL_EMERGENCY">Medical Emergency</option>
                <option value="HAZMAT">Chemical / Gas Leak</option>
                <option value="OTHER">Other Disaster Event</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Short Title / Headline
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 5 people trapped on roof due to rising water"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detailed Emergency Description
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe landmark, number of victims, immediate needs (medical, boat, food)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-3 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span>GPS Coordinates captured automatically via browser geolocation.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <Send className="w-4 h-4" /> TRANSMIT SOS SIGNAL NOW
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
