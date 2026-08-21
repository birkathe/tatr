import { useMemo, useState } from 'react'
import { useBank } from '../store/BankContext'
import AuthModal from '../components/AuthModal'
import { formatIban, formatMoney } from '../lib/format'
import { useI18n } from '../i18n/I18nContext'

const empty = { fromId: 'acc_personal', toName: '', toIban: '', amount: '', vs: '', ks: '0308', ss: '', note: '', instant: true }

export default function Payments() {
  const bank = useBank()
  const { t } = useI18n()
  const [tab, setTab] = useState('nova')
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [auth, setAuth] = useState(false)
  const [own, setOwn] = useState({ fromId: 'acc_personal', toId: 'acc_personal', amount: '', note: '' })

  const from = bank.accounts.find((a) => a.id === form.fromId)
  const pending = useMemo(() => {
    const amt = Number(form.amount)
    if (!from || !amt) return null
    return { ...form, amount: amt }
  }, [form, from])

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function fillRecipient(r) {
    setForm((f) => ({ ...f, toName: r.name, toIban: r.iban.replace(/\s/g, ''), vs: r.vs || f.vs }))
    setTab('nova')
  }

  function fillTemplate(t) {
    const r = bank.recipients.find((x) => x.id === t.recipientId)
    if (!r) return
    setForm((f) => ({ ...f, toName: r.name, toIban: r.iban.replace(/\s/g, ''), amount: String(t.amount), vs: t.vs, note: t.note }))
    setTab('nova')
  }

  function startPay(e) {
    e.preventDefault()
    setError('')
    const amt = Number(form.amount)
    const iban = form.toIban.replace(/\s/g, '')
    if (!form.toName || iban.length < 15 || !/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban)) {
      setError('Vyplňte meno príjemcu a platný IBAN.')
      return
    }
    if (!(amt > 0)) {
      setError('Zadajte sumu platby.')
      return
    }
    if (from.available < amt) {
      setError('Nedostatok prostriedkov na vybranom účte.')
      return
    }
    setAuth(true)
  }

  function confirm() {
    const res = bank.sendPayment({
      ...form,
      toIban: form.toIban.replace(/\s/g, ''),
      amount: Number(form.amount),
      instant: form.instant && bank.settings.instantPayments,
    })
    setAuth(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setForm({ ...empty, fromId: form.fromId })
  }

  function ownPay(e) {
    e.preventDefault()
    const res = bank.transferBetween({ ...own, amount: Number(own.amount) })
    if (!res.ok) setError(res.error)
    else {
      setOwn((o) => ({ ...o, amount: '', note: '' }))
      setError('')
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{t('payments.title')}</h1>
          <p>{t('payments.sub')}</p>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'nova' ? 'on' : ''}`} onClick={() => setTab('nova')}>{t('payments.new')}</button>
        {bank.accounts.length > 1 && (
        <button className={`tab ${tab === 'own' ? 'on' : ''}`} onClick={() => setTab('own')}>{t('payments.own')}</button>
        )}
        <button className={`tab ${tab === 'tpl' ? 'on' : ''}`} onClick={() => setTab('tpl')}>{t('payments.tpl')}</button>
        <button className={`tab ${tab === 'so' ? 'on' : ''}`} onClick={() => setTab('so')}>Trvalé príkazy</button>
      </div>

      {tab === 'nova' && (
        <div className="grid grid-2">
          <form className="card card-pad" onSubmit={startPay}>
            <div className="field">
              <label>Z účtu</label>
              <select value={form.fromId} onChange={(e) => set('fromId', e.target.value)}>
                {bank.accounts.filter((a) => a.balance >= 0 || a.id === 'acc_personal').map((a) => (
                  <option key={a.id} value={a.id}>{a.name} · {formatMoney(a.available)}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Meno príjemcu</label>
              <input value={form.toName} onChange={(e) => set('toName', e.target.value)} placeholder="Napr. Jana Kováčová" />
            </div>
            <div className="field">
              <label>IBAN</label>
              <input className="mono" value={form.toIban} onChange={(e) => set('toIban', e.target.value.toUpperCase())} placeholder="SK89 ACCT-000035" />
            </div>
            <div className="row-2">
              <div className="field">
                <label>Suma EUR</label>
                <input type="number" min="0.01" step="0.01" value={form.amount} onChange={(e) => set('amount', e.target.value)} />
              </div>
              <div className="field">
                <label>Variabilný symbol</label>
                <input value={form.vs} onChange={(e) => set('vs', e.target.value.replace(/\D/g, '').slice(0, 10))} />
              </div>
            </div>
            <div className="row-2">
              <div className="field">
                <label>Konštantný symbol</label>
                <input value={form.ks} onChange={(e) => set('ks', e.target.value)} />
              </div>
              <div className="field">
                <label>Špecifický symbol</label>
                <input value={form.ss} onChange={(e) => set('ss', e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Správa pre príjemcu</label>
              <input value={form.note} onChange={(e) => set('note', e.target.value)} maxLength={140} />
            </div>
            <label className="switch" style={{ border: 0, paddingTop: 0 }}>
              <div>
                <div className="t">Okamžitá platba</div>
                <div className="d">Pripísanie do niekoľkých sekúnd, 24/7</div>
              </div>
              <input
                type="checkbox"
                checked={form.instant && bank.settings.instantPayments}
                disabled={!bank.settings.instantPayments}
                onChange={(e) => set('instant', e.target.checked)}
              />
            </label>
            {error && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 10 }}>{error}</div>}
            <button className="btn btn-primary" type="submit">Odoslať na potvrdenie</button>
          </form>

          <div>
            <div className="card card-pad" style={{ marginBottom: 16 }}>
              <h3 style={{ margin: '0 0 10px', fontSize: 15 }}>Uložení príjemcovia</h3>
              {bank.recipients.map((r) => (
                <button key={r.id} className="tx-row" style={{ width: '100%', border: 0, background: 'none' }} onClick={() => fillRecipient(r)}>
                  <div className="tx-ico">{r.name.slice(0, 2).toUpperCase()}</div>
                  <div style={{ textAlign: 'left' }}>
                    <div className="tx-name">{r.name}</div>
                    <div className="tx-meta">{formatIban(r.iban)} · {r.bank}</div>
                  </div>
                </button>
              ))}
            </div>
            {from && (
              <div className="card card-pad">
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Dostupné na účte</div>
                <div style={{ fontSize: 24, fontWeight: 650 }}>{formatMoney(from.available)}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'own' && (
        <form className="card card-pad" style={{ maxWidth: 520 }} onSubmit={ownPay}>
          <div className="field">
            <label>Z účtu</label>
            <select value={own.fromId} onChange={(e) => setOwn({ ...own, fromId: e.target.value })}>
              {bank.accounts.map((a) => <option key={a.id} value={a.id}>{a.name} · {formatMoney(a.available)}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Na účet</label>
            <select value={own.toId} onChange={(e) => setOwn({ ...own, toId: e.target.value })}>
              {bank.accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Suma</label>
            <input type="number" min="0.01" step="0.01" value={own.amount} onChange={(e) => setOwn({ ...own, amount: e.target.value })} />
          </div>
          <div className="field">
            <label>Poznámka</label>
            <input value={own.note} onChange={(e) => setOwn({ ...own, note: e.target.value })} />
          </div>
          {error && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 10 }}>{error}</div>}
          <button className="btn btn-primary" type="submit">Previesť</button>
        </form>
      )}

      {tab === 'tpl' && (
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {bank.templates.map((t) => {
            const r = bank.recipients.find((x) => x.id === t.recipientId)
            return (
              <button key={t.id} className="card card-pad" style={{ textAlign: 'left' }} onClick={() => fillTemplate(t)}>
                <div style={{ fontWeight: 600 }}>{t.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: 13, margin: '4px 0' }}>{r?.name} · {r ? formatIban(r.iban) : ''}</div>
                <div style={{ fontSize: 20, fontWeight: 650 }}>{formatMoney(t.amount)}</div>
              </button>
            )
          })}
        </div>
      )}

      {tab === 'so' && (
        <div className="card">
          <table className="data">
            <thead>
              <tr><th>Názov</th><th>Príjemca</th><th className="right">Suma</th><th>Deň</th><th>Stav</th></tr>
            </thead>
            <tbody>
              {bank.standingOrders.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.toName}</td>
                  <td className="right mono">{formatMoney(s.amount)}</td>
                  <td>{s.day}. v mesiaci</td>
                  <td><span className="pill ok">{s.active ? 'aktívny' : 'pozastavený'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {auth && pending && (
        <AuthModal
          title="Potvrdenie platby"
          amountLabel={`${pending.instant ? 'Okamžitá · ' : ''}${formatMoney(pending.amount)}`}
          lead={`Potvrďte platbu pre ${pending.toName}. Zadajte kód z Čítačky TB.`}
          onCancel={() => setAuth(false)}
          onConfirm={confirm}
        />
      )}
    </div>
  )
}
