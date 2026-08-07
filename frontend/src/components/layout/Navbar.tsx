import React from 'react';
import { ShieldAlert, Bell, User, LogOut, Radio } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-500 animate-pulse">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-slate-100 text-lg tracking-tight flex items-center gap-2">
            Disaster Intelligence
            <span className="text-xs bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <Radio className="w-3 h-3 animate-ping" /> LIVE COP
            </span>
          </h1>
          <p className="text-xs text-slate-400">Emergency Operations Command Platform</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
        </button>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-slate-200">{user.full_name}</div>
              <div className="text-xs text-rose-400 font-mono">{user.role}</div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors">
              Sign In
            </button>
            <button className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-md transition-colors shadow-lg shadow-rose-600/20">
              Submit SOS
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
