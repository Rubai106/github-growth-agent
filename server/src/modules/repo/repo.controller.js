const asyncHandler = require('../../middlewares/asyncHandler');
const { analyzeRepo } = require('./repo.service');

const analyze = asyncHandler(async (req, res) => {
  const { repoUrl } = req.body;

  if (!repoUrl || typeof repoUrl !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'repoUrl is required. Provide a GitHub repo URL like https://github.com/owner/repo',
    });
  }

  const result = await analyzeRepo(repoUrl.trim());
  res.json({ success: true, data: result });
});

module.exports = { analyze };
