import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Thermometer,
  Droplets,
  Cpu,
  Zap,
  Activity,
  Gauge,
  Wind,
  Layers,
  Pause,
  Play,
  Flame,
  AlertTriangle
} from 'lucide-react';
import {
  selectLiveMetrics,
  selectLiveHistory,
  selectIsLive,
  selectLastUpdated,
  selectConnectionStatus
} from '../features/dashboard/dashboardSelectors';
import {
  toggleLiveUpdates,
  simulateAnomalyAction,
  fetchSummary
} from '../features/dashboard/dashboardSlice';
import LiveMetricCard from '../components/dashboard/LiveMetricCard';
import LiveEventFeed from '../components/dashboard/LiveEventFeed';
import WarehouseZoneGrid from '../components/dashboard/WarehouseZoneGrid';
import SummaryStatsBar from '../components/dashboard/SummaryStatsBar';
import StatusBadge from '../components/common/StatusBadge';
import LiveBadge from '../components/common/LiveBadge';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useToast } from '../components/common/ToastContainer';

export default function DashboardOverviewPage() {
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const liveMetrics = useSelector(selectLiveMetrics);
  const liveHistory = useSelector(selectLiveHistory);
  const isLive = useSelector(selectIsLive);
  const lastUpdated = useSelector(selectLastUpdated);
  const connectionStatus = useSelector(selectConnectionStatus);

  const handleSimulateSpike = async () => {
    try {
      await dispatch(simulateAnomalyAction({ type: 'TEMPERATURE_SPIKE', duration: 12000 })).unwrap();
      addToast({
        title: 'Thermal Spike Anomaly Triggered',
        message: 'Elevated temperature injected (+32°C). Watch live metrics and alert response.',
        type: 'critical'
      });
      dispatch(fetchSummary());
    } catch (e) {
      addToast({ title: 'Simulation Error', message: e.message, type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
              Warehouse Telemetry Command Center
            </h1>
            <StatusBadge status={liveMetrics.status} size="lg" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time IoT environmental telemetry stream & automated supervisory control
          </p>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => dispatch(toggleLiveUpdates())}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              isLive
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isLive ? 'Pause Live Stream' : 'Resume Live Stream'}</span>
          </button>

          <button
            onClick={handleSimulateSpike}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition"
          >
            <Flame className="w-4 h-4" />
            <span>Simulate Anomaly</span>
          </button>
        </div>
      </div>

      {/* Connection & Live Status Ribbon */}
      {!isLive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-medium flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Pause className="w-4 h-4 animate-pulse" />
            <span>Live telemetry ingestion is currently <strong>PAUSED</strong>. Metrics are frozen in UI state.</span>
          </div>
          <button
            onClick={() => dispatch(toggleLiveUpdates())}
            className="font-bold underline hover:no-underline"
          >
            Resume Updates
          </button>
        </motion.div>
      )}

      {/* 3+ Real-time Fluctuating Numeric Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Metric 1: Temperature */}
        <LiveMetricCard
          title="Ambient Temp"
          value={liveMetrics.temperature}
          unit="°C"
          status={liveMetrics.temperature >= 29.5 ? 'CRITICAL' : liveMetrics.temperature >= 26.5 ? 'WARN' : 'OK'}
          subtext="Target: 22.0 – 26.0°C"
          range="22–26°C"
          icon={Thermometer}
          colorScheme="rose"
          delta={liveMetrics.temperature > 26.5 ? '+1.4°' : 'Nominal'}
          trend={liveMetrics.temperature > 26.5 ? 'up' : 'neutral'}
        />

        {/* Metric 2: Humidity */}
        <LiveMetricCard
          title="RH Humidity"
          value={liveMetrics.humidity}
          unit="%"
          status={liveMetrics.humidity >= 75 ? 'CRITICAL' : liveMetrics.humidity >= 65 ? 'WARN' : 'OK'}
          subtext="Target: 45 – 65%"
          range="45–65%"
          icon={Droplets}
          colorScheme="blue"
          delta="Stable"
          trend="neutral"
        />

        {/* Metric 3: Active Machines */}
        <LiveMetricCard
          title="Active Units"
          value={liveMetrics.activeMachines}
          unit="/30"
          status={liveMetrics.activeMachines <= 8 ? 'CRITICAL' : liveMetrics.activeMachines <= 14 ? 'WARN' : 'OK'}
          subtext="Robotic sorting units"
          icon={Cpu}
          colorScheme="indigo"
          delta={`${Math.round((liveMetrics.activeMachines / 30) * 100)}% load`}
          trend="neutral"
        />

        {/* Metric 4: Power Draw */}
        <LiveMetricCard
          title="Power Draw"
          value={liveMetrics.powerKw}
          unit="kW"
          status={liveMetrics.powerKw > 240 ? 'WARN' : 'OK'}
          subtext="Grid distribution load"
          icon={Zap}
          colorScheme="amber"
          delta="+2.1%"
          trend="up"
        />

        {/* Metric 5: Conveyor Speed */}
        <LiveMetricCard
          title="Conveyor Speed"
          value={liveMetrics.conveyorSpeed}
          unit="m/s"
          status="OK"
          subtext="Line velocity index"
          icon={Gauge}
          colorScheme="emerald"
          delta="100% nominal"
          trend="neutral"
        />

        {/* Metric 6: Air Quality */}
        <LiveMetricCard
          title="Air Quality"
          value={liveMetrics.airQualityAqi}
          unit="AQI"
          status={liveMetrics.airQualityAqi > 60 ? 'WARN' : 'OK'}
          subtext="Particulate filtration"
          icon={Wind}
          colorScheme="blue"
          delta="Good"
          trend="down"
        />
      </div>

      {/* Periodic Summary Statistics Bar */}
      <SummaryStatsBar />

      {/* Real-Time Live Telemetry Waveform & Event Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time SSE Live Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-500" />
                Live Real-Time Telemetry Oscilloscope
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Rolling 30-sample buffer streamed continuously via SSE
              </p>
            </div>
            <LiveBadge />
          </div>

          <div className="h-64 mt-4 w-full">
            {liveHistory.length < 2 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                Buffering incoming real-time telemetry points...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={liveHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="humGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} opacity={0.6} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} opacity={0.6} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    name="Temp (°C)"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#tempGradient)"
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="humidity"
                    name="Humidity (%)"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#humGradient)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Live Real-Time Event Feed (1 col) */}
        <div className="lg:col-span-1">
          <LiveEventFeed />
        </div>
      </div>

      {/* Warehouse Environmental Zone Matrix */}
      <WarehouseZoneGrid />
    </div>
  );
}
