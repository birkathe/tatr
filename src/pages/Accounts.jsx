import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useBank } from '../store/BankContext'
import { CATEGORIES } from '../data/seed'
import { formatDate, formatDateTime, formatIban, formatMoney } from '../lib/format'

export default function Accounts() {
  const { id } = useParams()
  const bank = useBank()
  const nav = useNavigate()
  const selected = bank.accounts.find((a) => a.id === id) || bank.accounts[0]
  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')

  useEffect(() => {
    setQ(params.get('q') || '')
  }, [params])
  const [cat, setCat] = useState('all')
  const [dir, setDir] = useState('all')
  const [open, setOpen] = useState(null)

  const txs = useMemo(() => {
    return bank.transactions
      .filter((t) => t.accountId === selected.id)
      .filter((t) => (cat === 'all' ? true : t.category === cat))
      .filter((t) => (dir === 'in' ? t.amount > 0 : dir === 'out' ? t.amount < 0 : true))
      .filter((t) => {
        const s = q.toLowerCase()
        return !s || t.name.toLowerCase().includes(s) || (t.note || '').toLowerCase().includes(s) || (t.vs || '').includes(s) || (t.iban || '').replace(/\s/g, '').toLowerCase().includes(s.replace(/\s/g, ''))
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [bank.transactions, selected.id, q, cat, dir])

  function exportCsv() {
    const rows = [['Dátum', 'Názov', 'Kategória', 'Suma', 'Mena', 'VS', 'Poznámka', 'Zostatok']]
    txs.forEach((t) => {
      rows.push([formatDateTime(t.date), t.name, t.category, String(t.amount).replace('.', ','), t.currency, t.vs, t.note, t.balanceAfter])
    })
    const csv = rows.map((r) => r.map((c) => `"${c ?? ''}"`).join(';')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pohyby-${selected.id}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  let lastDay = ''

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Účty</h1>
          <p>Prehľad zostatkov a pohybov na účtoch Tatra banky</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost" onClick={exportCsv}>Export CSV</button>
          <Link to="/platby" className="btn btn-primary" style={{ width: 'auto', textDecoration: 'none' }}>Nová platba</Link>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 16 }}>
        {bank.accounts.map((a) => (
          <button
            key={a.id}
            className="card card-pad"
            onClick={() => nav(`/ucty/${a.id}`)}
            style={{
              textAlign: 'left',
              borderColor: selected.id === a.id ? 'var(--blue)' : undefined,
              boxShadow: selected.id === a.id ? '0 0 0 3px rgba(11,110,246,.12)' : undefined,
            }}
          >
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{a.product}</div>
            <div style={{ fontWeight: 600, marginTop: 2 }}>{a.name}</div>
            <div style={{ fontSize: 22, fontWeight: 650, letterSpacing: '-0.03em', margin: '10px 0 4px' }}>{formatMoney(a.balance)}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{formatIban(a.iban)}</div>
          </button>
        ))}
      </div>

      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div className="detail-grid">
          <div><div className="k">IBAN</div><div className="v mono">{formatIban(selected.iban)}</div></div>
          <div><div className="k">BIC</div><div className="v">{selected.bic}</div></div>
          <div><div className="k">Dostupné</div><div className="v">{formatMoney(selected.available)}</div></div>
          <div><div className="k">Otvorený</div><div className="v">{formatDate(selected.opened)}</div></div>
          {selected.overdraftLimit != null && (
            <div><div className="k">Povolené prečerpanie</div><div className="v">{formatMoney(selected.overdraftLimit)}</div></div>
          )}
          {selected.creditLimit != null && (
            <div><div className="k">Kreditný limit</div><div className="v">{formatMoney(selected.creditLimit)}</div></div>
          )}
        </div>
      </div>

      <div className="filters">
        <input placeholder="Hľadať pohyb…" value={q} onChange={(e) => setQ(e.target.value)} style={{ minWidth: 220 }} />
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="all">Všetky kategórie</option>
          {Object.entries(CATEGORIES).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <button className={`chip ${dir === 'all' ? 'on' : ''}`} onClick={() => setDir('all')}>Všetko</button>
        <button className={`chip ${dir === 'in' ? 'on' : ''}`} onClick={() => setDir('in')}>Príjmy</button>
        <button className={`chip ${dir === 'out' ? 'on' : ''}`} onClick={() => setDir('out')}>Výdavky</button>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--muted)' }}>{txs.length} pohybov</span>
      </div>

      <div className="card">
        {txs.map((t) => {
          const day = formatDate(t.date)
          const showDay = day !== lastDay
          lastDay = day
          return (
            <div key={t.id}>
              {showDay && <div className="tx-day">{day}</div>}
              <button className="tx-row" style={{ width: '100%', background: 'none', border: 0 }} onClick={() => setOpen(open === t.id ? null : t.id)}>
                <div className={`tx-ico ${t.amount > 0 ? 'in' : ''}`}>{(t.name || '?').slice(0, 2).toUpperCase()}</div>
                <div style={{ textAlign: 'left' }}>
                  <div className="tx-name">{t.name}</div>
                  <div className="tx-meta">{CATEGORIES[t.category]?.label} · {t.type}{t.vs ? ` · VS ${t.vs}` : ''}</div>
                </div>
                <div className={`tx-amt ${t.amount > 0 ? 'in' : ''}`}>
                  {t.amount > 0 ? '+' : ''}{formatMoney(t.amount)}
                </div>
              </button>
              {open === t.id && (
                <div style={{ padding: '0 20px 16px 74px', fontSize: 13 }}>
                  <div className="detail-grid">
                    <div><div className="k">Dátum</div><div className="v">{formatDateTime(t.date)}</div></div>
                    <div><div className="k">Stav</div><div className="v"><span className="pill ok">{t.status}</span></div></div>
                    <div><div className="k">IBAN protistrany</div><div className="v mono">{t.iban ? formatIban(t.iban) : '—'}</div></div>
                    <div><div className="k">Zostatok po pohybe</div><div className="v">{t.balanceAfter != null ? formatMoney(t.balanceAfter) : '—'}</div></div>
                    <div><div className="k">VS / KS / SS</div><div className="v">{t.vs || '—'} / {t.ks || '—'} / {t.ss || '—'}</div></div>
                    <div><div className="k">Poznámka</div><div className="v">{t.note || '—'}</div></div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {txs.length === 0 && <div className="empty">Žiadne pohyby podľa filtra.</div>}
      </div>
    </div>
  )
}
