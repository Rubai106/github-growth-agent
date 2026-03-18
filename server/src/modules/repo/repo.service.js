const githubClient = require('../../config/github');

// ─────────────────────────────────────────────
//  URL Parser
// ─────────────────────────────────────────────
function parseRepoUrl(input) {
  const cleaned = input.trim().replace(/\.git$/, '');

  // Handle full URLs: https://github.com/owner/repo
  const urlMatch = cleaned.match(/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/);
  if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2] };

  // Handle shorthand: owner/repo
  const shortMatch = cleaned.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);
  if (shortMatch) return { owner: shortMatch[1], repo: shortMatch[2] };

  throw new Error('Invalid GitHub repo format. Use https://github.com/owner/repo or owner/repo');
}

// ─────────────────────────────────────────────
//  Score Calculator (0–100)
//  Categories:
//    documentation  (30 pts)
//    community      (25 pts)
//    activity       (25 pts)
//    popularity     (20 pts)
// ─────────────────────────────────────────────
function calculateScore(repoData) {
  const scores = {
    documentation: 0,
    community: 0,
    activity: 0,
    popularity: 0,
  };

  // ── Documentation (30 pts) ──
  if (repoData.hasReadme) scores.documentation += 15;
  if (repoData.description && repoData.description.trim().length > 10) scores.documentation += 10;
  if (repoData.homepage) scores.documentation += 5;

  // ── Community (25 pts) ──
  if (repoData.license) scores.community += 10;
  if (repoData.topics && repoData.topics.length > 0) scores.community += 10;
  if (repoData.has_wiki) scores.community += 5;

  // ── Activity (25 pts) ──
  const daysSinceUpdate =
    (Date.now() - new Date(repoData.updated_at).getTime()) / (1000 * 60 * 60 * 24);

  if (daysSinceUpdate < 30) scores.activity += 20;
  else if (daysSinceUpdate < 90) scores.activity += 15;
  else if (daysSinceUpdate < 180) scores.activity += 10;
  else if (daysSinceUpdate < 365) scores.activity += 5;
  else scores.activity += 0;

  if (!repoData.archived) scores.activity += 5;

  // ── Popularity (20 pts) ──
  const starPts = Math.min(Math.floor(Math.log2(repoData.stargazers_count + 1) * 2), 12);
  const forkPts = Math.min(Math.floor(Math.log2(repoData.forks_count + 1) * 1.5), 8);
  scores.popularity += starPts + forkPts;

  // Round each category
  Object.keys(scores).forEach((k) => {
    scores[k] = Math.round(scores[k]);
  });

  const total = Math.min(
    scores.documentation + scores.community + scores.activity + scores.popularity,
    100
  );

  const grade =
    total >= 80 ? 'A'
    : total >= 65 ? 'B'
    : total >= 50 ? 'C'
    : total >= 35 ? 'D'
    : 'F';

  return { scores, total, grade };
}

