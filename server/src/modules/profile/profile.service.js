const githubClient = require('../../config/github');

// ─────────────────────────────────────────────
//  Profile Score Calculator (0–100)
//  Categories:
//    completeness  (25 pts)
//    repositories  (25 pts)
//    community     (25 pts)
//    longevity     (25 pts)
// ─────────────────────────────────────────────
function calculateProfileScore(user, repos) {
  const scores = {
    completeness: 0,
    repositories: 0,
    community: 0,
    longevity: 0,
  };

  // ── Completeness (25 pts) ──
  if (user.name) scores.completeness += 5;
  if (user.bio && user.bio.trim().length > 5) scores.completeness += 8;
  if (user.company) scores.completeness += 3;
  if (user.blog) scores.completeness += 5;
  if (user.location) scores.completeness += 2;
  if (user.twitter_username) scores.completeness += 2;

  // ── Repositories (25 pts) ──
  const repoCount = user.public_repos;
  if (repoCount >= 30) scores.repositories += 10;
  else if (repoCount >= 15) scores.repositories += 7;
  else if (repoCount >= 8) scores.repositories += 5;
  else if (repoCount >= 3) scores.repositories += 2;

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  if (totalStars >= 500) scores.repositories += 15;
  else if (totalStars >= 100) scores.repositories += 10;
  else if (totalStars >= 30) scores.repositories += 7;
  else if (totalStars >= 10) scores.repositories += 4;
  else if (totalStars >= 1) scores.repositories += 1;

  // ── Community (25 pts) ──
  const followers = user.followers;
  if (followers >= 500) scores.community += 15;
  else if (followers >= 100) scores.community += 10;
  else if (followers >= 25) scores.community += 7;
  else if (followers >= 10) scores.community += 4;
  else if (followers >= 1) scores.community += 1;

  // Healthy following ratio (not spamming follows)
  const ratio = user.following > 0 ? followers / user.following : 1;
  if (ratio >= 1) scores.community += 10;
  else if (ratio >= 0.5) scores.community += 6;
  else scores.community += 2;

  // ── Longevity (25 pts) ──
  const accountAgeYears =
    (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365);
  if (accountAgeYears >= 5) scores.longevity += 25;
  else if (accountAgeYears >= 3) scores.longevity += 18;
  else if (accountAgeYears >= 2) scores.longevity += 13;
  else if (accountAgeYears >= 1) scores.longevity += 8;
  else scores.longevity += 3;

  Object.keys(scores).forEach((k) => {
    scores[k] = Math.min(Math.round(scores[k]), 25);
  });

  const total = Math.min(
    scores.completeness + scores.repositories + scores.community + scores.longevity,
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
//  Profile Suggestions
// ─────────────────────────────────────────────
function generateProfileSuggestions(user, repos) {
  const suggestions = [];
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);

  // Critical
  if (!user.bio || user.bio.trim().length < 5) {
    suggestions.push({
      type: 'critical',
      category: 'Profile',
      text: 'Add a bio to your GitHub profile. It\'s the first thing visitors read — describe your role, expertise, and what you build.',
    });
  }

  // Important
  if (!user.blog) {
    suggestions.push({
      type: 'important',
      category: 'Profile',
      text: 'Link your portfolio or personal website. It significantly increases credibility for hiring managers and collaborators.',
    });
  }
  if (user.public_repos < 6) {
    suggestions.push({
      type: 'important',
      category: 'Repositories',
      text: 'Add at least 6 public repositories. Profiles with fewer than 6 repos feel incomplete. Even small learning projects are worth making public.',
    });
  }
  if (totalStars < 5) {
    suggestions.push({
      type: 'important',
      category: 'Growth',
      text: 'Focus on one quality project and actively promote it on dev communities (Dev.to, Reddit r/webdev, Twitter/X). Stars follow genuine value.',
    });
  }

  // Tips
  if (!user.company) {
    suggestions.push({
      type: 'tip',
      category: 'Profile',
      text: 'Add your company or "Open to work" in the company field. It helps with discoverability in GitHub\'s hiring tools.',
    });
  }
  if (!user.location) {
    suggestions.push({
      type: 'tip',
      category: 'Profile',
      text: 'Add your location. Developers with location info receive more recruiter outreach and local community invitations.',
    });
  }
  if (!user.twitter_username) {
    suggestions.push({
      type: 'tip',
      category: 'Social',
      text: 'Link your Twitter/X account. Cross-promoting your GitHub work on Twitter is one of the fastest ways to grow your audience.',
    });
  }

  const languages = new Set(repos.map((r) => r.language).filter(Boolean));
  if (languages.size < 2) {
    suggestions.push({
      type: 'tip',
      category: 'Repositories',
      text: 'Your repos mostly use one language. Contributing to projects in 2–3 languages shows versatility and broadens your opportunities.',
    });
  }

  suggestions.push({
    type: 'tip',
    category: 'Profile',
    text: 'Pin your 6 best repositories on your profile page. Pinned repos are the most visible section — choose projects that show range and quality.',
  });

  // Only include first 8 suggestions
  return suggestions.slice(0, 8);
}

// ─────────────────────────────────────────────
//  Main Service Function
// ─────────────────────────────────────────────
async function analyzeProfile(username) {
  const [userResult, reposResult] = await Promise.allSettled([
    githubClient.get(`/users/${username}`),
    githubClient.get(`/users/${username}/repos?sort=stars&direction=desc&per_page=30`),
  ]);

  if (userResult.status === 'rejected') {
    const axiosErr = userResult.reason;
    const status = axiosErr.response?.status;
    if (status === 404) throw new Error(`GitHub user "${username}" not found. Check the username spelling.`);
    if (status === 403) throw new Error('GitHub API rate limit reached. Add a GITHUB_TOKEN in the server .env file.');
    throw new Error('Failed to fetch user data. Please try again.');
  }

  const user = userResult.value.data;
  const repos = reposResult.status === 'fulfilled' ? reposResult.value.data : [];

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
  const languages = [...new Set(repos.map((r) => r.language).filter(Boolean))];

  const topRepos = repos.slice(0, 8).map((r) => ({
    name: r.name,
    description: r.description || null,
    url: r.html_url,
    stars: r.stargazers_count,
    forks: r.forks_count,
    language: r.language || null,
    updatedAt: r.updated_at,
    topics: r.topics || [],
  }));

  const { scores, total, grade } = calculateProfileScore(user, repos);
  const suggestions = generateProfileSuggestions(user, repos);

  const accountAgeYears =
    (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365);

  return {
    profile: {
      login: user.login,
      name: user.name || null,
      bio: user.bio || null,
      avatarUrl: user.avatar_url,
      url: user.html_url,
      company: user.company || null,
      blog: user.blog || null,
      location: user.location || null,
      email: user.email || null,
      twitterUsername: user.twitter_username || null,
      hireable: user.hireable,
      publicRepos: user.public_repos,
      publicGists: user.public_gists,
      followers: user.followers,
      following: user.following,
      createdAt: user.created_at,
      accountAgeYears: Math.floor(accountAgeYears * 10) / 10,
    },
    stats: {
      totalStars,
      totalForks,
      languages,
      topRepos,
    },
    score: { total, grade, breakdown: scores },
    suggestions,
  };
}

module.exports = { analyzeProfile };
