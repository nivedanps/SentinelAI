import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  Map,
  Truck,
  Home,
  Hospital,
  Users,
  BrainCircuit,
  CloudRain,
  PhoneCall,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Command Overview', icon: LayoutDashboard },
  { path: '/incidents', label: 'Incident Feed', icon: AlertTriangle },
  { path: '/gis-cop', label: 'Common Op Picture', icon: Map },
  { path: '/resources', label: 'Logistics Assets', icon: Truck },
  { path: '/shelters', label: 'Shelter Manager', icon: Home },
  { path: '/hospitals', label: 'Hospital Beds', icon: Hospital },
  { path: '/volunteers', label: 'Volunteer Ops', icon: Users },
  { path: '/intelligence', label: 'AI Advisory', icon: BrainCircuit },
  { path: '/weather', label: 'Weather Hazards', icon: CloudRain },
  { path: '/public-sos', label: 'Citizen Public SOS', icon: PhoneCall },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none shrink-0">
      <div className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Operational Modules
      </div>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        v1.0.0 • Hackathon MVP
      </div>
    </aside>
  );
};
