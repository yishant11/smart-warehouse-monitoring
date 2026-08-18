const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/alerts', alertController.getAlerts);
router.get('/alerts/:id', alertController.getAlertById);
router.post('/alerts/:id/acknowledge', authenticateToken, alertController.acknowledgeAlert);
router.post('/alerts/:id/resolve', authenticateToken, alertController.resolveAlert);
router.post('/alerts', alertController.createAlert);

module.exports = router;
