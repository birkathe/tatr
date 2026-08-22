import { useMemo, useState } from 'react'
import { useBank } from '../store/BankContext'
import { DEPOSIT_OFFERS } from '../data/seed'
import AuthModal from '../components/AuthModal'
import { formatDate, formatMoney } from '../lib/format'
import { useI18n } from '../i18n/I18nContext'
import Select from '../components/Select'

export default function Deposits() {
  const bank = useBank()
  const { t } = useI18n()
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ fromId: 'acc_personal', amount: '1000', months: 12, autoRenew: false })
  const [auth, setAuth] = useState(false)
  const [error, setError] = useState('')

  const offer = DEPOSIT_OFFERS.find((o) => o.months === Number(form.months))
  const interest = useMemo(() => {
    const amt = Number(form.amount) || 0
    if (!offer) return 0
    return Math.round(amt * (offer.rate / 100) * (offer.months / 12) * 100) / 100
  }, [form.amount, offer])

  const from = bank.accounts.find((a) => a.id === form.fromId)
  const active = bank.deposits.filter((d) => d.status === 'aktívny')
  const history = bank.deposits.filter((d) => d.status !== 'aktívny')
  const total = active.reduce((s, d) => s + d.amount, 0)
  const bestRate = Math.max(0, ...active.map((d) => d.rate), ...DEPOSIT_OFFERS.map((o) => o.rate))

  function start(e) {
    e.preventDefault()
    setError('')
    if (!from || Number(form.amount) < 100) {
      setError('Minimálna suma vkladu je 100 €.')
      return
    }
    if (from.available < Number(form.amount)) {
      setError('Nedostatok prostriedkov na vybranom účte.')
      return
    }
    setAuth(true)
  }

  function confirm() {
    const res = bank.createDeposit({ ...form, amount: Number(form.amount), months: Number(form.months) })
    setAuth(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setCreating(false)
    setForm({ fromId: 'acc_personal', amount: '1000', months: 12, autoRenew: false })
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{t('deposits.title')}</h1>
          <p>{t('deposits.sub')}</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setCreating(true)}>
            + Nový vklad
          </button>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <div className="card kpi">
          <div className="l">Aktívne vklady</div>
          <div className="v">{formatMoney(total)}</div>
          <div className="s">{active.length} produktov</div>
        </div>
        <div className="card kpi">
          <div className="l">Očakávaný úrok</div>
          <div className="v" style={{ color: 'var(--green)' }}>
            {formatMoney(active.reduce((s, d) => s + d.interestExpected, 0))}
          </div>
          <div className="s">pri splatnosti</div>
        </div>
        <div className="card kpi">
          <div className="l">Najlepšia sadzba</div>
          <div className="v">{bestRate.toFixed(2).replace('.', ',')} % p.a.</div>
          <div className="s">aktuálny vklad</div>
        </div>
      </div>

      {creating && (
        <div className="card card-pad" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Zriadiť Digitálny termínovaný vklad</h3>
            <button className="btn btn-sm btn-ghost" onClick={() => setCreating(false)}>Zavrieť</button>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 0 }}>
            Peniaze sa automaticky prevedú z vybraného účtu. Úroková sadzba je garantovaná po celú dobu viazanosti.
          </p>
          <form onSubmit={start}>
            <div className="field">
              <label>{t('deposits.from')}</label>
              <Select
                value={form.fromId}
                onChange={(v) => setForm({ ...form, fromId: v })}
                options={bank.accounts.map((a) => ({ value: a.id, label: `${a.name} · ${formatMoney(a.available)}` }))}
              />
            </div>
            <div className="field">
              <label>Suma vkladu</label>
              <input type="number" min="100" step="10" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              <div className="hint">Minimum 100 €</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, margin: '8px 0 16px' }}>
              {DEPOSIT_OFFERS.map((o) => (
                <button
                  type="button"
                  key={o.months}
                  className={`offer ${Number(form.months) === o.months ? 'on' : ''}`}
                  onClick={() => setForm({ ...form, months: o.months })}
                >
                  <div className="rate">{o.rate.toFixed(2).replace('.', ',')} %</div>
                  <div className="term">{o.label} · p.a.</div>
                </button>
              ))}
            </div>
            <label className="switch">
              <div>
                <div className="t">Automatická obnova</div>
                <div className="d">Po splatnosti sa vklad obnoví na rovnakú dobu</div>
              </div>
              <input type="checkbox" checked={form.autoRenew} onChange={(e) => setForm({ ...form, autoRenew: e.target.checked })} />
            </label>
            <div className="deposit-summary">
              <div className="detail-grid">
                <div><div className="k">Úroková sadzba</div><div className="v">{offer?.rate.toFixed(2).replace('.', ',')} % p.a.</div></div>
                <div><div className="k">Očakávaný úrok</div><div className="v">{formatMoney(interest)}</div></div>
                <div><div className="k">Splatnosť</div><div className="v">{offer?.label}</div></div>
                <div><div className="k">Vyplatí sa</div><div className="v">{formatMoney((Number(form.amount) || 0) + interest)}</div></div>
              </div>
            </div>
            {error && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 10 }}>{error}</div>}
            <button className="btn btn-primary" type="submit">Zriadiť vklad</button>
          </form>
        </div>
      )}

      <h3 style={{ fontSize: 16, margin: '8px 0 12px' }}>Moje vklady</h3>
      <div className="grid grid-eq" style={{ marginBottom: 20 }}>
        {active.map((d) => {
          const start = new Date(d.start)
          const end = new Date(d.end)
          const now = new Date()
          const pct = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100))
          return (
            <div key={d.id} className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{d.months} mes. · {d.rate.toFixed(2).replace('.', ',')} % p.a.</div>
                </div>
                <span className="pill ok">{d.status}</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 650, letterSpacing: '-0.03em', margin: '12px 0 4px' }}>{formatMoney(d.amount)}</div>
              <div style={{ fontSize: 13, color: 'var(--green)' }}>+ {formatMoney(d.interestExpected)} úrok pri splatnosti</div>
              <div className="bar-track" style={{ margin: '14px 0 8px' }}>
                <div className="bar-fill" style={{ width: `${pct}%`, background: 'var(--blue)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)' }}>
                <span>Od {formatDate(d.start)}</span>
                <span>Do {formatDate(d.end)}</span>
              </div>
              <button
                className="btn btn-sm btn-danger"
                style={{ marginTop: 14 }}
                onClick={() => {
                  if (window.confirm('Predčasné ukončenie zníži vyplatený úrok. Pokračovať?')) bank.closeDeposit(d.id, true)
                }}
              >
                Predčasne ukončiť
              </button>
            </div>
          )
        })}
        {active.length === 0 && !creating && (
          <div className="card empty">Zatiaľ nemáte aktívny termínovaný vklad.</div>
        )}
      </div>

      {history.length > 0 && (
        <>
          <h3 style={{ fontSize: 16, margin: '8px 0 12px' }}>História vkladov</h3>
          <div className="card">
            <table className="data">
              <thead>
                <tr><th>Produkt</th><th className="right">Istina</th><th>Sadzba</th><th>Stav</th><th>Úrok</th></tr>
              </thead>
              <tbody>
                {history.map((d) => (
                  <tr key={d.id}>
                    <td>{d.name} · {d.months} mes.</td>
                    <td className="right mono">{formatMoney(d.amount)}</td>
                    <td>{d.rate} %</td>
                    <td><span className="pill">{d.status}</span></td>
                    <td>{formatMoney(d.paidInterest || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {auth && (
        <AuthModal
          title="Potvrdenie zriadenia vkladu"
          amountLabel={formatMoney(Number(form.amount))}
          lead={`Potvrďte Digitálny termínovaný vklad na ${offer?.label} so sadzbou ${offer?.rate} % p.a.`}
          onCancel={() => setAuth(false)}
          onConfirm={confirm}
        />
      )}
    </div>
  )
}
