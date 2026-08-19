import { useMemo, useState } from 'react'
import { useBank } from '../store/BankContext'
import { CATEGORIES } from '../data/seed'
import { Donut, MonthBars } from '../components/Charts'
import { formatMoney, monthLabel } from '../lib/format'

function monthKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

function lastMonths(n) {
  const out = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    out.push(monthKey(d))
  }
  return out
}

export default function Spending() {
  const bank = useBank()
  const months = lastMonths(6)
  const [period, setPeriod] = useState(months[months.length - 1])
  const [cat, setCat] = useState('all')

  const scoped = useMemo(
    () => bank.transactions.filter((t) => t.accountId !== 'acc_credit' && t.date.startsWith(period)),
    [bank.transactions, period]
  )

  const income = scoped.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const expense = scoped.filter((t) => t.amount < 0 && t.category !== 'vklad').reduce((s, t) => s + Math.abs(t.amount), 0)
  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0

  const byCat = {}
  scoped.filter((t) => t.amount < 0 && t.category !== 'vklad').forEach((t) => {
    byCat[t.category] = (byCat[t.category] || 0) + Math.abs(t.amount)
  })
  const slices = Object.entries(byCat)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => ({
      key: k,
      label: CATEGORIES[k]?.label || k,
      color: CATEGORIES[k]?.color || '#94a3b8',
      value: v,
    }))

  const series = months.map((m) => {
    const list = bank.transactions.filter((t) => t.accountId !== 'acc_credit' && t.date.startsWith(m))
    return {
      label: new Date(`${m}-01`).toLocaleDateString('sk-SK', { month: 'short' }),
      in: list.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0),
      out: list.filter((t) => t.amount < 0 && t.category !== 'vklad').reduce((s, t) => s + Math.abs(t.amount), 0),
    }
  })

  const list = scoped
    .filter((t) => (cat === 'all' ? t.amount < 0 && t.category !== 'vklad' : t.category === cat && t.amount < 0))
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Spending report TB</h1>
          <p>Prehľad príjmov a výdavkov na bežnom účte v interaktívnych grafoch</p>
        </div>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} style={{ height: 40, borderRadius: 10, border: '1px solid var(--line)', padding: '0 10px' }}>
          {months.map((m) => (
            <option key={m} value={m}>{monthLabel(m)}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <div className="card kpi">
          <div className="l">Príjmy</div>
          <div className="v" style={{ color: 'var(--green)' }}>{formatMoney(income)}</div>
        </div>
        <div className="card kpi">
          <div className="l">Výdavky</div>
          <div className="v">{formatMoney(expense)}</div>
        </div>
        <div className="card kpi">
          <div className="l">Zostatok mesiaca</div>
          <div className="v">{formatMoney(income - expense)}</div>
          <div className="s">Miera úspor {savingsRate} %</div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 16 }}>
        <div className="card card-pad">
          <h3 style={{ margin: '0 0 12px', fontSize: 15 }}>Štruktúra výdavkov</h3>
          {slices.length === 0 ? (
            <div className="empty">Za toto obdobie nie sú výdavky.</div>
          ) : (
            <Donut
              slices={slices}
              center={{ top: 'Výdavky', bottom: formatMoney(expense) }}
            />
          )}
        </div>
        <div className="card card-pad">
          <h3 style={{ margin: '0 0 4px', fontSize: 15 }}>Posledných 6 mesiacov</h3>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>zelená príjem · modrá výdavky</div>
          <MonthBars series={series} />
        </div>
      </div>

      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 10px', fontSize: 15 }}>Kategórie</h3>
        {slices.map((s) => (
          <button key={s.key} className="bar-row" style={{ width: '100%', background: 'none', border: 0, cursor: 'pointer' }} onClick={() => setCat(cat === s.key ? 'all' : s.key)}>
            <div style={{ textAlign: 'left', fontWeight: cat === s.key ? 650 : 400 }}>{s.label}</div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${(s.value / (expense || 1)) * 100}%`, background: s.color }} />
            </div>
            <div className="right mono">{formatMoney(s.value)}</div>
          </button>
        ))}
      </div>

      <div className="filters">
        <button className={`chip ${cat === 'all' ? 'on' : ''}`} onClick={() => setCat('all')}>Všetky výdavky</button>
        {slices.map((s) => (
          <button key={s.key} className={`chip ${cat === s.key ? 'on' : ''}`} onClick={() => setCat(s.key)}>{s.label}</button>
        ))}
      </div>

      <div className="card">
        <div className="card-h"><h3>História výdavkov</h3></div>
        <div className="tx-list">
          {list.map((t) => (
            <div key={t.id} className="tx-row">
              <div className="tx-ico">{t.name.slice(0, 2).toUpperCase()}</div>
              <div>
                <div className="tx-name">{t.name}</div>
                <div className="tx-meta">{new Date(t.date).toLocaleString('sk-SK')} · {CATEGORIES[t.category]?.label}</div>
              </div>
              <div className="tx-amt">{formatMoney(t.amount)}</div>
            </div>
          ))}
          {list.length === 0 && <div className="empty">Žiadne výdavky v tejto kategórii.</div>}
        </div>
      </div>
    </div>
  )
}
