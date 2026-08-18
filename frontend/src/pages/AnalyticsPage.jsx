import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Filter,
  Layers,
  Thermometer,
  Droplets,
  Cpu,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Boxes,
  RefreshCw
} from 'lucide-react';
import {
  fetchAnalytics,
  setAnalyticsFilter
} from '../features/dashboard/dashboardSlice';
import {
  selectAnalyticsData,
  selectAnalyticsFilter
} from '../features/dashboard/dashboardSelectors';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export default function AnalyticsPage() {
  const dispatch = useDispatch();
  const analytics = useSelector(selectAnalyticsData);
  const filter = useSelector(selectAnalyticsFilter);

  const [activeTab, setActiveTab] = useState('environment'); // 'environment' | 'machines' | 'power'

  useEffect(() => {
    dispatch(fetchAnalytics({ range: filter.range, zone: filter.selectedZone }));
  }, [dispatch, filter.range, filter.selectedZone]);

  const handleRangeChange = (range) => {
    dispatch(setAnalyticsFilter({ range }));
  };

  const handleZoneChange = (selectedZone) => {
    dispatch(setAnalyticsFilter({ selectedZone }));
  };

  const dataPoints = analytics?.dataPoints || [];

  return (
    <div className="space-y-6">
      {/* Top Banner & Filters */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Historical Trends & Predictive Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Aggregated time-series modeling for warehouse thermal dynamics & machine load
          </p>
        </div>

        {/* Interactive Time Range & Zone Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time Range Chips */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            {['1h', '6h', '24h', '7d'].map((r) => (
              <button
                key={r}
                onClick={() => handleRangeChange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filter.range === r
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Zone Selector */}
          <select
            value={filter.selectedZone}
            onChange={(e) => handleZoneChange(e.target.value)}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Warehouse Zones</option>
            <option value="zone-a">Zone A (Cold Storage)</option>
            <option value="zone-b">Zone B (Robotics Sorting)</option>
            <option value="zone-c">Zone C (Conveyor Hub)</option>
            <option value="zone-d">Zone D (Inbound Cargo)</option>
          </select>

          <button
            onClick={() => dispatch(fetchAnalytics({ range: filter.range, zone: filter.selectedZone }))}
            className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl border border-slate-200 dark:border-slate-700 transition"
            title="Refresh analytics data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('environment')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'environment'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          <span>Thermal & Humidity Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('machines')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'machines'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Machine Activity & Throughput</span>
        </button>

        <button
          onClick={() => setActiveTab('power')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'power'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Power Consumption & Energy</span>
        </button>
      </div>

      {/* Main Visualizations Area */}
      <motion.div
        key={activeTab + filter.range + filter.selectedZone}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {activeTab === 'environment' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Multi-Zone Temperature Trend */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                    Zone Temperature Profiles (°C)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Comparative timeline across warehouse cooling sectors
                  </p>
                </div>
                <span className="text-xs font-mono text-indigo-500 font-semibold">
                  Range: {filter.range.toUpperCase()}
                </span>
              </div>

              <div className="h-72 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataPoints}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} opacity={0.7} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} opacity={0.7} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                        fontSize: '12px'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="zoneA_temp" name="Zone A (Cold)" stroke="#38bdf8" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="zoneB_temp" name="Zone B (Robotics)" stroke="#6366f1" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="zoneC_temp" name="Zone C (Conveyors)" stroke="#f43f5e" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="zoneD_temp" name="Zone D (Dock)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Humidity Timeline */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                    Relative Humidity Dynamics (%)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Mean RH envelope vs safe threshold boundaries
                  </p>
                </div>
              </div>

              <div className="h-72 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dataPoints}>
                    <defs>
                      <linearGradient id="humFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} opacity={0.7} />
                    <YAxis domain={[30, 85]} tick={{ fontSize: 11 }} opacity={0.7} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                        fontSize: '12px'
                      }}
                    />
                    <Area type="monotone" dataKey="humidity" name="Mean Humidity (%)" stroke="#3b82f6" strokeWidth={2.5} fill="url(#humFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'machines' && (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                  Active Units vs Hourly Package Throughput
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Correlation between online machinery and logistics parcel routing velocity
                </p>
              </div>
            </div>

            <div className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataPoints}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} opacity={0.7} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} opacity={0.7} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} opacity={0.7} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="activeMachines" name="Active Machines" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="throughputUnits" name="Throughput (Units/hr)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'power' && (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                  Substation Electrical Power Load (kW)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Peak demand surges and facility power factor modeling
                </p>
              </div>
            </div>

            <div className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataPoints}>
                  <defs>
                    <linearGradient id="powerFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} opacity={0.7} />
                  <YAxis tick={{ fontSize: 11 }} opacity={0.7} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                  />
                  <Area type="monotone" dataKey="powerKw" name="Grid Power (kW)" stroke="#f59e0b" strokeWidth={2.5} fill="url(#powerFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
