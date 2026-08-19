import { useMemo, useState } from 'react'

export default function AuthModal({ title, lead, amountLabel, onCancel, onConfirm }) {
  const [code, setCode] = useState('')
  const challenge = useMemo(() => String(Math.floor(100000 + Math.random() * 899999)), [])

  function submit(e) {
    e.preventDefault()
    if (code.replace(/\s/g, '').length < 6) return
    onConfirm()
  }

  return (
    <div className="overlay" onClick={onCancel}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>{title || 'Overenie Čítačkou TB'}</h2>
        <p className="lead">
          {lead || 'Otvorte aplikáciu Čítačka TB a zadajte overovací kód. V tomto demo móde stačí ľubovoľných 6 číslic.'}
        </p>
        <div className="challenge">
          <div>
            <div style={{ fontSize: 11, opacity: 0.65, letterSpacing: '.08em' }}>VÝZVA</div>
            <b>{challenge}</b>
          </div>
          {amountLabel && <div style={{ textAlign: 'right', fontSize: 13 }}>{amountLabel}</div>}
        </div>
        <div className="field">
          <label>Overovací kód z Čítačky TB</label>
          <input
            autoFocus
            inputMode="numeric"
            maxLength={8}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, ''))}
            placeholder="••••••"
          />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="button" className="btn btn-ghost" onClick={onCancel} style={{ flex: 1 }}>
            Zrušiť
          </button>
          <button type="submit" className="btn btn-primary" disabled={code.length < 6} style={{ flex: 1 }}>
            Potvrdiť
          </button>
        </div>
      </form>
    </div>
  )
}
