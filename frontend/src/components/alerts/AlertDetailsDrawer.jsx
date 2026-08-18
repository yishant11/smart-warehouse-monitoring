import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectSelectedAlert,
  selectIsAlertDrawerOpen,
  closeAlertDrawer,
  acknowledgeAlert,
  resolveAlert
} from '../../features/alerts/alertsSlice';
import Drawer from '../common/Drawer';
import StatusBadge from '../common/StatusBadge';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Thermometer,
  Droplets,
  Cpu,
  Zap,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useToast } from '../common/ToastContainer';

export default function AlertDetailsDrawer() {
  const dispatch = useDispatch();
  const alert = useSelector(selectSelectedAlert);
  const isOpen = useSelector(selectIsAlertDrawerOpen);
  const { addToast } = useToast();
  const [notes, setNotes] = useState('');

  if (!alert) return null;

  const handleAcknowledge = async () => {
    try {
      await dispatch(acknowledgeAlert(alert.id)).unwrap();
      addToast({
        title: 'Alert Acknowledged',
        message: `Alert ${alert.id} has been acknowledged by Admin Operator.`,
        type: 'success'
      });
    } catch (e) {
      addToast({ title: 'Action Failed', message: e.message, type: 'error' });
    }
  };

  const handleResolve = async () => {
    try {
      await dispatch(resolveAlert(alert.id)).unwrap();
      addToast({
        title: 'Alert Resolved',
        message: `Alert ${alert.id} marked as resolved. Systems restored.`,
        type: 'success'
      });
    } catch (e) {
      addToast({ title: 'Action Failed', message: e.message, type: 'error' });
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => dispatch(closeAlertDrawer())}
      title={`Incident Details • ${alert.id}`}
      width="max-w-lg"
    >
      <div className="space-y-6">
        {/* Header Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusBadge status={alert.severity} size="lg" />
            <StatusBadge status={alert.status} size="lg" />
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {new Date(alert.timestamp).toLocaleString()}
          </span>
        </div>

        {/* Title and Message */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <h4 className="text-base font-bold text-slate-900 dark:text-white font-heading">
            {alert.title}
          </h4>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {alert.message}
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <MapPin className="w-4 h-4 text-indigo-500" />
            <span>{alert.zone}</span>
          </div>
        </div>

        {/* Telemetry Snapshot at Occurrence */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Telemetry Snapshot At Trigger Time
          </h5>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Thermometer className="w-4 h-4 text-rose-500" />
                <span>Recorded Temp</span>
              </div>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">
                {alert.telemetrySnapshot?.temperature ?? 27.5}°C
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span>Recorded Humidity</span>
              </div>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">
                {alert.telemetrySnapshot?.humidity ?? 62}%
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Cpu className="w-4 h-4 text-indigo-500" />
                <span>Active Machines</span>
              </div>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">
                {alert.telemetrySnapshot?.activeMachines ?? 20}/30
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Power Draw</span>
              </div>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1">
                {alert.telemetrySnapshot?.powerKw ?? 198.4} kW
              </p>
            </div>
          </div>
        </div>

        {/* Audit / Operator Log */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40 space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Audit Trail
          </h5>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p>• Generated by: <span className="font-semibold text-indigo-600 dark:text-indigo-400">Automated Sensor Watchdog</span></p>
            {alert.acknowledgedBy && (
              <p>• Acknowledged by: <span className="font-semibold">{alert.acknowledgedBy}</span> ({new Date(alert.acknowledgedAt).toLocaleTimeString()})</p>
            )}
            {alert.resolvedAt && (
              <p>• Resolved at: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{new Date(alert.resolvedAt).toLocaleTimeString()}</span></p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
          {alert.status === 'ACTIVE' && (
            <button
              onClick={handleAcknowledge}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Acknowledge Alert</span>
            </button>
          )}

          {alert.status !== 'RESOLVED' && (
            <button
              onClick={handleResolve}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-500/20 transition"
            >
              <Check className="w-4 h-4" />
              <span>Mark As Resolved</span>
            </button>
          )}
        </div>
      </div>
    </Drawer>
  );
}
