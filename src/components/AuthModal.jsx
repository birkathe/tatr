import { useMemo, useState } from 'react'
import { readerMatches } from '../lib/auth'
import { useI18n } from '../i18n/I18nContext'

export default function AuthModal({ title, lead, amountLabel, onCancel, onConfirm }) {
  const { t } = useI18n()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const challenge = useMemo(() => String(Math.floor(100000 + Math.random() * 899999)), [])

  function submit(e) {
    e.preventDefault()
    if (!readerMatches(code)) {
      setError(t('auth.wrong'))
      return
    }
    onConfirm()
  }

  return (
    <div className="overlay" onClick={onCancel}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>{title || t('auth.title')}</h2>
        <p className="lead">{lead || t('auth.lead')}</p>
        <div className="challenge">
          <div>
            <div style={{ fontSize: 11, opacity: 0.65, letterSpacing: '.08em' }}>{t('auth.challenge')}</div>
            <b>{challenge}</b>
          </div>
          {amountLabel && <div style={{ textAlign: 'right', fontSize: 13 }}>{amountLabel}</div>}
        </div>
        <div className="field">
          <label>{t('auth.code')}</label>
          <input
            autoFocus
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/[^\d]/g, '').slice(0, 6))
              setError('')
            }}
            placeholder="••••••"
          />
        </div>
        {error && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 10 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="button" className="btn btn-ghost" onClick={onCancel} style={{ flex: 1 }}>
            {t('auth.cancel')}
          </button>
          <button type="submit" className="btn btn-primary" disabled={code.length < 6} style={{ flex: 1 }}>
            {t('auth.confirm')}
          </button>
        </div>
      </form>
    </div>
  )
}
