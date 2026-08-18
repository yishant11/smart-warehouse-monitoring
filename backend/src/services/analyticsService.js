const telemetryGenerator = require('./telemetryGenerator');
const { WAREHOUSE_ZONES } = require('../utils/constants');

class AnalyticsService {
  getSummaryStats() {
    const history = telemetryGenerator.getHistory(50);
    const latest = telemetryGenerator.getLatestTelemetry();

    if (!history.length) {
      return {
        averageTemperature: 24.2,
        averageHumidity: 59.5,
        totalEvents: 42,
        activeMachines: 20,
        totalMachines: 30,
        machineUtilizationRate: "66.7%",
        averagePowerKw: 196.5,
        temperatureDelta: "+1.8%",
        humidityDelta: "-0.5%",
        powerDelta: "+3.2%",
        lastUpdated: new Date().toISOString()
      };
    }

    // Split history into current window (latest half) and previous window (first half) to calculate genuine trend deltas!
    const mid = Math.floor(history.length / 2);
    const prevWindow = history.slice(0, mid);
    const currWindow = history.slice(mid);

    const calcAvg = (arr, key) => arr.reduce((acc, curr) => acc + (curr[key] || 0), 0) / (arr.length || 1);

    const avgTempCurr = calcAvg(currWindow, 'temperature');
    const avgTempPrev = calcAvg(prevWindow, 'temperature');
    const tempDeltaPct = avgTempPrev > 0 ? (((avgTempCurr - avgTempPrev) / avgTempPrev) * 100).toFixed(1) : '0.0';
    const tempDeltaSign = parseFloat(tempDeltaPct) >= 0 ? `+${tempDeltaPct}%` : `${tempDeltaPct}%`;

    const avgHumCurr = calcAvg(currWindow, 'humidity');
    const avgHumPrev = calcAvg(prevWindow, 'humidity');
    const humDeltaPct = avgHumPrev > 0 ? (((avgHumCurr - avgHumPrev) / avgHumPrev) * 100).toFixed(1) : '0.0';
    const humDeltaSign = parseFloat(humDeltaPct) >= 0 ? `+${humDeltaPct}%` : `${humDeltaPct}%`;

    const avgPowerCurr = calcAvg(currWindow, 'powerKw');
    const avgPowerPrev = calcAvg(prevWindow, 'powerKw');
    const powerDeltaPct = avgPowerPrev > 0 ? (((avgPowerCurr - avgPowerPrev) / avgPowerPrev) * 100).toFixed(1) : '0.0';
    const powerDeltaSign = parseFloat(powerDeltaPct) >= 0 ? `+${powerDeltaPct}%` : `${powerDeltaPct}%`;

    const alertCount = history.filter(h => h.status !== 'OK' || h.eventType === 'ALERT').length;

    return {
      averageTemperature: parseFloat(avgTempCurr.toFixed(1)),
      averageHumidity: parseFloat(avgHumCurr.toFixed(1)),
      totalEvents: 140 + history.length,
      activeAlertsCount: alertCount,
      activeMachines: latest.activeMachines,
      totalMachines: latest.totalMachines || 30,
      machineUtilizationRate: `${((latest.activeMachines / (latest.totalMachines || 30)) * 100).toFixed(1)}%`,
      averagePowerKw: parseFloat(avgPowerCurr.toFixed(1)),
      averageConveyorSpeed: parseFloat(calcAvg(currWindow, 'conveyorSpeed').toFixed(2)),
      temperatureDelta: tempDeltaSign,
      humidityDelta: humDeltaSign,
      powerDelta: powerDeltaSign,
      efficiencyScore: Math.min(99, Math.round(92 - (avgTempCurr > 26 ? (avgTempCurr - 26) * 5 : 0) + (latest.activeMachines / 30) * 8)),
      lastUpdated: new Date().toISOString()
    };
  }

  getAnalyticsTimeSeries(range = '24h', zone = 'all') {
    // Generate coherent historical timeline points for charts
    const pointsCount = range === '1h' ? 12 : range === '6h' ? 24 : range === '24h' ? 24 : 7;
    const intervalMinutes = range === '1h' ? 5 : range === '6h' ? 15 : range === '24h' ? 60 : 1440;
    
    const now = Date.now();
    const series = [];

    for (let i = pointsCount - 1; i >= 0; i--) {
      const timeObj = new Date(now - i * intervalMinutes * 60 * 1000);
      const timeLabel = range === '7d'
        ? timeObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        : timeObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

      // Daily pattern oscillation
      const hour = timeObj.getHours();
      const tempSine = Math.sin((hour - 8) / 24 * 2 * Math.PI) * 2.2;
      const humSine = -Math.sin((hour - 8) / 24 * 2 * Math.PI) * 6.5;

      const baseTemp = zone === 'zone-a' ? 4.5 : zone === 'zone-c' ? 26.5 : 24.0;
      const baseHum = zone === 'zone-a' ? 50.0 : zone === 'zone-c' ? 64.0 : 58.0;

      const temp = parseFloat((baseTemp + tempSine + (Math.random() - 0.5) * 0.8).toFixed(1));
      const humidity = parseFloat((baseHum + humSine + (Math.random() - 0.5) * 2).toFixed(1));
      const machines = Math.round(18 + Math.sin(hour / 12 * Math.PI) * 6 + (Math.random() - 0.5) * 2);
      const power = parseFloat((140 + machines * 4 + (Math.random() - 0.5) * 10).toFixed(1));
      const throughput = Math.round(350 + machines * 25 + Math.random() * 40);

      series.push({
        timestamp: timeObj.toISOString(),
        label: timeLabel,
        temperature: temp,
        humidity: humidity,
        activeMachines: Math.max(10, Math.min(30, machines)),
        powerKw: power,
        throughputUnits: throughput,
        zoneA_temp: parseFloat((4.5 + (Math.random() - 0.5) * 0.5).toFixed(1)),
        zoneB_temp: parseFloat((23.0 + tempSine * 0.7).toFixed(1)),
        zoneC_temp: parseFloat((26.2 + tempSine * 1.1).toFixed(1)),
        zoneD_temp: parseFloat((24.1 + tempSine * 0.9).toFixed(1))
      });
    }

    return {
      range,
      zone,
      dataPoints: series,
      zones: WAREHOUSE_ZONES,
      lastUpdated: new Date().toISOString()
    };
  }
}

const analyticsService = new AnalyticsService();

module.exports = analyticsService;
