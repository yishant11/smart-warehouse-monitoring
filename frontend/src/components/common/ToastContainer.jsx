import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4000 }) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    error: <AlertOctagon className="w-5 h-5 text-rose-500" />,
    critical: <AlertOctagon className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-indigo-500" />
  };

  const borders = {
    success: 'border-emerald-500/30 bg-white dark:bg-slate-900',
    warning: 'border-amber-500/30 bg-white dark:bg-slate-900',
    error: 'border-rose-500/30 bg-white dark:bg-slate-900',
    critical: 'border-rose-500/30 bg-white dark:bg-slate-900',
    info: 'border-indigo-500/30 bg-white dark:bg-slate-900'
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border ${borders[t.type] || borders.info}`}
            >
              <div className="flex-shrink-0 mt-0.5">{icons[t.type] || icons.info}</div>
              <div className="flex-1 min-w-0">
                {t.title && <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t.title}</h4>}
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{t.message}</p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
