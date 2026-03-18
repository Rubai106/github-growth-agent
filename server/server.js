require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 GitHub Growth Agent API running on http://localhost:${PORT}`);
  if (!process.env.GITHUB_TOKEN) {
    console.log('⚠️  No GITHUB_TOKEN set — limited to 60 requests/hour.');
    console.log('   Add token in .env for 5000 requests/hour.');
  }
});
