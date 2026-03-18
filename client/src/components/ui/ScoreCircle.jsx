export default function ScoreCircle({ score = 0, grade = 'F', size = 140 }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (score / 100) * circumference;
  const gap = circumference - strokeDash;

  const gradeColor =
    grade === 'A' ? '#10b981'   // emerald
    : grade === 'B' ? '#3b82f6' // blue
    : grade === 'C' ? '#f59e0b' // amber
    : grade === 'D' ? '#f97316' // orange
    : '#ef4444';                // red

  const gradientId = `score-gradient-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      style={{ transform: 'rotate(-90deg)' }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={gradeColor} stopOpacity="0.7" />
          <stop offset="100%" stopColor={gradeColor} />
        </linearGradient>
      </defs>

      {/* Background track */}
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="10"
      />

      {/* Score arc */}
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${strokeDash} ${gap}`}
        style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />

      {/* Score text — counter-rotate so it reads upright */}
      <g style={{ transform: 'rotate(90deg)', transformOrigin: '60px 60px' }}>
        <text
          x="60"
          y="56"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="22"
          fontWeight="700"
          fontFamily="Syne, sans-serif"
        >
          {score}
        </text>
        <text
          x="60"
          y="74"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={gradeColor}
          fontSize="11"
          fontWeight="600"
          fontFamily="Syne, sans-serif"
        >
          Grade {grade}
        </text>
      </g>
    </svg>
  );
}
