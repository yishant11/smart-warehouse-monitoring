import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Boxes, Thermometer, Droplets, Cpu } from 'lucide-react';
import { selectLiveMetrics } from '../../features/dashboard/dashboardSelectors';
import StatusBadge from '../common/StatusBadge';

export default function WarehouseZoneGrid() {
  const liveMetrics = useSelector(selectLiveMetrics);
  const zones = liveMetrics.zones || [];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
              Warehouse Zone Environmental Status
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live per-zone telemetry sensors & conveyor load
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
          4 Zones Active
        </span>
      </div>

      {/* Grid of Zones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
        {zones.map((zone, idx) => (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 hover:border-indigo-500/40 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {zone.name}
                </h4>
                <StatusBadge status={zone.status} size="sm" />
              </div>

              {/* Temperature and Humidity Pills */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    <Thermometer className="w-3 h-3 text-rose-500" />
                    <span>Temp</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                    {zone.temperature}°C
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    <span>Humidity</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                    {zone.humidity}%
                  </p>
                </div>
              </div>
            </div>

            {/* Conveyor / Robotics Load Bar */}
            <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/40">
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                <span>Conveyor Activity</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {zone.conveyorLoadPct || 70}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${zone.conveyorLoadPct || 70}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
