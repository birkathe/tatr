import { useState } from 'react'
import Logo from '../components/Logo'
import { useBank } from '../store/BankContext'
import { passwordMatches, pidMatches } from '../lib/auth'
import { LangSwitch, useI18n } from '../i18n/I18nContext'
import { useTheme } from '../theme/ThemeContext'
import { Icon } from '../components/Icons'

export default function Login() {
  const { login } = useBank()
  const { t } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const [pid, setPid] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!pid.trim() || !password) {
      setError(t('login.needBoth'))
      return
    }
    if (!pidMatches(pid) || !passwordMatches(password)) {
      setError(t('login.wrong'))
      return
    }
    login()
  }

  return (
    <div className="login-page">
      <div className="login-top">
        <Logo light />
        <div className="login-top-right">
          <button type="button" className="icon-btn" onClick={toggleTheme} title={t('settings.theme')}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
          </button>
          <LangSwitch light />
          <div className="meta">{t('dialog')}</div>
        </div>
      </div>
      <div className="login-wrap">
        <div className="login-hero">
          <h1>{t('ib')}</h1>
          <p>{t('login.hero')}</p>
          <ul className="login-points">
            <li><i>✓</i> {t('login.p1')}</li>
            <li><i>✓</i> {t('login.p2')}</li>
            <li><i>✓</i> {t('login.p3')}</li>
            <li><i>✓</i> {t('login.p4')}</li>
          </ul>
        </div>
        <form className="login-card" onSubmit={submit}>
          <h2>{t('login.title')}</h2>
          <div className="sub">{t('login.sub')}</div>
          <div className="field">
            <label htmlFor="pid">{t('login.pid')}</label>
            <input
              id="pid"
              value={pid}
              onChange={(e) => setPid(e.target.value.replace(/\D/g, '').slice(0, 10))}
              autoComplete="username"
              inputMode="numeric"
              maxLength={10}
            />
          </div>
          <div className="field">
            <label htmlFor="heslo">{t('login.password')}</label>
            <div className="pass-wrap">
              <input
                id="heslo"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" className="pass-toggle" onClick={() => setShowPass((v) => !v)}>
                {showPass ? t('login.hide') : t('login.show')}
              </button>
            </div>
          </div>
          {error && <div style={{ color: '#c0272d', fontSize: 13, marginBottom: 10 }}>{error}</div>}
          <div className="login-links">
            <span style={{ color: '#6d7178' }}>{t('login.forgot')}</span>
            <span style={{ color: '#6d7178' }}>{t('login.activate')}</span>
          </div>
          <button className="btn btn-primary" type="submit">{t('login.submit')}</button>
        </form>
      </div>
    </div>
  )
}
