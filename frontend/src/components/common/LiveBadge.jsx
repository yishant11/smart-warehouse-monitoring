import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsLive, selectConnectionStatus } from '../../features/dashboard/dashboardSelectors';
import { Activity, Pause, RefreshCw, AlertCircle } from 'lucide-react';

export default function LiveBadge({ showLabel = true, className = '' }) {
  const isLive = useSelector(selectIsLive);
  const connectionStatus = useSelector(selectConnectionStatus);

  if (!isLive || connectionStatus === 'PAUSED') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 ${className}`}>
        <Pause className="w-3 h-3 animate-pulse" />
        {showLabel && <span>PAUSED</span>}
      </span>
    );
  }

  if (connectionStatus === 'RECONNECTING' || connectionStatus === 'CONNECTING') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 ${className}`}>
        <RefreshCw className="w-3 h-3 animate-spin" />
        {showLabel && <span>RECONNECTING...</span>}
      </span>
    );
  }

  if (connectionStatus === 'DISCONNECTED') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 ${className}`}>
        <AlertCircle className="w-3 h-3" />
        {showLabel && <span>OFFLINE</span>}
      </span>
    );
  }

  // Live Connected State
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      {showLabel && <span className="tracking-wide">LIVE</span>}
    </span>
  );
}
