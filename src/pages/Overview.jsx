import { Link } from 'react-router-dom'
import { useBank } from '../store/BankContext'
import { FX } from '../data/seed'
import { formatIban } from '../lib/format'
import { Icon } from '../components/Icons'
import { useI18n } from '../i18n/I18nContext'

export default function Overview() {
  const bank = useBank()
  const { t, money, date, greet, tag } = useI18n()
  const hide = bank.settings.hideBalances
  const current = bank.accounts.find((a) => a.id === 'acc_personal')
  const dep = bank.deposits.filter((d) => d.status === 'aktívny').reduce((s, d) => s + d.amount, 0)
  const assets = bank.accounts.reduce((s, a) => s + Math.max(0, a.balance), 0) + dep
  const recent = [...bank.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8)

  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthTx = bank.transactions.filter((tx) => tx.date.startsWith(month) && tx.accountId === 'acc_personal')
  const spent = monthTx.filter((tx) => tx.amount < 0).reduce((s, tx) => s + Math.abs(tx.amount), 0)
  const income = monthTx.filter((tx) => tx.amount > 0).reduce((s, tx) => s + tx.amount, 0)

  const byCat = {}
  monthTx.filter((tx) => tx.amount < 0 && tx.category !== 'vklad').forEach((tx) => {
    byCat[tx.category] = (byCat[tx.category] || 0) + Math.abs(tx.amount)
  })
  const topCats = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 4)
  const lastLogin = localStorage.getItem('tb-ib-last-login')

  function copyIban(iban) {
    const raw = (iban || '').replace(/\s/g, '')
    navigator.clipboard?.writeText(raw).then(() => bank.toast(t('copied')))
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{greet()}, {bank.user.firstName}</h1>
          <p>{now.toLocaleDateString(tag, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · Košice</p>
          {lastLogin && (
            <p className="last-login">{t('lastLogin')}: {date(lastLogin)} {new Date(lastLogin).toLocaleTimeString(tag, { hour: '2-digit', minute: '2-digit' })}</p>
          )}
        </div>
        <div className="page-actions desktop-only">
          <Link to="/platby" className="btn btn-primary" style={{ width: 'auto', textDecoration: 'none' }}>
            <Icon name="send" size={16} /> {t('overview.newPayment')}
          </Link>
          <Link to="/vklady" className="btn btn-ghost" style={{ textDecoration: 'none' }}>
            <Icon name="plus" size={16} /> {t('overview.newDeposit')}
          </Link>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        <div className="card kpi">
          <div className="l">{t('overview.assets')}</div>
          <div className="v">{hide ? '••••' : money(assets)}</div>
          <div className="s">{t('overview.assetsHint')}</div>
        </div>
        <div className="card kpi">
          <div className="l">{t('overview.deposit')}</div>
          <div className="v">{hide ? '••••' : money(dep)}</div>
          <div className="s">{t('overview.depositHint')}</div>
        </div>
        <div className="card kpi">
          <div className="l">{t('overview.spent')}</div>
          <div className="v">{hide ? '••••' : money(spent)}</div>
          <div className="s">{t('overview.current')}</div>
        </div>
        <div className="card kpi">
          <div className="l">{t('overview.income')}</div>
          <div className="v" style={{ color: 'var(--green)' }}>{hide ? '••••' : money(income)}</div>
          <div className="s">{t('overview.salary')}</div>
        </div>
      </div>

      <div className="home-account">
        {bank.accounts.map((a) => (
          <div key={a.id} className="card acc-tile" style={{ background: a.color }}>
            <div className="prod">{t('product.current')}</div>
            <div className="name">{t('product.personal')}</div>
            <button type="button" className="iban-copy" onClick={() => copyIban(a.iban)}>
              {formatIban(a.iban)} · {t('copy')}
            </button>
            <div className="bal">{hide ? '•••• €' : money(a.balance)}</div>
            <div className="sub">{t('overview.available')} {hide ? '••••' : money(a.available)}</div>
            <div className="acc-tile-actions">
              <Link to="/ucty/acc_personal">{t('overview.allMoves')}</Link>
              <button type="button" onClick={() => bank.updateSettings({ hideBalances: !hide })}>
                {hide ? t('login.show') : t('login.hide')}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="quick-row">
        <Link to="/platby" className="quick-item">
          <span className="quick-ico"><Icon name="send" size={18} /></span>
          {t('overview.newPayment')}
        </Link>
        <Link to="/vklady" className="quick-item">
          <span className="quick-ico"><Icon name="vault" size={18} /></span>
          {t('nav.deposits')}
        </Link>
        <Link to="/karty" className="quick-item">
          <span className="quick-ico"><Icon name="card" size={18} /></span>
          {t('nav.cards')}
        </Link>
        <Link to="/prijemcovia" className="quick-item">
          <span className="quick-ico"><Icon name="users" size={18} /></span>
          {t('nav.recipients')}
        </Link>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-h">
            <h3>{t('overview.lastMoves')}</h3>
            <Link to="/ucty/acc_personal">{t('overview.allMoves')}</Link>
          </div>
          <div className="tx-list">
            {recent.map((tx) => (
              <div key={tx.id} className="tx-row">
                <div className={`tx-ico ${tx.amount > 0 ? 'in' : ''}`}>
                  {(tx.name || '?').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="tx-name">{tx.name}</div>
                  <div className="tx-meta">
                    {date(tx.date)} · {t(`cat.${tx.category}`)} · {tx.type}
                  </div>
                </div>
                <div className={`tx-amt ${tx.amount > 0 ? 'in' : ''}`}>
                  {hide ? '••••' : `${tx.amount > 0 ? '+' : ''}${money(tx.amount)}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          <div className="card card-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 15 }}>{t('overview.spending')}</h3>
              <Link to="/vydavky">Detail</Link>
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>
              {t('overview.spendingCats')} {now.toLocaleDateString(tag, { month: 'long' })}
            </div>
            {topCats.length === 0 ? (
              <div className="empty" style={{ padding: '18px 0' }}>{t('overview.noSpend')}</div>
            ) : topCats.map(([k, v]) => (
              <div className="bar-row" key={k}>
                <div style={{ fontSize: 13 }}>{t(`cat.${k}`)}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(v / (spent || 1)) * 100}%`, background: '#0b6ef6' }} />
                </div>
                <div className="right mono" style={{ fontSize: 13 }}>{money(v)}</div>
              </div>
            ))}
          </div>

          <div className="card card-pad">
            <h3 style={{ margin: '0 0 10px', fontSize: 15 }}>{t('overview.fx')}</h3>
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
              <div style={{ fontSize: 12, opacity: 0.65 }}>{t('overview.quick')} {current.name}</div>
              <div style={{ fontSize: 22, fontWeight: 600, margin: '6px 0 12px' }}>
                {hide ? '••••' : money(current.available)}
              </div>
              <Link to="/platby" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                {t('overview.send')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
