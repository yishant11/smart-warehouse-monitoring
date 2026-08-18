import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async Thunks for Periodic API Polling & Analytics
export const fetchSummary = createAsyncThunk(
  'dashboard/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/dashboard/summary');
      const data = await response.json();
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Failed to fetch dashboard summary.');
      }
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error fetching summary.');
    }
  }
);

export const fetchAnalytics = createAsyncThunk(
  'dashboard/fetchAnalytics',
  async ({ range = '24h', zone = 'all' } = {}, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/dashboard/analytics?range=${range}&zone=${zone}`);
      const data = await response.json();
      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Failed to fetch analytics.');
      }
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error fetching analytics.');
    }
  }
);

export const simulateAnomalyAction = createAsyncThunk(
  'dashboard/simulateAnomaly',
  async ({ type = 'TEMPERATURE_SPIKE', duration = 15000 }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/simulate-anomaly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, duration })
      });
      const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to trigger anomaly.');
    }
  }
);

const initialState = {
  // Live SSE Data
  liveMetrics: {
    temperature: 24.2,
    humidity: 58.5,
    activeMachines: 21,
    totalMachines: 30,
    powerKw: 192.4,
    conveyorSpeed: 1.8,
    airQualityAqi: 38,
    status: 'OK',
    eventType: 'UPDATE',
    message: 'System nominal. Ready for live ingestion.',
    zones: [],
    timestamp: new Date().toISOString()
  },
  liveHistory: [],
  liveEvents: [],
  lastUpdated: null,
  isLive: true,
  connectionStatus: 'DISCONNECTED', // 'CONNECTING' | 'CONNECTED' | 'PAUSED' | 'DISCONNECTED' | 'RECONNECTING'
  connectionError: null,

  // Periodic Polled Summary Data
  summary: {
    loading: false,
    data: null,
    error: null,
    lastUpdated: null
  },

  // Analytics Data
  analytics: {
    loading: false,
    data: null,
    error: null,
    range: '24h',
    selectedZone: 'all',
    lastUpdated: null
  }
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Dispatched when SSE message arrives
    updateLiveMetrics: (state, action) => {
      // If user paused live updates, ignore ingestion into active UI metrics
      if (!state.isLive) return;

      const payload = action.payload;
      state.liveMetrics = payload;
      state.lastUpdated = payload.timestamp || new Date().toISOString();

      // Maintain rolling live buffer (max 30 points)
      state.liveHistory.push({
        time: new Date(payload.timestamp || Date.now()).toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' }),
        temperature: payload.temperature,
        humidity: payload.humidity,
        activeMachines: payload.activeMachines,
        powerKw: payload.powerKw
      });

      if (state.liveHistory.length > 30) {
        state.liveHistory.shift();
      }

      // Add to live events feed if event is interesting or periodic
      if (payload.eventType && payload.message) {
        state.liveEvents.unshift({
          id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          eventType: payload.eventType,
          status: payload.status,
          message: payload.message,
          timestamp: payload.timestamp || new Date().toISOString(),
          temperature: payload.temperature,
          humidity: payload.humidity
        });

        if (state.liveEvents.length > 50) {
          state.liveEvents.pop();
        }
      }
    },

    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
      if (action.payload === 'CONNECTED') {
        state.connectionError = null;
      }
    },

    setConnectionError: (state, action) => {
      state.connectionError = action.payload;
    },

    toggleLiveUpdates: (state) => {
      state.isLive = !state.isLive;
      if (!state.isLive) {
        state.connectionStatus = 'PAUSED';
      } else {
        state.connectionStatus = 'CONNECTED';
      }
    },

    setLiveUpdates: (state, action) => {
      state.isLive = action.payload;
      state.connectionStatus = action.payload ? 'CONNECTED' : 'PAUSED';
    },

    setAnalyticsFilter: (state, action) => {
      if (action.payload.range) state.analytics.range = action.payload.range;
      if (action.payload.selectedZone) state.analytics.selectedZone = action.payload.selectedZone;
    },

    clearLiveEvents: (state) => {
      state.liveEvents = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Summary Polling
      .addCase(fetchSummary.pending, (state) => {
        state.summary.loading = true;
        state.summary.error = null;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.summary.loading = false;
        state.summary.data = action.payload;
        state.summary.lastUpdated = action.payload.lastUpdated || new Date().toISOString();
        state.summary.error = null;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.summary.loading = false;
        state.summary.error = action.payload || 'Failed to refresh summary.';
      })

      // Analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.analytics.loading = true;
        state.analytics.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.analytics.loading = false;
        state.analytics.data = action.payload;
        state.analytics.lastUpdated = action.payload.lastUpdated || new Date().toISOString();
        state.analytics.error = null;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.analytics.loading = false;
        state.analytics.error = action.payload || 'Failed to refresh analytics.';
      });
  }
});

export const {
  updateLiveMetrics,
  setConnectionStatus,
  setConnectionError,
  toggleLiveUpdates,
  setLiveUpdates,
  setAnalyticsFilter,
  clearLiveEvents
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
