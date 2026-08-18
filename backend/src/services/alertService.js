const { STATUS_TYPES, EVENT_TYPES } = require('../utils/constants');

class AlertService {
  constructor() {
    this.alerts = [
      {
        id: 'ALT-1091',
        title: 'High Thermal Reading in Conveyor Hub',
        message: 'Temperature in Zone C exceeded warning threshold (28.4°C / 26.5°C limit). Cooling fans auto-engaged.',
        severity: 'CRITICAL',
        zone: 'Zone C - Heavy Machinery',
        status: 'ACTIVE',
        eventType: EVENT_TYPES.ALERT,
        telemetrySnapshot: { temperature: 28.4, humidity: 67.2, activeMachines: 22, powerKw: 218.4 },
        timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
        acknowledgedBy: null,
        resolvedAt: null
      },
      {
        id: 'ALT-1090',
        title: 'Humidity Threshold Deviation',
        message: 'Storage humidity in Zone B reached 68% (Target: 50–60%). Dehumidification sequence initiated.',
        severity: 'WARN',
        zone: 'Zone B - Robotics Sorting',
        status: 'ACKNOWLEDGED',
        eventType: EVENT_TYPES.ALERT,
        telemetrySnapshot: { temperature: 24.1, humidity: 68.0, activeMachines: 20, powerKw: 184.2 },
        timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
        acknowledgedBy: 'Admin Operator',
        acknowledgedAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
        resolvedAt: null
      },
      {
        id: 'ALT-1089',
        title: 'Automated Robot Battery Low & Machine Idle',
        message: 'Robotic Staging Unit #07 entered maintenance standby; 3 active machines flagged for scheduled inspection.',
        severity: 'WARN',
        zone: 'Zone B - Robotics Sorting',
        status: 'ACTIVE',
        eventType: EVENT_TYPES.ALERT,
        telemetrySnapshot: { temperature: 23.8, humidity: 55.4, activeMachines: 18, powerKw: 168.0 },
        timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
        acknowledgedBy: null,
        resolvedAt: null
      },
      {
        id: 'ALT-1088',
        title: 'Cold Storage Ambient Temp Restored',
        message: 'Zone A cold storage chiller unit cycled successfully. Temp normalized to 4.2°C.',
        severity: 'INFO',
        zone: 'Zone A - Cold Storage',
        status: 'RESOLVED',
        eventType: EVENT_TYPES.RECOVERY,
        telemetrySnapshot: { temperature: 4.2, humidity: 48.0, activeMachines: 24, powerKw: 195.0 },
        timestamp: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
        acknowledgedBy: 'Admin Operator',
        resolvedAt: new Date(Date.now() - 85 * 60 * 1000).toISOString()
      },
      {
        id: 'ALT-1087',
        title: 'Peak Grid Power Surge Warning',
        message: 'Main distribution feeder registered 242 kW load during simultaneous conveyor acceleration.',
        severity: 'WARN',
        zone: 'Zone C - Heavy Machinery',
        status: 'RESOLVED',
        eventType: EVENT_TYPES.ALERT,
        telemetrySnapshot: { temperature: 25.9, humidity: 61.3, activeMachines: 25, powerKw: 242.0 },
        timestamp: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
        acknowledgedBy: 'Admin Operator',
        resolvedAt: new Date(Date.now() - 130 * 60 * 1000).toISOString()
      }
    ];
  }

  getAlerts(filters = {}) {
    let result = [...this.alerts];

    if (filters.severity && filters.severity !== 'ALL') {
      result = result.filter(a => a.severity.toUpperCase() === filters.severity.toUpperCase());
    }

    if (filters.status && filters.status !== 'ALL') {
      result = result.filter(a => a.status.toUpperCase() === filters.status.toUpperCase());
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.message.toLowerCase().includes(q) || 
        a.zone.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
      );
    }

    if (filters.sortBy === 'severity') {
      const rank = { CRITICAL: 3, WARN: 2, INFO: 1 };
      result.sort((a, b) => (rank[b.severity] || 0) - (rank[a.severity] || 0));
    } else {
      // Default timestamp desc
      result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    return {
      alerts: result,
      total: result.length,
      activeCount: this.alerts.filter(a => a.status === 'ACTIVE').length,
      criticalCount: this.alerts.filter(a => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length,
      lastUpdated: new Date().toISOString()
    };
  }

  getAlertById(id) {
    return this.alerts.find(a => a.id === id) || null;
  }

  acknowledgeAlert(id, userName = 'Admin Operator') {
    const alert = this.getAlertById(id);
    if (!alert) return null;

    alert.status = 'ACKNOWLEDGED';
    alert.acknowledgedBy = userName;
    alert.acknowledgedAt = new Date().toISOString();
    return alert;
  }

  resolveAlert(id) {
    const alert = this.getAlertById(id);
    if (!alert) return null;

    alert.status = 'RESOLVED';
    alert.resolvedAt = new Date().toISOString();
    return alert;
  }

  createAlert(data) {
    const newAlert = {
      id: `ALT-${1090 + this.alerts.length + 1}`,
      title: data.title || 'System Alert',
      message: data.message || 'Automated telemetry trigger',
      severity: data.severity || 'WARN',
      zone: data.zone || 'Zone C - Heavy Machinery',
      status: 'ACTIVE',
      eventType: data.eventType || EVENT_TYPES.ALERT,
      telemetrySnapshot: data.telemetrySnapshot || { temperature: 27.5, humidity: 62.0, activeMachines: 18 },
      timestamp: new Date().toISOString(),
      acknowledgedBy: null,
      resolvedAt: null
    };

    this.alerts.unshift(newAlert);
    return newAlert;
  }
}

const alertService = new AlertService();

module.exports = alertService;
