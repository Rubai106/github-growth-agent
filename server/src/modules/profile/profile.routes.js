const express = require('express');
const router = express.Router();
const { analyze } = require('./profile.controller');

// GET /api/profile/:username
router.get('/:username', analyze);

module.exports = router;
