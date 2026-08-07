import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Siren,
  Boxes,
  Home,
  UserCheck,
  CloudSun,
  Bot,
  Map,
  FileText,
  Bell,
  BarChart3,
  Users,
  Lock,
  ShieldAlert,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Incidents', path: '/incidents', icon: Siren },
  { name: 'Resources', path: '/resources', icon: Boxes },
  { name: 'Shelters', path: '/shelters', icon: Home },
  { name: 'Volunteers', path: '/volunteers', icon: UserCheck },
  { name: 'Weather', path: '/weather', icon: CloudSun },
  { name: 'AI Engine', path: '/ai', icon: Bot },
  { name: 'GIS Mapping', path: '/gis', icon: Map },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Users', path: '/users', icon: Users },
  { name: 'Auth / Login', path: '/login', icon: Lock },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-wider">
                Sentinel<span className="text-blue-500">AI</span>
              </span>
              <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                Disaster Platform
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Platform Modules
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-500 flex items-center justify-between">
          <span>Version 1.0.0</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
            Vite / React 19
          </span>
        </div>
      </aside>
    </>
  );
};
