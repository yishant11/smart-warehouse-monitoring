const telemetryGenerator = require('../services/telemetryGenerator');

function streamTelemetry(req, res) {
  // Set headers for Server-Sent Events (SSE)
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'X-Accel-Buffering': 'no' // Disable proxy buffering for nginx if any
  });

  // Flush initial connection event
  const initialData = telemetryGenerator.generateSample();
  res.write(`data: ${JSON.stringify(initialData)}\n\n`);

  // Interval for streaming telemetry updates
  const intervalMs = parseInt(process.env.STREAM_INTERVAL_MS, 10) || 1500;
  
  const intervalId = setInterval(() => {
    try {
      const sample = telemetryGenerator.generateSample();
      res.write(`data: ${JSON.stringify(sample)}\n\n`);
    } catch (err) {
      console.error('[SSE Stream Error]', err);
    }
  }, intervalMs);

  // Keep-alive heartbeat every 15s to prevent intermediate timeout
  const heartbeatId = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 15000);

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(intervalId);
    clearInterval(heartbeatId);
    res.end();
  });
}

function simulateAnomaly(req, res) {
  const { type = 'TEMPERATURE_SPIKE', duration = 15000 } = req.body;
  const result = telemetryGenerator.injectAnomaly(type, duration);
  res.status(200).json(result);
}

module.exports = {
  streamTelemetry,
  simulateAnomaly
};
