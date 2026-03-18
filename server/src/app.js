const express = require('express');
const cors = require('cors');

const errorHandler = require('./middlewares/errorHandler');
const repoRoutes = require('./modules/repo/repo.routes');
const readmeRoutes = require('./modules/readme/readme.routes');
const profileRoutes = require('./modules/profile/profile.routes');

const app = express();

// Middlewares
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

// API Routes
app.use('/api/repo', repoRoutes);
app.use('/api/readme', readmeRoutes);
app.use('/api/profile', profileRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'GitHub Growth Agent API is running',
    hasToken: !!process.env.GITHUB_TOKEN,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
