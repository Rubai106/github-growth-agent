const typeConfig = {
  critical: {
    label: 'Critical',
    class: 'suggestion-critical',
    dot: 'bg-red-500',
    badge: 'badge-red',
  },
  important: {
    label: 'Important',
    class: 'suggestion-important',
    dot: 'bg-amber-500',
    badge: 'badge-yellow',
  },
  tip: {
    label: 'Tip',
    class: 'suggestion-tip',
    dot: 'bg-brand-500',
    badge: 'badge-blue',
  },
};

export default function SuggestionList({ suggestions = [] }) {
  if (!suggestions.length) {
    return (
      <p className="text-sm text-white/40 italic">No suggestions — great job!</p>
    );
  }

  const ordered = [
    ...suggestions.filter((s) => s.type === 'critical'),
    ...suggestions.filter((s) => s.type === 'important'),
    ...suggestions.filter((s) => s.type === 'tip'),
  ];

  return (
    <div className="flex flex-col gap-3">
      {ordered.map((s, i) => {
        const cfg = typeConfig[s.type] || typeConfig.tip;
        return (
          <div key={i} className={`rounded-xl py-3 pr-4 ${cfg.class} animate-fadeUp`} style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start gap-3">
              <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`badge ${cfg.badge} text-[10px]`}>{cfg.label}</span>
                  <span className="text-[10px] text-white/30 font-mono uppercase tracking-wider">{s.category}</span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">{s.text}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
