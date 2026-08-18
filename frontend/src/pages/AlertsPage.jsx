import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertOctagon,
  Info,
  MapPin,
  Clock,
  ChevronRight,
  ShieldCheck,
  PlusCircle,
  RefreshCw
} from 'lucide-react';
import {
  fetchAlerts,
  setAlertFilters,
  resetAlertFilters,
  openAlertDrawer
} from '../features/alerts/alertsSlice';
import {
  selectAlerts,
  selectAlertFilters,
  selectAlertsLoading,
  selectAlertsActiveCount,
  selectAlertsCriticalCount,
  selectAlertsTotal
} from '../features/alerts/alertsSlice';
import StatusBadge from '../components/common/StatusBadge';

export default function AlertsPage() {
  const dispatch = useDispatch();
  const alerts = useSelector(selectAlerts);
  const filters = useSelector(selectAlertFilters);
  const loading = useSelector(selectAlertsLoading);
  const activeCount = useSelector(selectAlertsActiveCount);
  const criticalCount = useSelector(selectAlertsCriticalCount);
  const total = useSelector(selectAlertsTotal);

  useEffect(() => {
    dispatch(fetchAlerts(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (key, value) => {
    dispatch(setAlertFilters({ [key]: value }));
  };

  const handleAlertClick = (alert) => {
    dispatch(openAlertDrawer(alert));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Metric Pills */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            Alerts, Incidents & Telemetry Watchdog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Automated threshold anomalies, equipment diagnostics and operational alarms
          </p>
        </div>

        {/* Counter Summary Pills */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-400">
            <p className="text-[10px] font-bold uppercase tracking-wider">Critical Alarms</p>
            <p className="text-lg font-bold font-mono">{criticalCount}</p>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400">
            <p className="text-[10px] font-bold uppercase tracking-wider">Active Total</p>
            <p className="text-lg font-bold font-mono">{activeCount}</p>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            <p className="text-[10px] font-bold uppercase tracking-wider">All Incidents</p>
            <p className="text-lg font-bold font-mono">{total}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, zone, or keywords..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Dropdowns & Sorting */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Severity Filter */}
          <select
            value={filters.severity}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="WARN">Warnings</option>
            <option value="INFO">Info</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          {/* Sort By */}
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="timestamp">Sort: Newest First</option>
            <option value="severity">Sort: Highest Severity</option>
          </select>

          <button
            onClick={() => dispatch(resetAlertFilters())}
            className="p-2 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition font-medium"
            title="Reset Filters"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Alerts Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading && alerts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm flex flex-col items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-500 mb-2" />
            <span>Fetching alert database...</span>
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No matching incidents found</h4>
            <p className="text-xs text-slate-500 mt-1">All warehouse subsystems are operating within target parameters.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <AnimatePresence>
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => handleAlertClick(alert)}
                  className="p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="mt-0.5 flex-shrink-0">
                      {alert.severity === 'CRITICAL' ? (
                        <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          <AlertOctagon className="w-5 h-5" />
                        </div>
                      ) : alert.severity === 'WARN' ? (
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          <Info className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                          {alert.id}
                        </span>
                        <StatusBadge status={alert.severity} size="sm" />
                        <StatusBadge status={alert.status} size="sm" />
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {alert.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {alert.message}
                      </p>

                      <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-indigo-400" />
                          {alert.zone}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition hidden sm:inline">
                      Inspect Telemetry
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
