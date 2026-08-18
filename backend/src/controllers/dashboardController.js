const analyticsService = require('../services/analyticsService');
const telemetryGenerator = require('../services/telemetryGenerator');
const { WAREHOUSE_ZONES } = require('../utils/constants');

function getDashboardSummary(req, res) {
  const summary = analyticsService.getSummaryStats();
  res.status(200).json({
    success: true,
    data: summary
  });
}

function getAnalyticsData(req, res) {
  const range = req.query.range || '24h';
  const zone = req.query.zone || 'all';

  const analytics = analyticsService.getAnalyticsTimeSeries(range, zone);
  res.status(200).json({
    success: true,
    data: analytics
  });
}

function getWarehouseZones(req, res) {
  const latest = telemetryGenerator.getLatestTelemetry();
  res.status(200).json({
    success: true,
    data: {
      zones: latest.zones || WAREHOUSE_ZONES,
      lastUpdated: latest.timestamp
    }
  });
}

module.exports = {
  getDashboardSummary,
  getAnalyticsData,
  getWarehouseZones
};
