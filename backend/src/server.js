require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const streamRoutes = require('./routes/streamRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const alertRoutes = require('./routes/alertRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging in development
app.use((req, res, next) => {
  if (req.path !== '/api/stream') {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  }
  next();
});

// Root / Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    service: 'Smart Warehouse Monitoring Telemetry Core',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Route Mounting
app.use('/api/auth', authRoutes);
app.use('/api', streamRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/dashboard', alertRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found.`
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Smart Warehouse Backend Telemetry Server`);
  console.log(`📡 Listening on http://localhost:${PORT}`);
  console.log(`⚡ SSE Real-Time Stream at http://localhost:${PORT}/api/stream`);
  console.log(`🔐 JWT Auth endpoints at http://localhost:${PORT}/api/auth/*`);
  console.log(`📊 Periodic Dashboard APIs at http://localhost:${PORT}/api/dashboard/*`);
  console.log(`=======================================================`);
});
