const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Summary & analytics endpoints used for periodic polling
router.get('/summary', dashboardController.getDashboardSummary);
router.get('/analytics', dashboardController.getAnalyticsData);
router.get('/zones', dashboardController.getWarehouseZones);

// Example protected endpoint to test authorized access
router.get('/protected-stats', authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authorized access to internal warehouse telemetry logs.',
    user: req.user
  });
});

module.exports = router;
