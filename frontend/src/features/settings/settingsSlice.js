import { createSlice } from '@reduxjs/toolkit';

const SETTINGS_STORAGE_KEY = 'warehouse_user_settings';

// Load stored settings or provide intelligent defaults
const loadSavedSettings = () => {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to parse saved settings', e);
  }
  return null;
};

const savedSettings = loadSavedSettings();

const initialState = {
  theme: savedSettings?.theme || 'dark', // Default sleek dark ops theme
  refreshInterval: savedSettings?.refreshInterval || 10, // seconds
  liveUpdatesEnabled: savedSettings?.liveUpdatesEnabled ?? true,
  streamIntervalMs: savedSettings?.streamIntervalMs || 1500,
  temperatureThreshold: {
    warning: savedSettings?.temperatureThreshold?.warning ?? 26.5,
    critical: savedSettings?.temperatureThreshold?.critical ?? 29.5
  },
  humidityThreshold: {
    warning: savedSettings?.humidityThreshold?.warning ?? 65,
    critical: savedSettings?.humidityThreshold?.critical ?? 75
  },
  audioAlertsEnabled: savedSettings?.audioAlertsEnabled ?? false,
  toastNotificationsEnabled: savedSettings?.toastNotificationsEnabled ?? true,
  autoAcknowledgeInfo: savedSettings?.autoAcknowledgeInfo ?? false
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      persistSettings(state);
      applyThemeClass(action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      persistSettings(state);
      applyThemeClass(state.theme);
    },
    setRefreshInterval: (state, action) => {
      state.refreshInterval = Number(action.payload);
      persistSettings(state);
    },
    setLiveUpdatesEnabled: (state, action) => {
      state.liveUpdatesEnabled = action.payload;
      persistSettings(state);
    },
    setTemperatureThresholds: (state, action) => {
      state.temperatureThreshold = { ...state.temperatureThreshold, ...action.payload };
      persistSettings(state);
    },
    setHumidityThresholds: (state, action) => {
      state.humidityThreshold = { ...state.humidityThreshold, ...action.payload };
      persistSettings(state);
    },
    setToastNotifications: (state, action) => {
      state.toastNotificationsEnabled = action.payload;
      persistSettings(state);
    },
    setAudioAlerts: (state, action) => {
      state.audioAlertsEnabled = action.payload;
      persistSettings(state);
    },
    resetSettingsToDefault: (state) => {
      state.theme = 'dark';
      state.refreshInterval = 10;
      state.liveUpdatesEnabled = true;
      state.temperatureThreshold = { warning: 26.5, critical: 29.5 };
      state.humidityThreshold = { warning: 65, critical: 75 };
      state.toastNotificationsEnabled = true;
      state.audioAlertsEnabled = false;
      persistSettings(state);
      applyThemeClass('dark');
    }
  }
});

function persistSettings(state) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to persist settings', e);
  }
}

function applyThemeClass(theme) {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}

export const {
  setTheme,
  toggleTheme,
  setRefreshInterval,
  setLiveUpdatesEnabled,
  setTemperatureThresholds,
  setHumidityThresholds,
  setToastNotifications,
  setAudioAlerts,
  resetSettingsToDefault
} = settingsSlice.actions;

export const selectSettings = (state) => state.settings;
export const selectTheme = (state) => state.settings.theme;
export const selectRefreshInterval = (state) => state.settings.refreshInterval;
export const selectLiveUpdatesEnabled = (state) => state.settings.liveUpdatesEnabled;
export const selectTemperatureThreshold = (state) => state.settings.temperatureThreshold;
export const selectHumidityThreshold = (state) => state.settings.humidityThreshold;
export const selectToastNotificationsEnabled = (state) => state.settings.toastNotificationsEnabled;

export default settingsSlice.reducer;
