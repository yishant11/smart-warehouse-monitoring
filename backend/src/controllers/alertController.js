const alertService = require('../services/alertService');

function getAlerts(req, res) {
  const { severity, status, search, sortBy } = req.query;
  const result = alertService.getAlerts({ severity, status, search, sortBy });
  res.status(200).json({
    success: true,
    data: result
  });
}

function getAlertById(req, res) {
  const { id } = req.params;
  const alert = alertService.getAlertById(id);

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: `Alert with ID "${id}" not found.`
    });
  }

  res.status(200).json({
    success: true,
    data: alert
  });
}

function acknowledgeAlert(req, res) {
  const { id } = req.params;
  const userName = req.user ? req.user.name : 'Admin Operator';

  const updated = alertService.acknowledgeAlert(id, userName);
  if (!updated) {
    return res.status(404).json({
      success: false,
      message: `Alert with ID "${id}" not found.`
    });
  }

  res.status(200).json({
    success: true,
    message: 'Alert acknowledged successfully.',
    data: updated
  });
}

function resolveAlert(req, res) {
  const { id } = req.params;
  const updated = alertService.resolveAlert(id);

  if (!updated) {
    return res.status(404).json({
      success: false,
      message: `Alert with ID "${id}" not found.`
    });
  }

  res.status(200).json({
    success: true,
    message: 'Alert marked as resolved.',
    data: updated
  });
}

function createAlert(req, res) {
  const newAlert = alertService.createAlert(req.body);
  res.status(201).json({
    success: true,
    message: 'New alert generated.',
    data: newAlert
  });
}

module.exports = {
  getAlerts,
  getAlertById,
  acknowledgeAlert,
  resolveAlert,
  createAlert
};
