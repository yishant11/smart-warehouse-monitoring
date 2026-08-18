import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import alertsReducer from '../features/alerts/alertsSlice';
import settingsReducer from '../features/settings/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    alerts: alertsReducer,
    settings: settingsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore date strings or non-critical serializable warnings
        ignoredActions: ['auth/checkSession/fulfilled', 'dashboard/updateLiveMetrics'],
        ignoredPaths: ['dashboard.lastUpdated', 'dashboard.summary.lastUpdated']
      }
    })
});

export default store;
