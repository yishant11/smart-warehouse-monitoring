import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Clock,
  Radio,
  Thermometer,
  Droplets,
  BellRing,
  Volume2,
  Flame,
  Cpu,
  RotateCcw,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import {
  selectSettings,
  setTheme,
  setRefreshInterval,
  setLiveUpdatesEnabled,
  setTemperatureThresholds,
  setHumidityThresholds,
  setToastNotifications,
  setAudioAlerts,
  resetSettingsToDefault
} from '../features/settings/settingsSlice';
import {
  simulateAnomalyAction,
  fetchSummary
} from '../features/dashboard/dashboardSlice';
import { useToast } from '../components/common/ToastContainer';

export default function SettingsPage() {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const { addToast } = useToast();

  const handleThemeChange = (theme) => {
    dispatch(setTheme(theme));
    addToast({
      title: 'Theme Updated',
      message: `Visual display mode set to ${theme.toUpperCase()}.`,
      type: 'info'
    });
  };

  const handleIntervalChange = (val) => {
    dispatch(setRefreshInterval(val));
    addToast({
      title: 'Polling Frequency Updated',
      message: `Background API polling frequency adjusted to every ${val} seconds.`,
      type: 'success'
    });
  };

  const handleTempThresholdChange = (key, val) => {
    dispatch(setTemperatureThresholds({ [key]: parseFloat(val) }));
  };

  const handleHumThresholdChange = (key, val) => {
    dispatch(setHumidityThresholds({ [key]: parseFloat(val) }));
  };

  const handleSimulate = async (type, label) => {
    try {
      await dispatch(simulateAnomalyAction({ type, duration: 15000 })).unwrap();
      addToast({
        title: 'Anomaly Injected',
        message: `Injected "${label}" anomaly for 15s. Telemetry will reflect new threshold state.`,
        type: 'warning'
      });
      dispatch(fetchSummary());
    } catch (e) {
      addToast({ title: 'Simulation Error', message: e.message, type: 'error' });
    }
  };

  const handleReset = () => {
    dispatch(resetSettingsToDefault());
    addToast({
      title: 'Settings Reset',
      message: 'All system parameters restored to factory defaults.',
      type: 'info'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight flex items-center gap-2.5">
            <SettingsIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            System Preferences & Threshold Calibration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Fine-tune sensory threshold triggers, API polling frequencies, and UI theming
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Visual Theme & Streaming Options */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            Theming & Interface Configuration
          </h3>

          {/* Theme Switch */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Color Theme Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition ${
                  settings.theme === 'dark'
                    ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Moon className="w-5 h-5" />
                <div className="text-left">
                  <p className="text-xs font-bold">Dark Cyber-Ops</p>
                  <p className="text-[10px] text-slate-400">High-contrast mission control</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition ${
                  settings.theme === 'light'
                    ? 'bg-indigo-600/10 border-indigo-500 text-indigo-600 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <div className="text-left">
                  <p className="text-xs font-bold">Light Clean</p>
                  <p className="text-[10px] text-slate-400">Daytime enterprise view</p>
                </div>
              </button>
            </div>
          </div>

          {/* API Polling Refresh Interval */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Periodic API Polling Interval
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Controls frequency of aggregated summary stats fetching from <code>/api/dashboard/summary</code>
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 30].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => handleIntervalChange(sec)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    settings.refreshInterval === sec
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Toast Notification Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Toast Notification Popups</p>
              <p className="text-[11px] text-slate-500">Display floating toasts on incoming incident alarms</p>
            </div>
            <input
              type="checkbox"
              checked={settings.toastNotificationsEnabled}
              onChange={(e) => dispatch(setToastNotifications(e.target.checked))}
              className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Section 2: Sensory Threshold Calibration */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-rose-500" />
            Sensor Threshold Rules Engine
          </h3>

          {/* Temperature Thresholds */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center gap-1.5 text-amber-500">
                  <ShieldAlert className="w-3.5 h-3.5" /> Temperature Warning Threshold
                </span>
                <span className="font-mono">{settings.temperatureThreshold.warning}°C</span>
              </div>
              <input
                type="range"
                min="22"
                max="28"
                step="0.5"
                value={settings.temperatureThreshold.warning}
                onChange={(e) => handleTempThresholdChange('warning', e.target.value)}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">Readings above this level trigger WARN status and amber alert badges.</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center gap-1.5 text-rose-500">
                  <ShieldAlert className="w-3.5 h-3.5" /> Temperature Critical Threshold
                </span>
                <span className="font-mono">{settings.temperatureThreshold.critical}°C</span>
              </div>
              <input
                type="range"
                min="28"
                max="36"
                step="0.5"
                value={settings.temperatureThreshold.critical}
                onChange={(e) => handleTempThresholdChange('critical', e.target.value)}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">Readings above this level trigger CRITICAL status and automated cooling failovers.</p>
            </div>
          </div>

          {/* Humidity Thresholds */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center gap-1.5 text-blue-500">
                  <Droplets className="w-3.5 h-3.5" /> Max Safe Humidity Threshold
                </span>
                <span className="font-mono">{settings.humidityThreshold.warning}% RH</span>
              </div>
              <input
                type="range"
                min="55"
                max="80"
                step="1"
                value={settings.humidityThreshold.warning}
                onChange={(e) => handleHumThresholdChange('warning', e.target.value)}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Anomaly & Fault Injection Sandbox */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-500" />
          Interactive Anomaly & Fault Injection Sandbox
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-4">
          Click any scenario to inject live dummy anomalies from the Node.js backend. Observe the immediate multi-modal reaction across live metrics, charts, status badges, and alert logs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleSimulate('TEMPERATURE_SPIKE', 'Thermal Runaway (+32.5°C)')}
            className="p-4 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800/60 text-left transition group"
          >
            <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 font-bold text-xs mb-1">
              <span className="flex items-center gap-1.5"><Flame className="w-4 h-4" /> Thermal Runaway</span>
              <span className="text-[10px] uppercase font-mono">15s</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Spikes temperature to 32.5°C in Zone C; triggers CRITICAL alarm & cooling fans.
            </p>
          </button>

          <button
            onClick={() => handleSimulate('MACHINE_FAILURES', 'Multiple Robot Offline (7 Units)')}
            className="p-4 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/60 text-left transition group"
          >
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-bold text-xs mb-1">
              <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4" /> Machine Drop</span>
              <span className="text-[10px] uppercase font-mono">15s</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Drops active machines to 7/30; triggers CRITICAL machine starvation alert.
            </p>
          </button>

          <button
            onClick={() => handleSimulate('HUMIDITY_SURGE', 'Condensation Surge (80% RH)')}
            className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800/60 text-left transition group"
          >
            <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 font-bold text-xs mb-1">
              <span className="flex items-center gap-1.5"><Droplets className="w-4 h-4" /> Humidity Surge</span>
              <span className="text-[10px] uppercase font-mono">15s</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Elevates storage humidity to 80% RH; triggers automated dehumidifier sequencing.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
