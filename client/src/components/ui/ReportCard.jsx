import { useRef } from 'react';

function ScoreBar({ label, value, max, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-white/50 w-28 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs font-mono text-white/60 w-8 text-right">{value}</span>
    </div>
  );
}

export default function ReportCard({ data, type = 'repo' }) {
  const cardRef = useRef(null);

  const isRepo = type === 'repo';
  const score = data.score;
  const name = isRepo ? data.repo?.fullName : data.profile?.login;
  const description = isRepo ? data.repo?.description : data.profile?.bio;
  const language = isRepo ? data.repo?.language : null;
  const topics = isRepo ? data.repo?.topics?.slice(0, 4) : data.profile?.company ? [data.profile.company] : [];
  const statsLine = isRepo
    ? `⭐ ${data.repo.stars} stars · 🍴 ${data.repo.forks} forks · 🐛 ${data.repo.openIssues} issues`
    : `📦 ${data.profile.publicRepos} repos · 👥 ${data.profile.followers} followers · ⭐ ${data.stats?.totalStars ?? 0} total stars`;

  const gradeColor =
    score.grade === 'A' ? '#10b981'
    : score.grade === 'B' ? '#3b82f6'
    : score.grade === 'C' ? '#f59e0b'
    : score.grade === 'D' ? '#f97316'
    : '#ef4444';

  const breakdown = score.breakdown;
  const breakdownItems = isRepo
    ? [
        { label: 'Documentation', value: breakdown.documentation, max: 30, color: '#4d6fff' },
        { label: 'Community',     value: breakdown.community,     max: 25, color: '#10b981' },
        { label: 'Activity',      value: breakdown.activity,      max: 25, color: '#f59e0b' },
        { label: 'Popularity',    value: breakdown.popularity,    max: 20, color: '#a855f7' },
      ]
    : [
        { label: 'Completeness',  value: breakdown.completeness,  max: 25, color: '#4d6fff' },
        { label: 'Repositories',  value: breakdown.repositories,  max: 25, color: '#10b981' },
        { label: 'Community',     value: breakdown.community,     max: 25, color: '#f59e0b' },
        { label: 'Longevity',     value: breakdown.longevity,     max: 25, color: '#a855f7' },
      ];

  // ── Download as PNG using html-to-image via canvas ──
  const handleDownload = async () => {
    const el = cardRef.current;
    if (!el) return;

    try {
      // Inline styles needed because download strips external CSS
      const { toPng } = await import('https://esm.run/html-to-image@1.11.11').catch(() => null);
      if (!toPng) {
        alert('Download requires an internet connection to load the image library. Try again when online.');
        return;
      }
      const dataUrl = await toPng(el, { pixelRatio: 2, backgroundColor: '#0f1117' });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${name?.replace('/', '-') ?? 'report'}-report-card.png`;
      a.click();
    } catch (e) {
      console.error('Download failed:', e);
      alert('Could not generate image. Try copying a screenshot manually.');
    }
  };

  const handleCopyLink = () => {
    const url = isRepo
      ? `https://github.com/${data.repo.fullName}`
      : `https://github.com/${data.profile.login}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('GitHub URL copied to clipboard!');
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* The visual card */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-surface-800 via-surface-900 to-surface-950 p-6"
        style={{ fontFamily: 'Syne, sans-serif' }}
      >
        {/* Background decoration */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at top right, ${gradeColor}40, transparent 60%)`,
          }}
        />

        {/* Header */}
        <div className="relative flex items-start justify-between gap-4 mb-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white/40 shrink-0">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="text-xs text-white/40 font-mono uppercase tracking-widest">
                {isRepo ? 'Repository Report' : 'Profile Report'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white truncate">{name}</h3>
            {description && (
              <p className="text-sm text-white/50 mt-1 line-clamp-2 leading-relaxed">{description}</p>
            )}
          </div>

          {/* Grade badge */}
          <div
            className="shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl border text-2xl font-black"
            style={{
              borderColor: `${gradeColor}40`,
              background: `${gradeColor}15`,
              color: gradeColor,
            }}
          >
            {score.grade}
            <span className="text-[10px] font-medium text-white/40 -mt-1">{score.total}/100</span>
          </div>
        </div>

        {/* Stats line */}
        <p className="text-xs font-mono text-white/40 mb-4">{statsLine}</p>

        {/* Score breakdown bars */}
        <div className="flex flex-col gap-2.5 mb-4">
          {breakdownItems.map((item) => (
            <ScoreBar key={item.label} {...item} />
          ))}
        </div>

        {/* Topics / language tags */}
        {(topics.length > 0 || language) && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {language && (
              <span className="badge-gray text-[11px] px-2.5 py-0.5 rounded-full">
                {language}
              </span>
            )}
            {topics.map((t) => (
              <span key={t} className="badge-blue text-[11px] px-2.5 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Footer watermark */}
        <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
          <span className="text-[10px] text-white/20 font-mono">GitHub Growth Agent</span>
          <span className="text-[10px] text-white/20 font-mono">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button onClick={handleDownload} className="btn-primary flex-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Card
        </button>
        <button onClick={handleCopyLink} className="btn-ghost flex-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
          Copy GitHub URL
        </button>
      </div>
    </div>
  );
}
