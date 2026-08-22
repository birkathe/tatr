import { useEffect, useRef, useState } from 'react'

export default function Select({ value, onChange, options = [], placeholder = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = options.find((o) => o.value === value)

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div className={`c-select ${open ? 'open' : ''}`} ref={ref}>
      <button type="button" className="c-select-btn" onClick={() => setOpen((v) => !v)}>
        <span>{current?.label || placeholder}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="c-select-menu">
          {options.map((o) => (
            <button
              type="button"
              key={o.value}
              className={o.value === value ? 'on' : ''}
              onClick={() => {
                onChange(o.value)
                setOpen(false)
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
