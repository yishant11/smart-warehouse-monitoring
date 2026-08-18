import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  BellRing,
  Trash2
} from 'lucide-react';
import { selectLiveEvents } from '../../features/dashboard/dashboardSelectors';
import { clearLiveEvents } from '../../features/dashboard/dashboardSlice';
import { openAlertModal } from '../../features/alerts/alertsSlice';
import StatusBadge from '../common/StatusBadge';

export default function LiveEventFeed() {
  const dispatch = useDispatch();
  const events = useSelector(selectLiveEvents);

  const getEventIcon = (type) => {
    switch (type) {
      case 'ALERT':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'RECOVERY':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'UPDATE':
      default:
        return <Activity className="w-4 h-4 text-indigo-500" />;
    }
  };

  const handleEventClick = (event) => {
    dispatch(
      openAlertModal({
        id: event.id,
        title: `${event.eventType}: ${event.status} Telemetry Update`,
        message: event.message,
        severity: event.status === 'CRITICAL' ? 'CRITICAL' : event.status === 'WARN' ? 'WARN' : 'INFO',
        zone: 'All Warehouse Monitored Zones',
        status: event.status === 'OK' ? 'RESOLVED' : 'ACTIVE',
        eventType: event.eventType,
        telemetrySnapshot: {
          temperature: event.temperature,
          humidity: event.humidity
        },
        timestamp: event.timestamp
      })
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col h-[380px]">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
              Live Real-Time Event Feed
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Continuous SSE telemetry stream
            </p>
          </div>
        </div>

        {events.length > 0 && (
          <button
            onClick={() => dispatch(clearLiveEvents())}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Clear event log"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto mt-3 space-y-2.5 pr-1">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
            <Activity className="w-8 h-8 mb-2 animate-pulse" />
            <p className="text-xs font-medium">Awaiting live event pulses from SSE stream...</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {events.slice(0, 20).map((evt) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                onClick={() => handleEventClick(evt)}
                className="group p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/40 cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {getEventIcon(evt.eventType)}
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {evt.eventType}
                    </span>
                    <StatusBadge status={evt.status} size="sm" />
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 whitespace-nowrap">
                    {new Date(evt.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                  </span>
                </div>

                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-snug truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {evt.message}
                </p>

                {(evt.temperature || evt.humidity) && (
                  <div className="mt-2 flex items-center gap-3 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <span>Temp: {evt.temperature}°C</span>
                    <span>•</span>
                    <span>Hum: {evt.humidity}%</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
