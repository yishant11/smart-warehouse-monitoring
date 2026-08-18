import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function LiveMetricCard({
  title,
  value,
  unit = '',
  status = 'OK',
  subtext,
  icon: Icon,
  delta,
  trend = 'neutral',
  colorScheme = 'indigo',
  range = null
}) {
  const statusGlow = {
    OK: 'border-slate-200 dark:border-slate-800 hover:border-indigo-500/40',
    WARN: 'border-amber-400 dark:border-amber-500/50 glow-card-amber',
    CRITICAL: 'border-rose-500 dark:border-rose-500/60 glow-card-red animate-pulse-fast'
  };

  const badgeColors = {
    OK: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    WARN: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    CRITICAL: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
  };

  const iconColors = {
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-300 shadow-sm hover:shadow-md ${
        statusGlow[status] || statusGlow.OK
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className={`p-2.5 rounded-xl ${iconColors[colorScheme] || iconColors.indigo}`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {title}
            </p>
            {range && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                Target: {range}
              </span>
            )}
          </div>
        </div>

        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
            badgeColors[status] || badgeColors.OK
          }`}
        >
          {status}
        </span>
      </div>

      {/* Main Metric Value */}
      <div className="mt-4 flex items-baseline justify-between">
        <div className="flex items-baseline gap-1">
          <motion.span
            key={value}
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight"
          >
            {value}
          </motion.span>
          {unit && (
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 font-mono">
              {unit}
            </span>
          )}
        </div>

        {delta && (
          <div
            className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-md ${
              trend === 'up'
                ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30'
                : trend === 'down'
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
                : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
            }`}
          >
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 mr-0.5" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
            {trend === 'neutral' && <Minus className="w-3.5 h-3.5 mr-0.5" />}
            <span>{delta}</span>
          </div>
        )}
      </div>

      {/* Subtext info */}
      {subtext && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 truncate">
          {subtext}
        </p>
      )}
    </motion.div>
  );
}
