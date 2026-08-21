import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { Icon } from './Icons'
import { useBank } from '../store/BankContext'
import { LangSwitch, useI18n } from '../i18n/I18nContext'

export default function Layout() {
  const bank = useBank()
  const { t } = useI18n()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const unread = bank.messages.filter((m) => !m.read).length

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
  ]

  function search(e) {
    e.preventDefault()
    nav(`/ucty?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <div className="app-shell">
      <div className="demo-bar">
        <strong>DEMO</strong> — {t('demo').replace(/^DEMO — /, '')}
      </div>
      <header className="topbar">
        <button type="button" onClick={() => nav('/')} style={{ background: 'none', border: 0, padding: 0, color: 'inherit' }}>
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
          <LangSwitch light />
          <button className="icon-btn" onClick={() => nav('/spravy')} title={t('nav.messages')}>
            <Icon name="bell" />
            {unread > 0 && <span className="badge">{unread}</span>}
          </button>
          <button className="user-chip" onClick={() => nav('/nastavenia')}>
            <span className="avatar">{bank.user.firstName[0]}{bank.user.lastName[0]}</span>
            <span className="who">
              <b>{bank.user.fullName}</b>
              <span>PID {bank.user.pid}</span>
            </span>
          </button>
          <button className="icon-btn" onClick={bank.logout} title={t('logout')}>
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
        {NAV.slice(0, 5).map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive ? 'active' : '')}>
            <Icon name={n.icon} size={18} />
            {n.label.split(' ')[0]}
          </NavLink>
        ))}
      </nav>
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
