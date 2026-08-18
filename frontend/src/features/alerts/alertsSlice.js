import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../config/apiConfig';

export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async (filters = {}, { getState, rejectWithValue }) => {
    try {
      const currentFilters = filters || getState().alerts.filters;
      const params = new URLSearchParams();

      if (currentFilters.severity && currentFilters.severity !== 'ALL') {
        params.append('severity', currentFilters.severity);
      }
      if (currentFilters.status && currentFilters.status !== 'ALL') {
        params.append('status', currentFilters.status);
      }
      if (currentFilters.search) {
        params.append('search', currentFilters.search);
      }
      if (currentFilters.sortBy) {
        params.append('sortBy', currentFilters.sortBy);
      }

      const response = await fetch(`${API_BASE_URL}/api/dashboard/alerts?${params.toString()}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Failed to fetch alerts.');
      }

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error loading alerts.');
    }
  }
);

export const acknowledgeAlert = createAsyncThunk(
  'alerts/acknowledgeAlert',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`${API_BASE_URL}/api/dashboard/alerts/${id}/acknowledge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Failed to acknowledge alert.');
      }

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Error acknowledging alert.');
    }
  }
);

export const resolveAlert = createAsyncThunk(
  'alerts/resolveAlert',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`${API_BASE_URL}/api/dashboard/alerts/${id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Failed to resolve alert.');
      }

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Error resolving alert.');
    }
  }
);

const initialState = {
  alerts: [],
  total: 0,
  activeCount: 0,
  criticalCount: 0,
  loading: false,
  error: null,
  lastUpdated: null,
  filters: {
    severity: 'ALL',
    status: 'ALL',
    search: '',
    sortBy: 'timestamp'
  },
  selectedAlert: null,
  isDrawerOpen: false,
  isModalOpen: false
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    setAlertFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetAlertFilters: (state) => {
      state.filters = {
        severity: 'ALL',
        status: 'ALL',
        search: '',
        sortBy: 'timestamp'
      };
    },
    openAlertDrawer: (state, action) => {
      state.selectedAlert = action.payload;
      state.isDrawerOpen = true;
    },
    closeAlertDrawer: (state) => {
      state.isDrawerOpen = false;
      state.selectedAlert = null;
    },
    openAlertModal: (state, action) => {
      state.selectedAlert = action.payload;
      state.isModalOpen = true;
    },
    closeAlertModal: (state) => {
      state.isModalOpen = false;
      state.selectedAlert = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Alerts
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload.alerts || [];
        state.total = action.payload.total || 0;
        state.activeCount = action.payload.activeCount || 0;
        state.criticalCount = action.payload.criticalCount || 0;
        state.lastUpdated = action.payload.lastUpdated || new Date().toISOString();
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch alerts';
      })

      // Acknowledge Alert
      .addCase(acknowledgeAlert.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.alerts.findIndex(a => a.id === updated.id);
        if (index !== -1) {
          state.alerts[index] = updated;
        }
        if (state.selectedAlert && state.selectedAlert.id === updated.id) {
          state.selectedAlert = updated;
        }
        state.activeCount = state.alerts.filter(a => a.status === 'ACTIVE').length;
      })

      // Resolve Alert
      .addCase(resolveAlert.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.alerts.findIndex(a => a.id === updated.id);
        if (index !== -1) {
          state.alerts[index] = updated;
        }
        if (state.selectedAlert && state.selectedAlert.id === updated.id) {
          state.selectedAlert = updated;
        }
        state.activeCount = state.alerts.filter(a => a.status === 'ACTIVE').length;
        state.criticalCount = state.alerts.filter(a => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length;
      });
  }
});

export const {
  setAlertFilters,
  resetAlertFilters,
  openAlertDrawer,
  closeAlertDrawer,
  openAlertModal,
  closeAlertModal
} = alertsSlice.actions;

export const selectAlerts = (state) => state.alerts.alerts;
export const selectAlertsTotal = (state) => state.alerts.total;
export const selectAlertsActiveCount = (state) => state.alerts.activeCount;
export const selectAlertsCriticalCount = (state) => state.alerts.criticalCount;
export const selectAlertsLoading = (state) => state.alerts.loading;
export const selectAlertFilters = (state) => state.alerts.filters;
export const selectSelectedAlert = (state) => state.alerts.selectedAlert;
export const selectIsAlertDrawerOpen = (state) => state.alerts.isDrawerOpen;
export const selectIsAlertModalOpen = (state) => state.alerts.isModalOpen;

export default alertsSlice.reducer;
