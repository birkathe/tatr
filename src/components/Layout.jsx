import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { Icon } from './Icons'
import { useBank } from '../store/BankContext'
import { useI18n } from '../i18n/I18nContext'

export default function Layout() {
  const bank = useBank()
  const { t } = useI18n()
  const nav = useNavigate()
  const loc = useLocation()
  const [q, setQ] = useState('')
  const [more, setMore] = useState(false)

  const NAV = [
    { to: '/', label: t('nav.overview'), icon: 'home', end: true },
    { to: '/ucty', label: t('nav.accounts'), icon: 'wallet' },
    { to: '/platby', label: t('nav.payments'), icon: 'send' },
    { to: '/karty', label: t('nav.cards'), icon: 'card' },
    { to: '/vklady', label: t('nav.deposits'), icon: 'vault' },
    { to: '/vydavky', label: t('nav.spending'), icon: 'chart' },
    { to: '/prijemcovia', label: t('nav.recipients'), icon: 'users' },
    { to: '/dokumenty', label: t('nav.documents'), icon: 'file' },
    { to: '/spravy', label: t('nav.messages'), icon: 'inbox' },
    { to: '/nastavenia', label: t('nav.settings'), icon: 'gear' },
    { to: '/kurzy', label: t('nav.rates'), icon: 'chart' },
    { to: '/pobocky', label: t('nav.branches'), icon: 'home' },
    { to: '/produkty', label: t('nav.products'), icon: 'wallet' },
    { to: '/uvery', label: t('nav.loans'), icon: 'file' },
    { to: '/bezpecnost', label: t('nav.security'), icon: 'gear' },
    { to: '/pomoc', label: t('nav.help'), icon: 'inbox' },
  ]

  const tabs = [NAV[0], NAV[2], NAV[3], NAV[4]]
  const extra = NAV.filter((n) => !tabs.includes(n))
  const extraActive = extra.some((n) => (n.end ? loc.pathname === n.to : loc.pathname.startsWith(n.to)))

  function search(e) {
    e.preventDefault()
    nav(`/ucty?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button type="button" className="logo-btn" onClick={() => nav('/')}>
          <Logo light compact={false} />
        </button>
        <form className="search" onSubmit={search}>
          <Icon name="search" size={16} />
          <input
            placeholder={t('search')}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
        <div className="topbar-right">
          <button className="icon-btn" onClick={() => nav('/spravy')} title={t('nav.messages')}>
            <Icon name="bell" />
          </button>
          <button className="user-chip" onClick={() => nav('/nastavenia')}>
            <span className="avatar">{bank.user.firstName[0]}{bank.user.lastName[0]}</span>
            <span className="who">
              <b>{bank.user.fullName}</b>
              <span>PID {bank.user.pid}</span>
            </span>
          </button>
          <button className="icon-btn desktop-only" onClick={bank.logout} title={t('logout')}>
            <Icon name="logout" />
          </button>
        </div>
      </header>
      <div className="app-body">
        <aside className="sidebar">
          <div className="nav-label">{t('nav.banking')}</div>
          {NAV.slice(0, 6).map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon name={n.icon} /> {n.label}
            </NavLink>
          ))}
          <div className="nav-label">{t('nav.other')}</div>
          {NAV.slice(6).map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon name={n.icon} /> {n.label}
            </NavLink>
          ))}
          <div className="sidebar-foot">
            DIALOG Live <b>*1100</b>
            <br />
            8:00 – 20:00
          </div>
        </aside>
        <main className="main">
          <Outlet />
        </main>
      </div>
      <nav className="mobile-nav">
        {tabs.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive ? 'active' : '')}>
            <Icon name={n.icon} size={20} />
            <span>{n.label.split(' ')[0]}</span>
          </NavLink>
        ))}
        <button type="button" className={extraActive || more ? 'active' : ''} onClick={() => setMore(true)}>
          <Icon name="gear" size={20} />
          <span>{t('more')}</span>
        </button>
      </nav>
      {more && (
        <div className="more-sheet" onClick={() => setMore(false)}>
          <div className="more-panel" onClick={(e) => e.stopPropagation()}>
            <div className="more-handle" />
            <h3>{t('more')}</h3>
            {extra.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className="more-link" onClick={() => setMore(false)}>
                <Icon name={n.icon} /> {n.label}
              </NavLink>
            ))}
            <button type="button" className="more-link danger" onClick={() => { setMore(false); bank.logout() }}>
              <Icon name="logout" /> {t('logout')}
            </button>
          </div>
        </div>
      )}
      <div className="toasts">
        {bank.toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.tone === 'err' ? 'err' : ''}`}>
            {toast.text}
          </div>
        ))}
      </div>
    </div>
  )
}
