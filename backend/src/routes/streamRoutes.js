const express = require('express');
const router = express.Router();
const streamController = require('../controllers/streamController');

// GET /api/stream - Server-Sent Events real-time stream
router.get('/stream', streamController.streamTelemetry);

// POST /api/stream/simulate-anomaly - Trigger manual anomaly for testing
router.post('/simulate-anomaly', streamController.simulateAnomaly);

module.exports = router;
