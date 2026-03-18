const axios = require('axios');
const { GITHUB_API_BASE, GITHUB_TOKEN } = require('./index');

const githubClient = axios.create({
  baseURL: GITHUB_API_BASE,
  timeout: 10000,
  headers: {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-Growth-Agent/1.0',
    ...(GITHUB_TOKEN && { Authorization: `Bearer ${GITHUB_TOKEN}` }),
  },
});

// Log rate limit info in development
githubClient.interceptors.response.use(
  (response) => {
    const remaining = response.headers['x-ratelimit-remaining'];
    if (remaining !== undefined && Number(remaining) < 10) {
      console.warn(`⚠️  GitHub API rate limit low: ${remaining} requests remaining`);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

module.exports = githubClient;
