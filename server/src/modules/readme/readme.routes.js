const express = require('express');
const router = express.Router();
const { generate } = require('./readme.controller');

// POST /api/readme/generate
router.post('/generate', generate);

module.exports = router;
