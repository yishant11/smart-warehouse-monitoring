import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Pause,
  Play,
  Flame,
  LogOut,
  User,
  Clock,
  Radio,
  Sparkles
} from 'lucide-react';
import {
  toggleLiveUpdates,
  simulateAnomalyAction,
  fetchSummary
} from '../../features/dashboard/dashboardSlice';
import {
  selectIsLive,
  selectLastUpdated,
  selectConnectionStatus
} from '../../features/dashboard/dashboardSelectors';
import { toggleTheme, selectTheme } from '../../features/settings/settingsSlice';
import { logoutUser } from '../../features/auth/authSlice';
import { selectCurrentUser } from '../../features/auth/authSelectors';
import LiveBadge from './LiveBadge';
import { useToast } from './ToastContainer';

export default function Navbar({ onMenuToggle }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const isLive = useSelector(selectIsLive);
  const lastUpdated = useSelector(selectLastUpdated);
  const theme = useSelector(selectTheme);
  const user = useSelector(selectCurrentUser);
  const connectionStatus = useSelector(selectConnectionStatus);

  const [isSimulating, setIsSimulating] = useState(false);

  const handleToggleLive = () => {
    dispatch(toggleLiveUpdates());
    addToast({
      title: isLive ? 'Live Stream Paused' : 'Live Stream Resumed',
      message: isLive
        ? 'Real-time telemetry ingestion has been paused.'
        : 'Reconnecting and resuming live warehouse data feed.',
      type: isLive ? 'warning' : 'success'
    });
  };

  const handleSimulateSpike = async () => {
    try {
      setIsSimulating(true);
      await dispatch(simulateAnomalyAction({ type: 'TEMPERATURE_SPIKE', duration: 12000 })).unwrap();
      addToast({
        title: 'Thermal Anomaly Injected',
        message: 'Simulating temperature spike (+32.4°C) across warehouse sensors for 12s.',
        type: 'critical'
      });
      // Trigger instant summary refresh
      dispatch(fetchSummary());
    } catch (e) {
      addToast({ title: 'Simulation Error', message: e.message, type: 'error' });
    } finally {
      setTimeout(() => setIsSimulating(false), 2000);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    addToast({
      title: 'Logged Out',
      message: 'You have been successfully logged out of the warehouse telemetry system.',
      type: 'info'
    });
    navigate('/login');
  };

  const formatLastTime = (isoString) => {
    if (!isoString) return '--:--:--';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('en-US', { hour12: false });
    } catch (e) {
      return '--:--:--';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6">
      {/* Left items: Mobile toggle + Breadcrumb/Status */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 lg:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <LiveBadge />
          
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Updated: {formatLastTime(lastUpdated)}</span>
          </div>
        </div>
      </div>

      {/* Right items: Controls, Theme Toggle, Anomaly Button, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Anomaly Simulation Test Trigger */}
        <button
          onClick={handleSimulateSpike}
          disabled={isSimulating}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition shadow-xs"
          title="Inject temporary temperature spike anomaly to test real-time threshold reactions"
        >
          <Flame className={`w-3.5 h-3.5 ${isSimulating ? 'animate-bounce text-rose-500' : ''}`} />
          <span>Simulate Spike</span>
        </button>

        {/* Live Pause / Resume Button */}
        <button
          onClick={handleToggleLive}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
            isLive
              ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/40'
              : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
          }`}
          title={isLive ? 'Pause live SSE telemetry updates' : 'Resume live SSE telemetry updates'}
        >
          {isLive ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pause Live</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Resume Live</span>
            </>
          )}
        </button>

        {/* Theme Switcher */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 transition-transform hover:-rotate-12" />
          )}
        </button>

        {/* Profile Pill & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 p-1 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <span className="hidden lg:block text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
              {user?.name || 'Admin'}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
            title="Log out of session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
