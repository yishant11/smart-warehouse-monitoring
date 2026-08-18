const { THRESHOLDS, STATUS_TYPES, EVENT_TYPES, WAREHOUSE_ZONES } = require('../utils/constants');

class TelemetryGenerator {
  constructor() {
    this.currentTemperature = 24.2;
    this.currentHumidity = 58.5;
    this.currentActiveMachines = 21;
    this.currentPowerKw = 192.4;
    this.currentConveyorSpeed = 1.8;
    this.airQualityAqi = 38;
    this.lastStatus = STATUS_TYPES.OK;
    this.history = [];
    this.maxHistoryLength = 200;
    this.activeAnomaly = null;
    this.anomalyTimeout = null;

    // Seed initial history buffer with realistic sequential telemetry
    this.seedInitialHistory(30);
  }

  seedInitialHistory(count) {
    const now = Date.now();
    for (let i = count; i >= 1; i--) {
      const pastTime = new Date(now - i * 3000).toISOString();
      const reading = this.generateSample(pastTime, false);
      this.history.push(reading);
    }
  }

  injectAnomaly(anomalyType = 'TEMPERATURE_SPIKE', durationMs = 15000) {
    this.activeAnomaly = anomalyType;
    if (this.anomalyTimeout) clearTimeout(this.anomalyTimeout);

    this.anomalyTimeout = setTimeout(() => {
      this.activeAnomaly = null;
    }, durationMs);

    return {
      success: true,
      anomalyType,
      durationMs,
      message: `Simulated anomaly "${anomalyType}" active for ${durationMs / 1000}s`
    };
  }

  generateSample(customTimestamp = null, saveToHistory = true) {
    const now = customTimestamp || new Date().toISOString();

    // Natural random walk with mean reversion
    const tempDelta = (Math.random() - 0.5) * 0.6;
    let targetTemp = this.currentTemperature + tempDelta;
    // Mean reversion toward 24.5
    targetTemp += (24.5 - targetTemp) * 0.05;

    const humDelta = (Math.random() - 0.5) * 1.5;
    let targetHum = this.currentHumidity + humDelta;
    // Mean reversion toward 58
    targetHum += (58.0 - targetHum) * 0.05;

    const machineDelta = Math.floor((Math.random() - 0.48) * 3);
    let targetMachines = Math.max(10, Math.min(30, this.currentActiveMachines + machineDelta));

    // Handle Anomaly Injections
    if (this.activeAnomaly === 'TEMPERATURE_SPIKE') {
      targetTemp = 31.8 + (Math.random() - 0.5) * 1.0;
    } else if (this.activeAnomaly === 'HUMIDITY_SURGE') {
      targetHum = 79.5 + (Math.random() - 0.5) * 3.0;
    } else if (this.activeAnomaly === 'MACHINE_FAILURES') {
      targetMachines = 7;
    }

    this.currentTemperature = parseFloat(targetTemp.toFixed(1));
    this.currentHumidity = parseFloat(targetHum.toFixed(1));
    this.currentActiveMachines = targetMachines;
    this.currentPowerKw = parseFloat((120 + this.currentActiveMachines * 3.8 + Math.random() * 8).toFixed(1));
    this.currentConveyorSpeed = parseFloat((1.4 + (this.currentActiveMachines / 30) * 1.0 + (Math.random() - 0.5) * 0.2).toFixed(2));
    this.airQualityAqi = Math.round(35 + (this.currentTemperature - 22) * 3 + Math.random() * 5);

    // Derive status based on current telemetry
    let status = STATUS_TYPES.OK;
    let eventType = EVENT_TYPES.UPDATE;
    let message = 'All warehouse environmental telemetry systems operating within nominal parameters.';

    if (this.currentTemperature >= THRESHOLDS.TEMPERATURE.CRITICAL_MAX || this.currentHumidity >= THRESHOLDS.HUMIDITY.CRITICAL_MAX || this.currentActiveMachines <= THRESHOLDS.MACHINES.CRITICAL_MIN) {
      status = STATUS_TYPES.CRITICAL;
      eventType = EVENT_TYPES.ALERT;
      message = `CRITICAL: Thermal/operational anomaly detected (Temp: ${this.currentTemperature}°C, Hum: ${this.currentHumidity}%, Machines: ${this.currentActiveMachines}/${THRESHOLDS.MACHINES.TOTAL})`;
    } else if (this.currentTemperature >= THRESHOLDS.TEMPERATURE.NORMAL_MAX || this.currentHumidity >= THRESHOLDS.HUMIDITY.NORMAL_MAX || this.currentActiveMachines <= THRESHOLDS.MACHINES.WARN_MIN) {
      status = STATUS_TYPES.WARN;
      eventType = this.lastStatus === STATUS_TYPES.CRITICAL ? EVENT_TYPES.RECOVERY : EVENT_TYPES.ALERT;
      message = `WARNING: Telemetry threshold elevated in Zone C (Temp: ${this.currentTemperature}°C, Hum: ${this.currentHumidity}%)`;
    } else {
      if (this.lastStatus !== STATUS_TYPES.OK) {
        eventType = EVENT_TYPES.RECOVERY;
        message = `RECOVERY: All warehouse systems returned to nominal OK operating state.`;
      }
    }

    this.lastStatus = status;

    // Per-zone live readings
    const zones = WAREHOUSE_ZONES.map((zone, idx) => {
      const zoneTempOffset = (Math.random() - 0.5) * 0.8;
      const zoneHumOffset = (Math.random() - 0.5) * 2;
      const temp = parseFloat((zone.baseTemp + (this.currentTemperature - 24.5) * 0.4 + zoneTempOffset).toFixed(1));
      const humidity = parseFloat((zone.baseHumidity + (this.currentHumidity - 58) * 0.5 + zoneHumOffset).toFixed(1));
      
      let zoneStatus = STATUS_TYPES.OK;
      if (idx === 2 && status !== STATUS_TYPES.OK) {
        zoneStatus = status;
      } else if (temp > zone.tempRange[1] || temp < zone.tempRange[0]) {
        zoneStatus = STATUS_TYPES.WARN;
      }

      return {
        id: zone.id,
        name: zone.name,
        temperature: temp,
        humidity: humidity,
        status: zoneStatus,
        activeSensors: 8,
        conveyorLoadPct: Math.round(65 + Math.random() * 25)
      };
    });

    const payload = {
      temperature: this.currentTemperature,
      humidity: this.currentHumidity,
      activeMachines: this.currentActiveMachines,
      totalMachines: THRESHOLDS.MACHINES.TOTAL,
      powerKw: this.currentPowerKw,
      conveyorSpeed: this.currentConveyorSpeed,
      airQualityAqi: this.airQualityAqi,
      status: status,
      eventType: eventType,
      message: message,
      zones: zones,
      timestamp: now
    };

    if (saveToHistory) {
      this.history.push(payload);
      if (this.history.length > this.maxHistoryLength) {
        this.history.shift();
      }
    }

    return payload;
  }

  getLatestTelemetry() {
    if (this.history.length === 0) {
      return this.generateSample();
    }
    return this.history[this.history.length - 1];
  }

  getHistory(limit = 30) {
    return this.history.slice(-limit);
  }
}

// Singleton generator instance
const telemetryGenerator = new TelemetryGenerator();

module.exports = telemetryGenerator;
