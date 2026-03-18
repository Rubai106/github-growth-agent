import { useState, useCallback } from 'react';
import { generateReadme } from '../services/api';

const LICENSES = ['MIT', 'Apache 2.0', 'GPL v3', 'BSD 2-Clause', 'BSD 3-Clause', 'ISC', 'MPL 2.0', 'Unlicense'];
const TECH_SUGGESTIONS = [
  'React', 'Vue', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte',
  'Node.js', 'Express', 'Fastify', 'NestJS',
  'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis',
  'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust',
  'Docker', 'Kubernetes', 'AWS', 'Vercel', 'Tailwind CSS', 'Prisma',
];

const defaultForm = {
  projectName: '',
  tagline: '',
  description: '',
  featuresRaw: '',
  techStackRaw: '',
  installation: '',
  usage: '',
  author: '',
  githubUsername: '',
  twitterUsername: '',
  portfolio: '',
  license: 'MIT',
  demo: '',
  screenshots: false,
};

export default function ReadmeGenerator() {
  const [form, setForm] = useState(defaultForm);
  const [techInput, setTechInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [activeView, setActiveView] = useState('form'); // form | preview
  const [copied, setCopied] = useState(false);

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
  };

  const addTech = (tech) => {
    const current = form.techStackRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (!current.includes(tech)) {
      const next = [...current, tech].join(', ');
      setForm((f) => ({ ...f, techStackRaw: next }));
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!form.projectName.trim()) return;
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        const payload = {
          ...form,
          features: form.featuresRaw
            .split('\n')
            .map((f) => f.trim())
            .filter(Boolean),
          techStack: form.techStackRaw
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        };
        const res = await generateReadme(payload);
        setResult(res.data);
        setActiveView('preview');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [form]
  );

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename || 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fadeUp">
        <h1 className="section-title mb-1">README Generator</h1>
        <p className="section-sub">Fill in the form to generate a professional README.md with badges, sections, and more.</p>
      </div>

      {/* View toggle when result exists */}
      {result && (
        <div className="flex gap-1 mb-6 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06] w-fit">
          {['form', 'preview'].map((v) => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all duration-150 ${
                activeView === v ? 'bg-brand-600 text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              {v === 'preview' ? '👁️ Preview' : '✏️ Edit Form'}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Form */}
      {activeView === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fadeUp">
          {/* Required info */}
          <div className="card p-6">
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-5">
              Project Info <span className="text-red-400">*</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs text-white/50 mb-1.5">Project Name *</label>
                <input className="input" placeholder="GitHub Growth Agent" value={form.projectName} onChange={set('projectName')} required />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Tagline</label>
                <input className="input" placeholder="Analyze, grow, and supercharge your GitHub presence" value={form.tagline} onChange={set('tagline')} />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Live Demo URL</label>
                <input className="input" placeholder="https://your-demo.vercel.app" value={form.demo} onChange={set('demo')} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-white/50 mb-1.5">Description</label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  placeholder="A brief description of what your project does and why it exists..."
                  value={form.description}
                  onChange={set('description')}
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="card p-6">
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-5">Features</h2>
            <label className="block text-xs text-white/50 mb-1.5">One feature per line</label>
            <textarea
              className="input resize-none font-mono text-xs"
              rows={5}
              placeholder={"GitHub repo scoring with 4 quality dimensions\nAI-powered README generation\nProfile analyzer with shareable report cards\nFully free — no paid API keys needed"}
              value={form.featuresRaw}
              onChange={set('featuresRaw')}
            />
          </div>

          {/* Tech stack */}
          <div className="card p-6">
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-5">Tech Stack</h2>
            <input
              className="input mb-3"
              placeholder="React, Node.js, MongoDB, Tailwind CSS"
              value={form.techStackRaw}
              onChange={set('techStackRaw')}
            />
            <p className="text-xs text-white/30 mb-2">Quick add:</p>
            <div className="flex flex-wrap gap-2">
              {TECH_SUGGESTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => addTech(t)}
                  className="badge-gray hover:badge-blue text-[11px] cursor-pointer transition-colors"
                >
                  + {t}
                </button>
              ))}
            </div>
          </div>

          {/* Setup */}
          <div className="card p-6">
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-5">Setup & Usage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Additional Installation Steps</label>
                <textarea
                  className="input resize-none font-mono text-xs"
                  rows={4}
                  placeholder={"cp .env.example .env\n# Edit .env with your values\nnpm run setup"}
                  value={form.installation}
                  onChange={set('installation')}
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Usage / Run Commands</label>
                <textarea
                  className="input resize-none font-mono text-xs"
                  rows={4}
                  placeholder={"# Start development\nnpm run dev\n\n# Build\nnpm run build"}
                  value={form.usage}
                  onChange={set('usage')}
                />
              </div>
            </div>
          </div>

          {/* Author */}
          <div className="card p-6">
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-5">Author & License</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Full Name</label>
                <input className="input" placeholder="Jane Doe" value={form.author} onChange={set('author')} />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">GitHub Username</label>
                <input className="input" placeholder="janedoe" value={form.githubUsername} onChange={set('githubUsername')} />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Twitter/X Username</label>
                <input className="input" placeholder="janedoe" value={form.twitterUsername} onChange={set('twitterUsername')} />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Portfolio URL</label>
                <input className="input" placeholder="https://janedoe.dev" value={form.portfolio} onChange={set('portfolio')} />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">License</label>
                <select className="input" value={form.license} onChange={set('license')}>
                  {LICENSES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3 pt-5">
                <input
                  type="checkbox"
                  id="screenshots"
                  checked={form.screenshots}
                  onChange={set('screenshots')}
                  className="w-4 h-4 rounded accent-brand-500"
                />
                <label htmlFor="screenshots" className="text-sm text-white/60 cursor-pointer">
                  Include screenshots section
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-4 text-base" disabled={loading || !form.projectName.trim()}>
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Generating…
              </>
            ) : (
              '✨ Generate README'
            )}
          </button>
        </form>
      )}

      {/* Preview */}
      {activeView === 'preview' && result && (
        <div className="animate-fadeUp">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-white/40">
              <span className="font-mono text-white/60">{result.filename}</span>
              {' — '}{result.content.split('\n').length} lines
            </p>
            <div className="flex gap-3">
              <button onClick={handleCopy} className="btn-ghost text-xs">
                {copied ? '✓ Copied!' : '📋 Copy Markdown'}
              </button>
              <button onClick={handleDownload} className="btn-primary text-xs px-4 py-2.5">
                ⬇ Download .md
              </button>
            </div>
          </div>
          <pre className="card p-6 text-xs font-mono text-white/70 leading-relaxed whitespace-pre-wrap overflow-auto max-h-[70vh]">
            {result.content}
          </pre>
        </div>
      )}
    </div>
  );
}
