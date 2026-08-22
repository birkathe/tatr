function Mark({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="542 543 1168 926"
      aria-hidden
      fill="currentColor"
      style={{ flexShrink: 0, overflow: 'visible' }}
    >
      <path d="M542.9,1468.9h1167v-925h-191v19h172v887H562.9l-1-887h630v-19h-649v925Z" />
      <polygon points="958.15 799.9 668.9 1343.9 813.9 1343.9 1103.15 799.9 958.15 799.9" />
      <polygon points="1299.27 543.9 873.9 1343.9 1018.9 1343.9 1444.27 543.9 1299.27 543.9" />
      <polygon points="1435.15 673.9 1078.9 1343.9 1223.9 1343.9 1580.15 673.9 1435.15 673.9" />
    </svg>
  )
}

export default function Logo({ light = false, compact = false }) {
  const color = light ? '#fff' : '#0b0b10'
  return (
    <div className="tb-logo" style={{ color }} aria-label="Tatra banka">
      <Mark size={compact ? 30 : 36} />
      {!compact && (
        <div className="tb-logo-text">
          <div className="tb-wordmark">Tatra banka</div>
          <div className="tb-logo-sub">Internet banking TB</div>
        </div>
      )}
    </div>
  )
}
