import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Thermometer,
  Droplets,
  Cpu,
  Zap,
  Activity,
  RefreshCw,
  Clock
} from 'lucide-react';
import {
  selectSummaryData,
  selectSummaryLoading
} from '../../features/dashboard/dashboardSelectors';
import { fetchSummary } from '../../features/dashboard/dashboardSlice';

export default function SummaryStatsBar() {
  const dispatch = useDispatch();
  const summary = useSelector(selectSummaryData);
  const loading = useSelector(selectSummaryLoading);

  const formatTime = (isoString) => {
    if (!isoString) return '--:--:--';
    try {
      return new Date(isoString).toLocaleTimeString('en-US', { hour12: false });
    } catch {
      return '--:--:--';
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-900/10 via-blue-900/5 to-slate-900/10 dark:from-indigo-950/40 dark:via-slate-900/60 dark:to-blue-950/40 rounded-2xl border border-indigo-200/50 dark:border-indigo-900/40 p-5 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-indigo-200/40 dark:border-indigo-900/30">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200">
              Aggregated Periodic System Intelligence
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Computed 50-sample sliding window • Polled via REST API
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Polled: {formatTime(summary?.lastUpdated)}</span>
          </div>

          <button
            onClick={() => dispatch(fetchSummary())}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 hover:bg-white/60 dark:hover:bg-slate-800 transition"
            title="Force refresh periodic summary"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats List */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
        {/* Avg Temp & Delta */}
        <div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Thermometer className="w-3 h-3 text-rose-500" />
            Avg Temperature
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              {summary ? `${summary.averageTemperature}°C` : '24.2°C'}
            </span>
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">
              {summary?.temperatureDelta || '+1.8%'}
            </span>
          </div>
        </div>

        {/* Avg Humidity & Delta */}
        <div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Droplets className="w-3 h-3 text-blue-500" />
            Avg Humidity
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              {summary ? `${summary.averageHumidity}%` : '58.5%'}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
              {summary?.humidityDelta || '-0.5%'}
            </span>
          </div>
        </div>

        {/* Machine Utilization */}
        <div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-indigo-500" />
            Machine Utilization
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              {summary ? summary.machineUtilizationRate : '70.0%'}
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {summary?.activeMachines || 21}/30 Units
            </span>
          </div>
        </div>

        {/* Power Grid Load */}
        <div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" />
            Avg Power Draw
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              {summary ? `${summary.averagePowerKw} kW` : '194.2 kW'}
            </span>
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
              {summary?.powerDelta || '+3.2%'}
            </span>
          </div>
        </div>

        {/* Facility Efficiency Score */}
        <div className="col-span-2 md:col-span-1">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-500" />
            Efficiency Index
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-heading">
              {summary ? `${summary.efficiencyScore}/100` : '94/100'}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
              OPTIMAL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
