import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectSelectedAlert,
  selectIsAlertModalOpen,
  closeAlertModal,
  acknowledgeAlert,
  resolveAlert
} from '../../features/alerts/alertsSlice';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import {
  MapPin,
  Thermometer,
  Droplets,
  Cpu,
  Zap,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useToast } from '../common/ToastContainer';

export default function AlertDetailsModal() {
  const dispatch = useDispatch();
  const alert = useSelector(selectSelectedAlert);
  const isOpen = useSelector(selectIsAlertModalOpen);
  const { addToast } = useToast();

  if (!alert) return null;

  const handleAcknowledge = async () => {
    try {
      await dispatch(acknowledgeAlert(alert.id)).unwrap();
      addToast({
        title: 'Alert Acknowledged',
        message: `Alert ${alert.id} acknowledged successfully.`,
        type: 'success'
      });
    } catch (e) {
      addToast({ title: 'Error', message: e.message, type: 'error' });
    }
  };

  const handleResolve = async () => {
    try {
      await dispatch(resolveAlert(alert.id)).unwrap();
      addToast({
        title: 'Alert Resolved',
        message: `Alert ${alert.id} marked as resolved.`,
        type: 'success'
      });
      dispatch(closeAlertModal());
    } catch (e) {
      addToast({ title: 'Error', message: e.message, type: 'error' });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeAlertModal())}
      title={`Live Event Snapshot • ${alert.id}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusBadge status={alert.severity || 'INFO'} size="md" />
            <StatusBadge status={alert.status || 'ACTIVE'} size="md" />
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {new Date(alert.timestamp).toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {alert.title}
          </h4>
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {alert.message}
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
            <span>{alert.zone}</span>
          </div>
        </div>

        {/* Telemetry values */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-rose-500" /> Temp
            </span>
            <p className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5">
              {alert.telemetrySnapshot?.temperature ?? 24.5}°C
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <Droplets className="w-3 h-3 text-blue-500" /> Humidity
            </span>
            <p className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5">
              {alert.telemetrySnapshot?.humidity ?? 58}%
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <Cpu className="w-3 h-3 text-indigo-500" /> Machines
            </span>
            <p className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5">
              {alert.telemetrySnapshot?.activeMachines ?? 21}/30
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Power
            </span>
            <p className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5">
              {alert.telemetrySnapshot?.powerKw ?? 192} kW
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2.5">
          {alert.status === 'ACTIVE' && (
            <button
              onClick={handleAcknowledge}
              className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Acknowledge</span>
            </button>
          )}

          {alert.status !== 'RESOLVED' && (
            <button
              onClick={handleResolve}
              className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark Resolved</span>
            </button>
          )}

          <button
            onClick={() => dispatch(closeAlertModal())}
            className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
