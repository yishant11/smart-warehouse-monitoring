import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  BarChart3,
  AlertTriangle,
  Settings,
  UserCheck,
  Warehouse,
  Boxes,
  Activity
} from 'lucide-react';
import { selectAlertsActiveCount } from '../../features/alerts/alertsSlice';
import LiveBadge from './LiveBadge';

export default function Sidebar({ isOpen, onClose }) {
  const activeAlertsCount = useSelector(selectAlertsActiveCount);

  const navItems = [
    {
      name: 'Dashboard Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'Analytics & Trends',
      path: '/analytics',
      icon: BarChart3,
      badge: null
    },
    {
      name: 'Alerts & Incidents',
      path: '/alerts',
      icon: AlertTriangle,
      badge: activeAlertsCount > 0 ? activeAlertsCount : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      name: 'System Settings',
      path: '/settings',
      icon: Settings,
      badge: null
    },
    {
      name: 'Profile & Session',
      path: '/profile',
      icon: UserCheck,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Warehouse className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight font-heading">
                SmartWarehouse
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                TELEMETRY OPS CLOUD
              </p>
            </div>
          </div>
        </div>

        {/* Warehouse Status Snippet */}
        <div className="px-4 py-3 mx-4 my-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 text-indigo-500" />
              Zone Matrix
            </span>
            <LiveBadge showLabel={false} />
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">
            4 Zones • 30 Telemetry Units
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 text-xs font-bold rounded-full animate-pulse ${
                          item.badgeColor || 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Session Badge */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
              AO
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                Admin Operator
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                Session Active
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
