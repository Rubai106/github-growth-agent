const asyncHandler = require('../../middlewares/asyncHandler');
const { generateReadme } = require('./readme.service');

const generate = asyncHandler(async (req, res) => {
  const data = req.body;

  if (!data.projectName || typeof data.projectName !== 'string' || !data.projectName.trim()) {
    return res.status(400).json({
      success: false,
      message: 'projectName is required',
    });
  }

  const content = generateReadme(data);

  res.json({
    success: true,
    data: {
      content,
      filename: `${data.projectName.toLowerCase().replace(/\s+/g, '-')}-README.md`,
    },
  });
});

module.exports = { generate };
