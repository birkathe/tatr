export default function Logo({ light = false, compact = false }) {
  const fill = light ? '#fff' : '#0b0b10'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: fill }}>
      <svg width="34" height="34" viewBox="0 0 48 48" aria-hidden>
        <rect x="1" y="1" width="46" height="46" rx="4" fill="none" stroke={fill} strokeWidth="2" />
        <path d="M10 12h28v6.6H29.2V36h-10.4V18.6H10z" fill={fill} />
      </svg>
      {!compact && (
        <div style={{ lineHeight: 1.05 }}>
          <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.03em' }}>Tatra banka</div>
          <div style={{ fontSize: 10, letterSpacing: '0.08em', opacity: 0.7, textTransform: 'uppercase' }}>
            Internet banking TB
          </div>
        </div>
      )}
    </div>
  )
}
