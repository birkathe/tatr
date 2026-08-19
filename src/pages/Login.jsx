import { useState } from 'react'
import Logo from '../components/Logo'
import AuthModal from '../components/AuthModal'
import { useBank } from '../store/BankContext'
import { AUTH, passwordMatches, pidMatches } from '../lib/auth'

export default function Login() {
  const { login } = useBank()
  const [pid, setPid] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState('form')

  function submit(e) {
    e.preventDefault()
    if (!pid.trim() || !password) {
      setError('Zadajte PID aj heslo.')
      return
    }
    if (!pidMatches(pid) || !passwordMatches(password)) {
      setError('Nesprávny PID alebo heslo.')
      return
    }
    setError('')
    setStep('auth')
  }

  return (
    <div className="login-page">
      <div className="demo-bar">
        <strong>DEMO</strong> — nie je to oficiálna služba Tatra banky. Údaje sú fiktívne a ostávajú vo vašom prehliadači.
      </div>
      <div className="login-top">
        <Logo light />
        <div className="meta">DIALOG *1100 · SK</div>
      </div>
      <div className="login-wrap">
        <div className="login-hero">
          <h1>Internet banking TB</h1>
          <p>
            Najoceňovanejší internet banking na Slovensku. Prehľad účtov, platby, karty, digitálne
            termínované vklady a Spending report TB — na jednom mieste.
          </p>
          <ul className="login-points">
            <li><i>✓</i> Prihlásenie PID-om a overenie Čítačkou TB</li>
            <li><i>✓</i> Okamžité platby 24/7</li>
            <li><i>✓</i> Digitálny termínovaný vklad online</li>
            <li><i>✓</i> História výdavkov a kategórie</li>
          </ul>
        </div>
        <form className="login-card" onSubmit={submit}>
          <h2>Prihlásenie</h2>
          <div className="sub">Zadajte PID pridelený bankou a svoje heslo.</div>
          <div className="field">
            <label htmlFor="pid">PID</label>
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
            <label htmlFor="heslo">Heslo</label>
            <div className="pass-wrap">
              <input
                id="heslo"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" className="pass-toggle" onClick={() => setShowPass((v) => !v)}>
                {showPass ? 'Skryť' : 'Zobraziť'}
              </button>
            </div>
          </div>
          {error && <div style={{ color: '#c0272d', fontSize: 13, marginBottom: 10 }}>{error}</div>}
          <div className="login-links">
            <span style={{ color: '#6d7178' }}>Zabudnuté heslo</span>
            <span style={{ color: '#6d7178' }}>Aktivácia služby</span>
          </div>
          <button className="btn btn-primary" type="submit">Prihlásiť sa</button>
          <div className="login-demo" style={{ marginTop: 16 }}>
            Demo prístup: PID <code>{AUTH.pid}</code> · heslo <code>{AUTH.password}</code>
            <br />
            Overenie Čítačkou: <code>{AUTH.readerCode}</code>
          </div>
        </form>
      </div>
      <div className="login-footer">© Tatra banka, a.s. — ukážková kópia pre vzdelávacie účely. Člen skupiny Raiffeisen Bank International.</div>
      {step === 'auth' && (
        <AuthModal
          title="Overenie prihlásenia"
          lead="Potvrďte prihlásenie v aplikácii Čítačka TB. Zadajte 6-miestny kód."
          onCancel={() => setStep('form')}
          onConfirm={login}
        />
      )}
    </div>
  )
}
