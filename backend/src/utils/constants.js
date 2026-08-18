// Thresholds & Constants for Warehouse Telemetry
const THRESHOLDS = {
  TEMPERATURE: {
    NORMAL_MAX: 26.5,
    WARNING_MAX: 28.5,
    CRITICAL_MAX: 32.0,
    MIN: 18.0
  },
  HUMIDITY: {
    NORMAL_MIN: 45,
    NORMAL_MAX: 65,
    WARNING_MAX: 72,
    CRITICAL_MAX: 85
  },
  MACHINES: {
    TOTAL: 30,
    CRITICAL_MIN: 8,
    WARN_MIN: 14
  }
};

const STATUS_TYPES = {
  OK: 'OK',
  WARN: 'WARN',
  CRITICAL: 'CRITICAL'
};

const EVENT_TYPES = {
  UPDATE: 'UPDATE',
  ALERT: 'ALERT',
  RECOVERY: 'RECOVERY'
};

const WAREHOUSE_ZONES = [
  { id: 'zone-a', name: 'Zone A - Cold Storage & Pharmaceuticals', baseTemp: 4.5, baseHumidity: 50, tempRange: [2.0, 7.0] },
  { id: 'zone-b', name: 'Zone B - Robotics Sorting & Automated Staging', baseTemp: 23.5, baseHumidity: 58, tempRange: [20.0, 27.0] },
  { id: 'zone-c', name: 'Zone C - Heavy Machinery & Conveyor Hub', baseTemp: 26.0, baseHumidity: 62, tempRange: [22.0, 31.0] },
  { id: 'zone-d', name: 'Zone D - Inbound / Outbound Cargo Dock', baseTemp: 24.0, baseHumidity: 60, tempRange: [19.0, 29.0] }
];

module.exports = {
  THRESHOLDS,
  STATUS_TYPES,
  EVENT_TYPES,
  WAREHOUSE_ZONES
};
