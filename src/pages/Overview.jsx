import { Link } from 'react-router-dom'
import { useBank } from '../store/BankContext'
import { CATEGORIES, FX } from '../data/seed'
import { formatDate, formatIban, formatMoney, greeting } from '../lib/format'
import { Icon } from '../components/Icons'

export default function Overview() {
  const bank = useBank()
  const hide = bank.settings.hideBalances
  const current = bank.accounts.find((a) => a.id === 'acc_personal')
  const assets = bank.accounts.filter((a) => a.balance >= 0).reduce((s, a) => s + a.balance, 0)
    + bank.deposits.filter((d) => d.status === 'aktívny').reduce((s, d) => s + d.amount, 0)
  const recent = [...bank.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8)

  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthTx = bank.transactions.filter((t) => t.date.startsWith(month) && t.accountId === 'acc_personal')
  const spent = monthTx.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
  const income = monthTx.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)

  const byCat = {}
  monthTx.filter((t) => t.amount < 0 && t.category !== 'vklad').forEach((t) => {
    byCat[t.category] = (byCat[t.category] || 0) + Math.abs(t.amount)
  })
  const topCats = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 4)

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{greeting()}, {bank.user.firstName}</h1>
          <p>{new Date().toLocaleDateString('sk-SK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · Košice</p>
        </div>
        <div className="page-actions">
          <Link to="/platby" className="btn btn-primary" style={{ width: 'auto', textDecoration: 'none' }}>
            <Icon name="send" size={16} /> Nová platba
          </Link>
          <Link to="/vklady" className="btn btn-ghost" style={{ textDecoration: 'none' }}>
            <Icon name="plus" size={16} /> Nový vklad
          </Link>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <div className="card kpi">
          <div className="l">Majetok spolu</div>
          <div className="v">{hide ? '••••' : formatMoney(assets)}</div>
          <div className="s">Účty + termínované vklady</div>
        </div>
        <div className="card kpi">
          <div className="l">Sporenie</div>
          <div className="v">{hide ? '••••' : formatMoney(bank.accounts.find((a) => a.id === 'acc_saving')?.balance || 0)}</div>
          <div className="s">Sporiaci účet TB</div>
        </div>
        <div className="card kpi">
          <div className="l">Výdavky tento mesiac</div>
          <div className="v">{hide ? '••••' : formatMoney(spent)}</div>
          <div className="s">Bežný účet</div>
        </div>
        <div className="card kpi">
          <div className="l">Príjmy tento mesiac</div>
          <div className="v" style={{ color: 'var(--green)' }}>{hide ? '••••' : formatMoney(income)}</div>
          <div className="s">Mzda a prevody</div>
        </div>
      </div>

      <div className="grid grid-eq" style={{ marginBottom: 16 }}>
        {bank.accounts.map((a) => (
          <Link key={a.id} to={`/ucty/${a.id}`} className="card acc-tile" style={{ background: a.color }}>
            <div className="prod">{a.product}</div>
            <div className="name">{a.name}</div>
            <div className="iban">{formatIban(a.iban)}</div>
            <div className="bal">{hide ? '•••• €' : formatMoney(a.balance)}</div>
            <div className="sub">
              {a.creditLimit
                ? `Limit ${formatMoney(a.creditLimit)} · dostupné ${hide ? '••••' : formatMoney(a.available)}`
                : `Dostupné ${hide ? '••••' : formatMoney(a.available)}`}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-h">
            <h3>Posledné pohyby</h3>
            <Link to="/ucty/acc_personal">Všetky pohyby</Link>
          </div>
          <div className="tx-list">
            {recent.map((t) => (
              <div key={t.id} className="tx-row">
                <div className={`tx-ico ${t.amount > 0 ? 'in' : ''}`}>
                  {(t.name || '?').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="tx-name">{t.name}</div>
                  <div className="tx-meta">
                    {formatDate(t.date)} · {CATEGORIES[t.category]?.label || t.category} · {t.type}
                  </div>
                </div>
                <div className={`tx-amt ${t.amount > 0 ? 'in' : ''}`}>
                  {hide ? '••••' : `${t.amount > 0 ? '+' : ''}${formatMoney(t.amount)}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          <div className="card card-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 15 }}>Spending report TB</h3>
              <Link to="/vydavky">Detail</Link>
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>
              Najväčšie kategórie za {new Date().toLocaleDateString('sk-SK', { month: 'long' })}
            </div>
            {topCats.length === 0 ? (
              <div className="empty" style={{ padding: '18px 0' }}>V tomto mesiaci zatiaľ nie sú žiadne výdavky.</div>
            ) : topCats.map(([k, v]) => (
              <div className="bar-row" key={k}>
                <div style={{ fontSize: 13 }}>{CATEGORIES[k]?.label}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(v / (spent || 1)) * 100}%`, background: CATEGORIES[k]?.color }} />
                </div>
                <div className="right mono" style={{ fontSize: 13 }}>{formatMoney(v)}</div>
              </div>
            ))}
          </div>

          <div className="card card-pad">
            <h3 style={{ margin: '0 0 10px', fontSize: 15 }}>Kurzový lístok</h3>
            {FX.slice(0, 4).map((f) => (
              <div key={f.pair} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', fontSize: 13, padding: '6px 0', borderBottom: '1px solid var(--line-2)' }}>
                <span>{f.flag} {f.pair}</span>
                <span className="mono">{f.buy}</span>
                <span className="mono right">{f.sell}</span>
              </div>
            ))}
          </div>

          {current && (
            <div className="card card-pad" style={{ background: '#0b0b10', color: '#fff', border: 0 }}>
              <div style={{ fontSize: 12, opacity: 0.65 }}>Rýchla platba z {current.name}</div>
              <div style={{ fontSize: 22, fontWeight: 600, margin: '6px 0 12px' }}>
                {hide ? '••••' : formatMoney(current.available)}
              </div>
              <Link to="/platby" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                Zadať platobný príkaz
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
