export const selectDashboard = (state) => state.dashboard;
export const selectLiveMetrics = (state) => state.dashboard.liveMetrics;
export const selectLiveHistory = (state) => state.dashboard.liveHistory;
export const selectLiveEvents = (state) => state.dashboard.liveEvents;
export const selectIsLive = (state) => state.dashboard.isLive;
export const selectConnectionStatus = (state) => state.dashboard.connectionStatus;
export const selectConnectionError = (state) => state.dashboard.connectionError;
export const selectLastUpdated = (state) => state.dashboard.lastUpdated;
export const selectSummary = (state) => state.dashboard.summary;
export const selectSummaryData = (state) => state.dashboard.summary.data;
export const selectSummaryLoading = (state) => state.dashboard.summary.loading;
export const selectAnalytics = (state) => state.dashboard.analytics;
export const selectAnalyticsData = (state) => state.dashboard.analytics.data;
export const selectAnalyticsFilter = (state) => ({
  range: state.dashboard.analytics.range,
  selectedZone: state.dashboard.analytics.selectedZone
});
