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
  const deposits = bank.deposits.filter((d) => d.status === 'aktívny')
  const depSum = deposits.reduce((s, d) => s + d.amount, 0)
  const assets = bank.accounts.reduce((s, a) => s + Math.max(0, a.balance), 0) + depSum
  const recent = [...bank.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8)
  const lastLogin = localStorage.getItem('tb-ib-last-login')
  const msgs = bank.messages.slice(0, 3)

  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthTx = bank.transactions.filter((tx) => tx.date.startsWith(month))
  const spendTx = monthTx.filter((tx) => tx.amount < 0 && tx.category !== 'vklad')
  const spent = spendTx.reduce((s, tx) => s + Math.abs(tx.amount), 0)
  const income = monthTx.filter((tx) => tx.amount > 0).reduce((s, tx) => s + tx.amount, 0)
  const byCat = {}
  spendTx.forEach((tx) => {
    byCat[tx.category] = (byCat[tx.category] || 0) + Math.abs(tx.amount)
  })
  const topCats = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 5)

  function copyIban(iban) {
    const raw = (iban || '').replace(/\s/g, '')
    navigator.clipboard?.writeText(raw).then(() => bank.toast(t('copied')))
  }

  return (
    <div className="dash">
      <div className="page-head">
        <div>
          <h1>{greet()}, {bank.user.firstName}</h1>
          <p>
            {new Date().toLocaleDateString(tag, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            {lastLogin ? ` · ${t('lastLogin')} ${new Date(lastLogin).toLocaleTimeString(tag, { hour: '2-digit', minute: '2-digit' })}` : ''}
          </p>
        </div>
        <div className="page-actions desktop-only">
          <Link to="/platby" className="btn btn-primary" style={{ width: 'auto', textDecoration: 'none' }}>
            <Icon name="send" size={16} /> {t('overview.newPayment')}
          </Link>
        </div>
      </div>

      <div className="dash-kpis">
        <div className="kpi-inline">
          <span>{t('overview.assets')}</span>
          <b>{hide ? '••••' : money(assets)}</b>
        </div>
        <div className="kpi-inline">
          <span>{t('overview.spent')}</span>
          <b>{hide ? '••••' : money(spent)}</b>
        </div>
        <div className="kpi-inline">
          <span>{t('overview.income')}</span>
          <b className="in">{hide ? '••••' : money(income)}</b>
        </div>
      </div>

      <div className="dash-products">
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
              <Link to="/platby">{t('overview.newPayment')}</Link>
              <button type="button" onClick={() => bank.updateSettings({ hideBalances: !hide })}>
                {hide ? t('login.show') : t('login.hide')}
              </button>
            </div>
          </div>
        ))}
        {deposits.map((d) => (
          <Link key={d.id} to="/vklady" className="card acc-tile dep-tile">
            <div className="prod">{t('overview.deposit')}</div>
            <div className="name">{d.name}</div>
            <div className="iban">{d.months} · {d.rate.toFixed(1).replace('.', ',')} % p.a.</div>
            <div className="bal">{hide ? '•••• €' : money(d.amount)}</div>
            <div className="sub">
              {date(d.start)} – {date(d.end)} · +{hide ? '••••' : money(d.interestExpected)}
            </div>
          </Link>
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
        <Link to="/vydavky" className="quick-item">
          <span className="quick-ico"><Icon name="chart" size={18} /></span>
          {t('nav.spending')}
        </Link>
        <Link to="/prijemcovia" className="quick-item hide-mobile">
          <span className="quick-ico"><Icon name="users" size={18} /></span>
          {t('nav.recipients')}
        </Link>
        <Link to="/dokumenty" className="quick-item hide-mobile">
          <span className="quick-ico"><Icon name="file" size={18} /></span>
          {t('nav.documents')}
        </Link>
      </div>

      <div className="dash-body">
        <div className="card dash-span">
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
                    {date(tx.date)} · {t(`cat.${tx.category}`)}
                  </div>
                </div>
                <div className={`tx-amt ${tx.amount > 0 ? 'in' : ''}`}>
                  {hide ? '••••' : `${tx.amount > 0 ? '+' : ''}${money(tx.amount)}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-side">
          <div className={`card card-pad ${topCats.length === 0 ? 'hide-mobile' : ''}`}>
            <div className="card-h" style={{ padding: 0, marginBottom: 10 }}>
              <h3>{t('overview.spending')}</h3>
              <Link to="/vydavky">Detail</Link>
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>
              {now.toLocaleDateString(tag, { month: 'long', year: 'numeric' })}
            </div>
            {topCats.length === 0 ? (
              <div className="empty" style={{ padding: '12px 0' }}>{t('overview.noSpend')}</div>
            ) : topCats.map(([k, v]) => (
              <div className="bar-row" key={k}>
                <div style={{ fontSize: 13 }}>{t(`cat.${k}`)}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(v / (spent || 1)) * 100}%`, background: 'var(--blue)' }} />
                </div>
                <div className="right mono" style={{ fontSize: 13 }}>{money(v)}</div>
              </div>
            ))}
          </div>

          <div className="card card-pad hide-mobile">
            <h3 style={{ margin: '0 0 10px', fontSize: 15 }}>{t('overview.fx')}</h3>
            <div className="fx-head">
              <span />
              <span>Nákup</span>
              <span>Predaj</span>
            </div>
            {FX.map((f) => (
              <div key={f.pair} className="fx-row">
                <span>{f.flag} {f.pair}</span>
                <span className="mono">{f.buy}</span>
                <span className="mono right">{f.sell}</span>
              </div>
            ))}
          </div>

          <div className="card card-pad hide-mobile">
            <div className="card-h" style={{ padding: 0, marginBottom: 8 }}>
              <h3>{t('nav.messages')}</h3>
              <Link to="/spravy">{t('overview.allMoves')}</Link>
            </div>
            {msgs.map((m) => (
              <Link key={m.id} to="/spravy" className="msg-snip">
                <b>{m.title}</b>
                <span>{date(m.date)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
