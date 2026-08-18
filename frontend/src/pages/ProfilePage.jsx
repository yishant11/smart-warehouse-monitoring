import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Shield,
  Clock,
  KeyRound,
  LogOut,
  Laptop,
  Globe,
  AlertOctagon,
  CheckCircle2,
  Lock,
  RefreshCw
} from 'lucide-react';
import {
  selectCurrentUser,
  selectSession,
  selectSessionStatus,
  selectTokenExpiresAt,
  selectAuthToken
} from '../features/auth/authSelectors';
import { logoutUser, expireSession, checkSession } from '../features/auth/authSlice';
import { useToast } from '../components/common/ToastContainer';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const user = useSelector(selectCurrentUser);
  const session = useSelector(selectSession);
  const sessionStatus = useSelector(selectSessionStatus);
  const tokenExpiresAt = useSelector(selectTokenExpiresAt);
  const token = useSelector(selectAuthToken);

  const [timeRemaining, setTimeRemaining] = useState('1h 59m 40s');

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  // Update session expiration countdown
  useEffect(() => {
    if (!tokenExpiresAt) return;

    const interval = setInterval(() => {
      const diff = new Date(tokenExpiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeRemaining('Session Expired');
        dispatch(expireSession());
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tokenExpiresAt, dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    addToast({
      title: 'Session Terminated',
      message: 'You have logged out successfully.',
      type: 'info'
    });
    navigate('/login');
  };

  const handleSimulateExpiry = () => {
    dispatch(expireSession());
    addToast({
      title: 'Session Expired',
      message: 'Simulated token expiry triggered. Redirecting to login.',
      type: 'warning'
    });
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-500/25">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
                {user?.name || 'Admin Operator'}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                {sessionStatus || 'ACTIVE'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {user?.role || 'Lead Operations Engineer'} • {user?.department || 'Smart Warehouse Logistics'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateExpiry}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition"
            title="Simulate expired JWT session to test redirect behavior"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Simulate Expiry</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Profile & Permissions */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" />
            Operator Credentials & Roles
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 font-medium">Email Address</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                {user?.email || 'admin@example.com'}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 font-medium">Access Tier</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {user?.accessLevel || 'Tier 3 (Full Supervisory Control)'}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 font-medium">Security Scope</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Warehouse Zones A, B, C, D Telemetry & Actuators
              </span>
            </div>

            <div className="flex justify-between py-2 text-xs">
              <span className="text-slate-500 font-medium">Auth Mechanism</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                Signed JSON Web Token (HS256)
              </span>
            </div>
          </div>
        </div>

        {/* Live Session Security & Countdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            Active Session Security & Telemetry Client
          </h3>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">JWT Token Expiration Countdown</p>
              <p className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
                {timeRemaining}
              </p>
            </div>
            <Lock className="w-6 h-6 text-indigo-500" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Client IP Address
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {session?.ipAddress || '127.0.0.1 (Localhost)'}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Login Timestamp
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {session?.loginTime ? new Date(session.loginTime).toLocaleString() : 'Recent'}
              </span>
            </div>

            <div className="flex justify-between py-2 text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Laptop className="w-3.5 h-3.5" /> Session Identification
              </span>
              <span className="font-mono text-slate-500 truncate max-w-[200px]">
                {session?.sessionId || 'sess_active_01'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
