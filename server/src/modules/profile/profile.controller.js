const asyncHandler = require('../../middlewares/asyncHandler');
const { analyzeProfile } = require('./profile.service');

const analyze = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username || username.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'GitHub username is required' });
  }

  const result = await analyzeProfile(username.trim());
  res.json({ success: true, data: result });
});

module.exports = { analyze };
