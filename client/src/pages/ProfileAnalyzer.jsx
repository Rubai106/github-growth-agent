import { useState } from 'react';
import { analyzeProfile } from '../services/api';
import ScoreCircle from '../components/ui/ScoreCircle';
import SuggestionList from '../components/ui/SuggestionList';
import ReportCard from '../components/ui/ReportCard';

function StatBlock({ label, value }) {
  return (
    <div className="stat-block">
      <span className="text-xl font-bold text-white font-mono">{value}</span>
      <span className="text-xs text-white/60">{label}</span>
    </div>
  );
}

function BreakdownBar({ label, value, max, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-white/50 w-32 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: color, transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </div>
      <span className="text-xs font-mono text-white/60 w-12 text-right">{value}/25</span>
    </div>
  );
}

function RepoCard({ repo }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      className="block card p-4 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-150 group"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">
          {repo.name}
        </span>
        <span className="text-xs font-mono text-white/40 flex items-center gap-1 shrink-0">
          ⭐ {repo.stars}
        </span>
      </div>
      {repo.description && (
        <p className="text-xs text-white/40 line-clamp-2 leading-relaxed mb-2">{repo.description}</p>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        {repo.language && (
          <span className="badge-blue text-[10px] rounded-full">{repo.language}</span>
        )}
        {repo.forks > 0 && (
          <span className="text-[10px] text-white/30">🍴 {repo.forks}</span>
        )}
      </div>
    </a>
  );
}

export default function ProfileAnalyzer() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  async function handleSubmit(e) {
    e.preventDefault();
    const u = username.trim();
    if (!u) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await analyzeProfile(u);
      setData(res.data);
      setActiveTab('overview');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const breakdownMeta = data
    ? [
        { label: 'Completeness', value: data.score.breakdown.completeness, max: 25, color: '#4d6fff' },
        { label: 'Repositories', value: data.score.breakdown.repositories, max: 25, color: '#10b981' },
        { label: 'Community',    value: data.score.breakdown.community,    max: 25, color: '#f59e0b' },
        { label: 'Longevity',    value: data.score.breakdown.longevity,    max: 25, color: '#a855f7' },
      ]
    : [];

  const tabs = ['overview', 'repositories', 'suggestions', 'report card'];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 animate-fadeUp">
        <h1 className="section-title mb-1">Profile Analyzer</h1>
        <p className="section-sub">Score any public GitHub profile and get a shareable report card.</p>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <input
          className="input flex-1"
          type="text"
          placeholder="Enter GitHub username (e.g. torvalds)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn-primary px-6" disabled={loading || !username.trim()}>
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Analyzing…
            </>
          ) : (
            'Analyze'
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="animate-pulse flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/[0.03]" />
          ))}
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <div className="animate-fadeUp">
          {/* Profile header */}
          <div className="card p-5 mb-6 flex items-start gap-5">
            <img
              src={data.profile.avatarUrl}
              alt={data.profile.login}
              className="w-16 h-16 rounded-2xl object-cover border border-white/10 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-lg font-bold text-white">{data.profile.name || data.profile.login}</h2>
                <span className="font-mono text-sm text-white/40">@{data.profile.login}</span>
              </div>
              {data.profile.bio && (
                <p className="text-sm text-white/50 leading-relaxed mb-2">{data.profile.bio}</p>
              )}
              <div className="flex flex-wrap gap-3 text-xs text-white/30">
                {data.profile.company && <span>🏢 {data.profile.company}</span>}
                {data.profile.location && <span>📍 {data.profile.location}</span>}
                {data.profile.blog && (
                  <a href={data.profile.blog} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline">
                    🔗 {data.profile.blog}
                  </a>
                )}
                <span>📅 {data.profile.accountAgeYears}y on GitHub</span>
              </div>
            </div>
            <a
              href={data.profile.url}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost shrink-0 text-xs"
            >
              View Profile →
            </a>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-white/[0.06] pb-0">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors duration-150 border-b-2 -mb-px ${
                  activeTab === t
                    ? 'border-brand-500 text-white'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab: Overview */}
          {activeTab === 'overview' && (
            <div className="stagger">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-fadeUp">
                <div className="card p-6 flex flex-col items-center justify-center gap-2">
                  <ScoreCircle score={data.score.total} grade={data.score.grade} size={140} />
                  <p className="text-xs text-white/40 font-mono uppercase tracking-wider">Profile Score</p>
                </div>
                <div className="col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fadeUp">
                  <StatBlock label="Public Repos" value={data.profile.publicRepos} />
                  <StatBlock label="Total Stars" value={data.stats.totalStars.toLocaleString()} />
                  <StatBlock label="Followers" value={data.profile.followers.toLocaleString()} />
                  <StatBlock label="Following" value={data.profile.following.toLocaleString()} />
                  <StatBlock label="Total Forks" value={data.stats.totalForks.toLocaleString()} />
                  <StatBlock label="Languages" value={data.stats.languages.length} />
                </div>
              </div>

              <div className="card p-5 mb-4 animate-fadeUp">
                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Score Breakdown</h3>
                <div className="flex flex-col gap-3">
                  {breakdownMeta.map((b) => (
                    <BreakdownBar key={b.label} {...b} />
                  ))}
                </div>
              </div>

              {data.stats.languages.length > 0 && (
                <div className="card p-5 animate-fadeUp">
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.stats.languages.map((l) => (
                      <span key={l} className="badge-blue rounded-full text-xs">{l}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Repositories */}
          {activeTab === 'repositories' && (
            <div className="animate-fadeUp">
              {data.stats.topRepos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.stats.topRepos.map((repo) => (
                    <RepoCard key={repo.name} repo={repo} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/40">No public repositories found.</p>
              )}
            </div>
          )}

          {/* Tab: Suggestions */}
          {activeTab === 'suggestions' && (
            <div className="animate-fadeUp">
              <SuggestionList suggestions={data.suggestions} />
            </div>
          )}

          {/* Tab: Report Card */}
          {activeTab === 'report card' && (
            <div className="animate-fadeUp max-w-lg">
              <ReportCard data={data} type="profile" />
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!data && !loading && !error && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4 text-white/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <p className="text-sm text-white/30">Enter a GitHub username above to begin</p>
          <div className="flex gap-2 mt-4">
            {['torvalds', 'gaearon', 'sindresorhus'].map((u) => (
              <button
                key={u}
                onClick={() => { setUsername(u); }}
                className="text-xs text-brand-400/60 hover:text-brand-400 font-mono px-2 py-1 rounded border border-white/5 hover:border-brand-500/20 transition-all"
              >
                @{u}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
