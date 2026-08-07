import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Menu, Bell, Shield, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const getPageTitle = (path: string) => {
    const cleanPath = path.replace('/', '');
    if (!cleanPath) return 'Dashboard';
    return cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between">
        {/* Left Section: Menu Toggle & Title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 capitalize">
              {getPageTitle(location.pathname)}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              SentinelAI Enterprise Operations Control
            </p>
          </div>
        </div>

        {/* Center Search Bar Placeholder */}
        <div className="hidden md:flex items-center w-72 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-400 text-xs">
          <Search className="w-4 h-4 mr-2 text-slate-400" />
          <span>Search modules, alerts, resources...</span>
        </div>

        {/* Right Controls: Dark Mode Toggle & Indicators */}
        <div className="flex items-center space-x-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Notifications Placeholder */}
          <div className="relative">
            <button className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
          </div>

          {/* User Profile Badge Placeholder */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              SA
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                Operator Admin
              </span>
              <span className="inline-flex items-center text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                <Shield className="w-2.5 h-2.5 mr-0.5" />
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
