const authService = require('../services/authService');

function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password.'
    });
  }

  const clientInfo = {
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent']
  };

  const result = authService.login(email, password, clientInfo);

  if (!result.success) {
    return res.status(401).json(result);
  }

  return res.status(200).json(result);
}

function logout(req, res) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  const result = authService.logout(token);
  return res.status(200).json(result);
}

function getSession(req, res) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No authorization token found.'
    });
  }

  const result = authService.getSession(token);

  if (!result.success) {
    return res.status(401).json(result);
  }

  return res.status(200).json(result);
}

module.exports = {
  login,
  logout,
  getSession
};
