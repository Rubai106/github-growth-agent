// Vercel serverless function for the Express app
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('../server/src/middlewares/errorHandler');
const repoRoutes = require('../server/src/modules/repo/repo.routes');
const readmeRoutes = require('../server/src/modules/readme/readme.routes');
const profileRoutes = require('../server/src/modules/profile/profile.routes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/profile', profileRoutes);
app.use('/api/readme', readmeRoutes);
app.use('/api/repo', repoRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'GitHub Growth Agent API is running',
    hasToken: !!process.env.GITHUB_TOKEN,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handling (must be last)
app.use(errorHandler);

module.exports = app;
