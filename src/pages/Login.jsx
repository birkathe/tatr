import { useState } from 'react'
import Logo from '../components/Logo'
import AuthModal from '../components/AuthModal'
import { useBank } from '../store/BankContext'

export default function Login() {
  const { login } = useBank()
  const [pid, setPid] = useState('1234567890')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState('')
  const [step, setStep] = useState('form')

  function submit(e) {
    e.preventDefault()
    if (!pid.trim() || !password.trim()) {
      setError('Zadajte PID aj heslo.')
      return
    }
    if (pid.replace(/\s/g, '') !== '1234567890' || password !== 'demo123') {
      setError('Nesprávny PID alebo heslo. Pre demo použite 1234567890 / demo123.')
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
            <label>PID</label>
            <input value={pid} onChange={(e) => setPid(e.target.value)} autoComplete="username" />
          </div>
          <div className="field">
            <label>Heslo</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          {error && <div style={{ color: '#c0272d', fontSize: 13, marginBottom: 10 }}>{error}</div>}
          <div className="login-links">
            <span style={{ color: '#6d7178' }}>Zabudnuté heslo</span>
            <span style={{ color: '#6d7178' }}>Aktivácia služby</span>
          </div>
          <button className="btn btn-primary" type="submit">Prihlásiť sa</button>
          <div className="login-demo" style={{ marginTop: 16 }}>
            Demo prístup: PID <code>1234567890</code> · heslo <code>demo123</code>
            <br />
            Overenie Čítačkou: ľubovoľných 6 číslic.
          </div>
        </form>
      </div>
      <div className="login-footer">© Tatra banka, a.s. — ukážková kópia pre vzdelávacie účely. Člen skupiny Raiffeisen Bank International.</div>
      {step === 'auth' && (
        <AuthModal
          title="Overenie prihlásenia"
          lead="Potvrďte prihlásenie v aplikácii Čítačka TB. V demo móde zadajte ľubovoľných 6 číslic."
          onCancel={() => setStep('form')}
          onConfirm={login}
        />
      )}
    </div>
  )
}
