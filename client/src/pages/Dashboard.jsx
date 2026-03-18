import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';

const features = [
  {
    to: '/repo',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
        <path d="M13 13l6 6" />
      </svg>
    ),
    title: 'Repo Analyzer',
    desc: 'Score any public GitHub repo across 4 quality dimensions with actionable suggestions.',
    badge: 'Rule-based scoring',
    color: 'from-brand-600/20 to-brand-800/5 border-brand-500/20 hover:border-brand-500/40',
    iconColor: 'text-brand-400',
  },
  {
    to: '/readme',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: 'README Generator',
    desc: 'Fill in a form, get a professional README.md with badges, sections, and contribution guides.',
    badge: 'Template-based',
    color: 'from-emerald-600/20 to-emerald-900/5 border-emerald-500/20 hover:border-emerald-500/40',
    iconColor: 'text-emerald-400',
  },
  {
    to: '/profile',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: 'Profile Analyzer',
    desc: 'Analyze any GitHub profile, score it across 4 dimensions, and get a shareable report card.',
    badge: 'Public API',
    color: 'from-purple-600/20 to-purple-900/5 border-purple-500/20 hover:border-purple-500/40',
    iconColor: 'text-purple-400',
  },
];

const quickRepos = [
  'https://github.com/facebook/react',
  'https://github.com/vuejs/vue',
  'https://github.com/expressjs/express',
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    checkHealth()
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10 animate-fadeUp">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1 ${
              apiStatus === 'online'
                ? 'bg-emerald-500/15 text-emerald-400'
                : apiStatus === 'offline'
                ? 'bg-red-500/15 text-red-400'
                : 'bg-white/5 text-white/30'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                apiStatus === 'online'
                  ? 'bg-emerald-400'
                  : apiStatus === 'offline'
                  ? 'bg-red-400'
                  : 'bg-white/30'
              }`}
            />
            {apiStatus === 'online' ? 'API online' : apiStatus === 'offline' ? 'API offline — start the backend' : 'Connecting…'}
          </span>
        </div>

        <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
          GitHub Growth Agent
        </h1>
        <p className="text-base text-white/50 max-w-xl leading-relaxed">
          Analyze repos, generate READMEs, and get actionable growth insights — all using the free GitHub API.
          No paid services, no API keys required.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 stagger">
        {features.map((f) => (
          <button
            key={f.to}
            onClick={() => navigate(f.to)}
            className={`card text-left p-5 bg-gradient-to-br border transition-all duration-200 hover:scale-[1.02] active:scale-[0.99] ${f.color}`}
          >
            <div className={`mb-3 ${f.iconColor}`}>{f.icon}</div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-base font-bold text-white">{f.title}</h3>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-3">{f.desc}</p>
            <span className="badge-gray text-[11px]">{f.badge}</span>
          </button>
        ))}
      </div>

      {/* Quick analyze section */}
      <div className="card p-6 mb-6">
        <h2 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">Quick Analyze</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickRepos.map((url) => {
            const name = url.replace('https://github.com/', '');
            return (
              <button
                key={url}
                onClick={() => navigate(`/repo?url=${encodeURIComponent(url)}`)}
                className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] hover:border-white/10 transition-all duration-150"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0 text-white/20">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="font-mono text-xs truncate">{name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* How it works */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-white/50">
          {[
            { step: '01', text: 'Enter a GitHub repo URL or username — no login needed for public repos.' },
            { step: '02', text: 'The app fetches data from the GitHub public API and runs a rule-based scoring algorithm.' },
            { step: '03', text: 'You get a score, breakdown, improvement suggestions, and a downloadable report card.' },
          ].map(({ step, text }) => (
            <div key={step} className="flex gap-3">
              <span className="font-mono text-xs text-brand-500/60 shrink-0 mt-0.5">{step}</span>
              <p className="leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
