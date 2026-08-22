export function Donut({ slices, size = 148, center }) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1
  const r = 56
  const c = 2 * Math.PI * r
  let offset = 0
  return (
    <div className="donut-wrap">
      <svg width={size} height={size} viewBox="0 0 148 148">
        <circle cx="74" cy="74" r={r} fill="none" stroke="#e8eaee" strokeWidth="16" />
        {slices.map((sl) => {
          const len = (sl.value / total) * c
          const el = (
            <circle
              key={sl.label}
              cx="74"
              cy="74"
              r={r}
              fill="none"
              stroke={sl.color}
              strokeWidth="16"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform="rotate(-90 74 74)"
            />
          )
          offset += len
          return el
        })}
        {center && (
          <text x="74" y="70" textAnchor="middle" fontSize="11" fill="#8b919c">
            {center.top}
          </text>
        )}
        {center && (
          <text x="74" y="90" textAnchor="middle" fontSize="15" fontWeight="650" fill="#1c1d21">
            {center.bottom}
          </text>
        )}
      </svg>
      <div className="legend">
        {slices.map((s) => (
          <div key={s.label}>
            <i style={{ background: s.color }} />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export function MonthBars({ series }) {
  const max = Math.max(...series.map((s) => Math.max(s.in, s.out)), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140, padding: '8px 4px 0' }}>
      {series.map((s) => (
        <div key={s.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 110, width: '100%', justifyContent: 'center' }}>
            <div title={`Príjem ${s.in}`} style={{ width: 10, height: `${(s.in / max) * 100}%`, background: '#147a3d', borderRadius: 4 }} />
            <div title={`Výdavky ${s.out}`} style={{ width: 10, height: `${(s.out / max) * 100}%`, background: '#0b6ef6', borderRadius: 4 }} />
          </div>
          <div style={{ fontSize: 11, color: '#8b919c' }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}
