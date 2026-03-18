import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { analyzeRepo } from '../services/api';
import ScoreCircle from '../components/ui/ScoreCircle';
import SuggestionList from '../components/ui/SuggestionList';
import ReportCard from '../components/ui/ReportCard';

function StatBlock({ label, value, sub }) {
  return (
    <div className="stat-block">
      <span className="text-xl font-bold text-white font-mono">{value}</span>
      <span className="text-xs font-semibold text-white/70">{label}</span>
      {sub && <span className="text-[11px] text-white/30">{sub}</span>}
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
      <span className="text-xs font-mono text-white/60 w-12 text-right">
        {value}/{max}
      </span>
    </div>
  );
}

export default function RepoAnalyzer() {
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState(searchParams.get('url') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Auto-run if url param is present
  useEffect(() => {
    const preUrl = searchParams.get('url');
    if (preUrl) {
      setUrl(decodeURIComponent(preUrl));
      runAnalysis(decodeURIComponent(preUrl));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runAnalysis(inputUrl) {
    const target = (inputUrl ?? url).trim();
    if (!target) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await analyzeRepo(target);
      setData(res.data);
      setActiveTab('overview');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    runAnalysis();
  }

  const breakdownMeta = data
    ? [
        { label: 'Documentation', value: data.score.breakdown.documentation, max: 30, color: '#4d6fff' },
        { label: 'Community',     value: data.score.breakdown.community,     max: 25, color: '#10b981' },
        { label: 'Activity',      value: data.score.breakdown.activity,      max: 25, color: '#f59e0b' },
        { label: 'Popularity',    value: data.score.breakdown.popularity,    max: 20, color: '#a855f7' },
      ]
    : [];

  const tabs = ['overview', 'suggestions', 'report card'];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fadeUp">
        <h1 className="section-title mb-1">Repo Analyzer</h1>
        <p className="section-sub">Score any public GitHub repository across quality, community, activity, and popularity.</p>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <input
          className="input flex-1"
          type="text"
          placeholder="https://github.com/owner/repo  or  owner/repo"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn-primary px-6" disabled={loading || !url.trim()}>
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
          <strong className="font-semibold">Error:</strong> {error}
        </div>
      )}

      {/* Loading skeleton */}
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
          {/* Repo meta header */}
          <div className="card p-5 mb-6 flex items-start gap-5">
            <img
              src={data.repo.owner.avatarUrl}
              alt={data.repo.owner.login}
              className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-lg font-bold text-white">{data.repo.fullName}</h2>
                {data.repo.archived && <span className="badge-yellow">Archived</span>}
                {data.repo.fork && <span className="badge-gray">Fork</span>}
                {data.repo.language && (
                  <span className="badge-blue">{data.repo.language}</span>
                )}
              </div>
              {data.repo.description && (
                <p className="text-sm text-white/50 leading-relaxed mb-2">{data.repo.description}</p>
              )}
              {data.repo.homepage && (
                <a
                  href={data.repo.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand-400 hover:text-brand-300 hover:underline"
                >
                  {data.repo.homepage}
                </a>
              )}
              {data.repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {data.repo.topics.map((t) => (
                    <span key={t} className="badge-blue text-[10px] rounded-full">{t}</span>
                  ))}
                </div>
              )}
            </div>
            <a
              href={data.repo.url}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost shrink-0 text-xs"
            >
              View on GitHub →
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
                {t === 'suggestions' && data.suggestions.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-600/40 text-brand-300 text-[10px] font-bold">
                    {data.suggestions.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab: Overview */}
          {activeTab === 'overview' && (
            <div className="stagger">
              {/* Score + stats row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-fadeUp">
                {/* Score circle */}
                <div className="card p-6 flex flex-col items-center justify-center gap-2">
                  <ScoreCircle score={data.score.total} grade={data.score.grade} size={140} />
                  <p className="text-xs text-white/40 font-mono uppercase tracking-wider">Overall Score</p>
                </div>

                {/* Stats grid */}
                <div className="col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fadeUp">
                  <StatBlock label="Stars" value={data.repo.stars.toLocaleString()} />
                  <StatBlock label="Forks" value={data.repo.forks.toLocaleString()} />
                  <StatBlock label="Open Issues" value={data.repo.openIssues.toLocaleString()} />
                  <StatBlock label="Watchers" value={data.repo.watchers.toLocaleString()} />
                  <StatBlock
                    label="README"
                    value={data.repo.hasReadme ? '✓ Yes' : '✗ Missing'}
                    sub={data.repo.hasReadme ? undefined : 'Critical gap'}
                  />
                  <StatBlock
                    label="License"
                    value={data.repo.license || '✗ None'}
                    sub={!data.repo.license ? 'Add one now' : undefined}
                  />
                </div>
              </div>

              {/* Score breakdown */}
              <div className="card p-5 animate-fadeUp">
                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Score Breakdown</h3>
                <div className="flex flex-col gap-3">
                  {breakdownMeta.map((b) => (
                    <BreakdownBar key={b.label} {...b} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Suggestions */}
          {activeTab === 'suggestions' && (
            <div className="animate-fadeUp">
              <p className="text-xs text-white/30 mb-4">
                {data.suggestions.filter((s) => s.type === 'critical').length} critical ·{' '}
                {data.suggestions.filter((s) => s.type === 'important').length} important ·{' '}
                {data.suggestions.filter((s) => s.type === 'tip').length} tips
              </p>
              <SuggestionList suggestions={data.suggestions} />
            </div>
          )}

          {/* Tab: Report Card */}
          {activeTab === 'report card' && (
            <div className="animate-fadeUp max-w-lg">
              <ReportCard data={data} type="repo" />
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!data && !loading && !error && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4 text-white/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
              <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
            </svg>
          </div>
          <p className="text-sm text-white/30">Enter a GitHub repo URL above to begin</p>
        </div>
      )}
    </div>
  );
}
