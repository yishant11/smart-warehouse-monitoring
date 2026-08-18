import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, Check } from 'lucide-react';

export default function StatusBadge({ status = 'OK', size = 'sm', className = '' }) {
  const norm = (status || 'OK').toUpperCase();

  const configs = {
    OK: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
      icon: CheckCircle2,
      label: 'OK'
    },
    NOMINAL: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
      icon: CheckCircle2,
      label: 'NOMINAL'
    },
    WARN: {
      bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
      icon: AlertTriangle,
      label: 'WARN'
    },
    CRITICAL: {
      bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60',
      icon: AlertOctagon,
      label: 'CRITICAL'
    },
    INFO: {
      bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/60',
      icon: Info,
      label: 'INFO'
    },
    ACTIVE: {
      bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60',
      icon: AlertOctagon,
      label: 'ACTIVE'
    },
    ACKNOWLEDGED: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60',
      icon: CheckCircle2,
      label: 'ACKNOWLEDGED'
    },
    RESOLVED: {
      bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      icon: Check,
      label: 'RESOLVED'
    }
  };

  const current = configs[norm] || configs.OK;
  const Icon = current.icon;
  const sizeClasses = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-md border ${sizeClasses} ${current.bg} ${className}`}>
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} />
      <span>{current.label}</span>
    </span>
  );
}
