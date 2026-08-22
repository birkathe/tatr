import { useMemo, useState } from 'react'
import { useBank } from '../store/BankContext'
import { CATEGORIES } from '../data/seed'
import { Donut, MonthBars } from '../components/Charts'
import { useI18n } from '../i18n/I18nContext'
import Select from '../components/Select'

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
  const { t, money, monthName, dateTime, tag } = useI18n()
  const months = lastMonths(6)
  const [period, setPeriod] = useState(months[months.length - 1])
  const monthOptions = months.map((m) => ({ value: m, label: monthName(m) }))
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
      label: t(`cat.${k}`),
      color: CATEGORIES[k]?.color || '#94a3b8',
      value: v,
    }))

  const series = months.map((m) => {
    const list = bank.transactions.filter((t) => t.accountId !== 'acc_credit' && t.date.startsWith(m))
    return {
      label: new Date(`${m}-01`).toLocaleDateString(tag, { month: 'short' }),
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
          <h1>{t('spending.title')}</h1>
          <p>{t('spending.sub')}</p>
        </div>
        <Select value={period} onChange={setPeriod} options={monthOptions} />
      </div>

      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <div className="card kpi">
          <div className="l">{t('spending.income')}</div>
          <div className="v" style={{ color: 'var(--green)' }}>{money(income)}</div>
        </div>
        <div className="card kpi">
          <div className="l">{t('spending.expense')}</div>
          <div className="v">{money(expense)}</div>
        </div>
        <div className="card kpi">
          <div className="l">{t('spending.rest')}</div>
          <div className="v">{money(income - expense)}</div>
          <div className="s">{t('spending.saveRate')} {savingsRate} %</div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 16 }}>
        <div className="card card-pad">
          <h3 style={{ margin: '0 0 12px', fontSize: 15 }}>{t('spending.structure')}</h3>
          {slices.length === 0 ? (
            <div className="empty">{t('spending.empty')}</div>
          ) : (
            <Donut
              slices={slices}
              center={{ top: t('spending.expense'), bottom: money(expense) }}
            />
          )}
        </div>
        <div className="card card-pad">
          <h3 style={{ margin: '0 0 4px', fontSize: 15 }}>{t('spending.months')}</h3>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{t('spending.legend')}</div>
          <MonthBars series={series} />
        </div>
      </div>

      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 10px', fontSize: 15 }}>{t('spending.cats')}</h3>
        {slices.map((s) => (
          <button key={s.key} className="bar-row" style={{ width: '100%', background: 'none', border: 0, cursor: 'pointer' }} onClick={() => setCat(cat === s.key ? 'all' : s.key)}>
            <div style={{ textAlign: 'left', fontWeight: cat === s.key ? 650 : 400 }}>{s.label}</div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${(s.value / (expense || 1)) * 100}%`, background: s.color }} />
            </div>
            <div className="right mono">{money(s.value)}</div>
          </button>
        ))}
      </div>

      <div className="filters">
        <button className={`chip ${cat === 'all' ? 'on' : ''}`} onClick={() => setCat('all')}>{t('spending.all')}</button>
        {slices.map((s) => (
          <button key={s.key} className={`chip ${cat === s.key ? 'on' : ''}`} onClick={() => setCat(s.key)}>{s.label}</button>
        ))}
      </div>

      <div className="card">
        <div className="card-h"><h3>{t('spending.history')}</h3></div>
        <div className="tx-list">
          {list.map((tx) => (
            <div key={tx.id} className="tx-row">
              <div className="tx-ico">{tx.name.slice(0, 2).toUpperCase()}</div>
              <div>
                <div className="tx-name">{tx.name}</div>
                <div className="tx-meta">{dateTime(tx.date)} · {t(`cat.${tx.category}`)}</div>
              </div>
              <div className="tx-amt">{money(tx.amount)}</div>
            </div>
          ))}
          {list.length === 0 && <div className="empty">{t('spending.none')}</div>}
        </div>
      </div>
    </div>
  )
}
