const express = require('express');
const router = express.Router();
const { analyze } = require('./repo.controller');

// POST /api/repo/analyze
router.post('/analyze', analyze);

module.exports = router;