// ─────────────────────────────────────────────
//  Suggestion Generator
// ─────────────────────────────────────────────
function generateSuggestions(repoData) {
  const suggestions = [];
  const daysSinceUpdate =
    (Date.now() - new Date(repoData.updated_at).getTime()) / (1000 * 60 * 60 * 24);

  // Critical issues
  if (!repoData.hasReadme) {
    suggestions.push({
      type: 'critical',
      category: 'Documentation',
      text: 'Your repo has no README.md. This is the first thing visitors see — use the README Generator in this app to create one now.',
    });
  }
  if (!repoData.description || repoData.description.trim().length < 10) {
    suggestions.push({
      type: 'critical',
      category: 'Documentation',
      text: 'Add a repository description in your GitHub repo settings. A clear one-line description improves search ranking and first impressions.',
    });
  }

  // Important issues
  if (!repoData.license) {
    suggestions.push({
      type: 'important',
      category: 'Community',
      text: 'No license found. Without a license, others legally cannot use or contribute to your code. Add MIT or Apache 2.0 via GitHub (Add file → LICENSE).',
    });
  }
  if (!repoData.topics || repoData.topics.length === 0) {
    suggestions.push({
      type: 'important',
      category: 'Discoverability',
      text: 'Add topics/tags to your repo (Settings → Topics). They help your repo appear in GitHub topic searches and improve SEO.',
    });
  }
  if (daysSinceUpdate > 180) {
    suggestions.push({
      type: 'important',
      category: 'Activity',
      text: `This repo hasn't been updated in ${Math.floor(daysSinceUpdate / 30)} months. Even small updates (fixing typos, bumping dependencies) signal an active project.`,
    });
  }

  // Tips
  if (!repoData.homepage) {
    suggestions.push({
      type: 'tip',
      category: 'Documentation',
      text: 'Add a homepage URL to your repo (a live demo, documentation site, or your portfolio). It builds credibility and increases clicks.',
    });
  }
  if (!repoData.has_wiki) {
    suggestions.push({
      type: 'tip',
      category: 'Community',
      text: 'Enable the Wiki feature (Settings → Features → Wiki) for in-depth documentation that keeps your README clean.',
    });
  }
  if (repoData.open_issues_count > 30) {
    suggestions.push({
      type: 'tip',
      category: 'Maintenance',
      text: `You have ${repoData.open_issues_count} open issues. Triage them with labels like "good first issue" and "help wanted" to attract contributors.`,
    });
  }
  if (repoData.stargazers_count < 10) {
    suggestions.push({
      type: 'tip',
      category: 'Growth',
      text: 'Share your project on r/programming, r/webdev, Hacker News (Show HN), Dev.to, and Twitter/X to get your first stars. Timing matters — post on weekday mornings.',
    });
  }
  if (!repoData.topics || repoData.topics.length < 3) {
    suggestions.push({
      type: 'tip',
      category: 'Discoverability',
      text: 'Add 5–10 relevant topics. Include the language, framework, and problem domain (e.g., "react", "dashboard", "data-visualization").',
    });
  }

  return suggestions;
}

// ─────────────────────────────────────────────
//  Main Service Function
// ─────────────────────────────────────────────
async function analyzeRepo(repoUrl) {
  const { owner, repo } = parseRepoUrl(repoUrl);

  // Fetch repo data and README in parallel
  const [repoResult, readmeResult] = await Promise.allSettled([
    githubClient.get(`/repos/${owner}/${repo}`),
    githubClient.get(`/repos/${owner}/${repo}/readme`),
  ]);

  // Handle repo fetch errors
  if (repoResult.status === 'rejected') {
    const axiosErr = repoResult.reason;
    const status = axiosErr.response?.status;
    if (status === 404) throw new Error(`Repository "${owner}/${repo}" not found. Make sure it is public and the URL is correct.`);
    if (status === 403) throw new Error('GitHub API rate limit reached. Add a GITHUB_TOKEN in the server .env file to increase the limit to 5000/hour.');
    if (status === 401) throw new Error('Invalid GitHub token. Check your GITHUB_TOKEN in the .env file.');
    throw new Error('Failed to fetch repository. Please check the URL and try again.');
  }

  const repoData = repoResult.value.data;
  repoData.hasReadme = readmeResult.status === 'fulfilled';

  const { scores, total, grade } = calculateScore(repoData);
  const suggestions = generateSuggestions(repoData);

  return {
    repo: {
      name: repoData.name,
      fullName: repoData.full_name,
      description: repoData.description || null,
      url: repoData.html_url,
      homepage: repoData.homepage || null,
      language: repoData.language || null,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      openIssues: repoData.open_issues_count,
      watchers: repoData.watchers_count,
      topics: repoData.topics || [],
      license: repoData.license?.spdx_id || repoData.license?.name || null,
      hasReadme: repoData.hasReadme,
      hasWiki: repoData.has_wiki,
      archived: repoData.archived,
      fork: repoData.fork,
      defaultBranch: repoData.default_branch,
      createdAt: repoData.created_at,
      updatedAt: repoData.updated_at,
      pushedAt: repoData.pushed_at,
      size: repoData.size,
      owner: {
        login: repoData.owner.login,
        avatarUrl: repoData.owner.avatar_url,
        type: repoData.owner.type,
      },
    },
    score: { total, grade, breakdown: scores },
    suggestions,
  };
}

module.exports = { analyzeRepo };
