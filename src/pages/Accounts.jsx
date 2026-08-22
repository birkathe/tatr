import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useBank } from '../store/BankContext'
import { CATEGORIES } from '../data/seed'
import { formatIban } from '../lib/format'
import { useI18n } from '../i18n/I18nContext'
import Select from '../components/Select'

export default function Accounts() {
  const { id } = useParams()
  const bank = useBank()
  const { t, money, date, dateTime } = useI18n()
  const selected = bank.accounts.find((a) => a.id === id) || bank.accounts[0]
  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')
  const [cat, setCat] = useState('all')
  const [dir, setDir] = useState('all')
  const [open, setOpen] = useState(null)

  useEffect(() => {
    setQ(params.get('q') || '')
  }, [params])

  const txs = useMemo(() => {
    if (!selected) return []
    return bank.transactions
      .filter((tx) => tx.accountId === selected.id)
      .filter((tx) => (cat === 'all' ? true : tx.category === cat))
      .filter((tx) => (dir === 'in' ? tx.amount > 0 : dir === 'out' ? tx.amount < 0 : true))
      .filter((tx) => {
        const s = q.toLowerCase()
        return (
          !s ||
          tx.name.toLowerCase().includes(s) ||
          (tx.note || '').toLowerCase().includes(s) ||
          (tx.vs || '').includes(s) ||
          (tx.iban || '').replace(/\s/g, '').toLowerCase().includes(s.replace(/\s/g, ''))
        )
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [bank.transactions, selected, q, cat, dir])

  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthTx = (bank.transactions || []).filter((tx) => selected && tx.accountId === selected.id && tx.date.startsWith(month))
  const inSum = monthTx.filter((tx) => tx.amount > 0).reduce((s, tx) => s + tx.amount, 0)
  const outSum = monthTx.filter((tx) => tx.amount < 0).reduce((s, tx) => s + Math.abs(tx.amount), 0)

  function exportCsv() {
    const rows = [['Dátum', 'Názov', 'Kategória', 'Suma', 'Mena', 'VS', 'Poznámka', 'Zostatok']]
    txs.forEach((tx) => {
      rows.push([dateTime(tx.date), tx.name, tx.category, String(tx.amount).replace('.', ','), tx.currency, tx.vs, tx.note, tx.balanceAfter])
    })
    const csv = rows.map((r) => r.map((c) => `"${c ?? ''}"`).join(';')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pohyby-${selected?.id || 'ucet'}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function copyIban() {
    if (!selected) return
    navigator.clipboard?.writeText(selected.iban.replace(/\s/g, '')).then(() => bank.toast(t('copied')))
  }

  if (!selected) {
    return <div className="empty">{t('accounts.empty')}</div>
  }

  let lastDay = ''

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{t('accounts.title')}</h1>
          <p>{t('accounts.sub')}</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost" onClick={exportCsv}>{t('accounts.export')}</button>
          <Link to="/platby" className="btn btn-primary" style={{ width: 'auto', textDecoration: 'none' }}>
            {t('accounts.newPayment')}
          </Link>
        </div>
      </div>

      <div className="card acc-tile" style={{ background: selected.color || '#0b0b10', marginBottom: 16, minHeight: 170 }}>
        <div className="prod">{t('product.current')}</div>
        <div className="name">{t('product.personal')}</div>
        <button type="button" className="iban-copy" onClick={copyIban}>
          {formatIban(selected.iban)} · {t('copy')}
        </button>
        <div className="bal">{money(selected.balance)}</div>
        <div className="sub">{t('overview.available')} {money(selected.available)}</div>
      </div>

      <div className="dash-kpis" style={{ marginBottom: 16 }}>
        <div className="kpi-inline">
          <span>{t('overview.income')}</span>
          <b className="in">{money(inSum)}</b>
        </div>
        <div className="kpi-inline">
          <span>{t('overview.spent')}</span>
          <b>{money(outSum)}</b>
        </div>
        <div className="kpi-inline">
          <span>{t('accounts.moves')}</span>
          <b>{txs.length}</b>
        </div>
      </div>

      <div className="grid grid-eq" style={{ marginBottom: 16 }}>
        <div className="card card-pad">
          <div className="k">{t('settings.name')}</div>
          <div className="v" style={{ marginTop: 6 }}>{bank.user.fullName}</div>
          <div className="k" style={{ marginTop: 12 }}>{t('settings.branch')}</div>
          <div className="v" style={{ marginTop: 6 }}>{bank.user.branch}</div>
        </div>
        <div className="card card-pad">
          <div className="detail-grid">
            <div><div className="k">IBAN</div><div className="v mono">{formatIban(selected.iban)}</div></div>
            <div><div className="k">BIC</div><div className="v">{selected.bic}</div></div>
            <div><div className="k">{t('accounts.available')}</div><div className="v">{money(selected.available)}</div></div>
            <div><div className="k">{t('accounts.opened')}</div><div className="v">{date(selected.opened)}</div></div>
            {selected.overdraftLimit != null && (
              <div><div className="k">{t('accounts.overdraft')}</div><div className="v">{money(selected.overdraftLimit)}</div></div>
            )}
          </div>
        </div>
      </div>

      <div className="filters">
        <input placeholder={t('accounts.search')} value={q} onChange={(e) => setQ(e.target.value)} style={{ minWidth: 220 }} />
        <Select
          value={cat}
          onChange={setCat}
          options={[
            { value: 'all', label: t('accounts.allCats') },
            ...Object.keys(CATEGORIES).map((k) => ({ value: k, label: t(`cat.${k}`) })),
          ]}
        />
        <button className={`chip ${dir === 'all' ? 'on' : ''}`} onClick={() => setDir('all')}>{t('accounts.all')}</button>
        <button className={`chip ${dir === 'in' ? 'on' : ''}`} onClick={() => setDir('in')}>{t('accounts.in')}</button>
        <button className={`chip ${dir === 'out' ? 'on' : ''}`} onClick={() => setDir('out')}>{t('accounts.out')}</button>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--muted)' }}>{txs.length} {t('accounts.moves')}</span>
      </div>

      <div className="card">
        {txs.map((tx) => {
          const day = date(tx.date)
          const showDay = day !== lastDay
          lastDay = day
          return (
            <div key={tx.id}>
              {showDay && <div className="tx-day">{day}</div>}
              <button
                className="tx-row"
                style={{ width: '100%', background: 'none', border: 0 }}
                onClick={() => setOpen(open === tx.id ? null : tx.id)}
              >
                <div className={`tx-ico ${tx.amount > 0 ? 'in' : ''}`}>{(tx.name || '?').slice(0, 2).toUpperCase()}</div>
                <div style={{ textAlign: 'left', minWidth: 0 }}>
                  <div className="tx-name">{tx.name}</div>
                  <div className="tx-meta">
                    {t(`cat.${tx.category}`)} · {tx.type}
                    {tx.vs ? ` · VS ${tx.vs}` : ''}
                  </div>
                </div>
                <div className={`tx-amt ${tx.amount > 0 ? 'in' : ''}`}>
                  {tx.amount > 0 ? '+' : ''}
                  {money(tx.amount)}
                </div>
              </button>
              {open === tx.id && (
                <div style={{ padding: '0 20px 16px 74px', fontSize: 13 }}>
                  <div className="detail-grid">
                    <div><div className="k">{t('accounts.date')}</div><div className="v">{dateTime(tx.date)}</div></div>
                    <div><div className="k">{t('accounts.status')}</div><div className="v"><span className="pill ok">{tx.status}</span></div></div>
                    <div><div className="k">{t('accounts.counterIban')}</div><div className="v mono">{tx.iban ? formatIban(tx.iban) : '—'}</div></div>
                    <div><div className="k">{t('accounts.after')}</div><div className="v">{tx.balanceAfter != null ? money(tx.balanceAfter) : '—'}</div></div>
                    <div><div className="k">{t('accounts.symbols')}</div><div className="v">{tx.vs || '—'} / {tx.ks || '—'} / {tx.ss || '—'}</div></div>
                    <div><div className="k">{t('accounts.note')}</div><div className="v">{tx.note || '—'}</div></div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {txs.length === 0 && <div className="empty">{t('accounts.empty')}</div>}
      </div>
    </div>
  )
}
