import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { Icon } from './Icons'
import { useBank } from '../store/BankContext'

const NAV = [
  { to: '/', label: 'Prehľad', icon: 'home', end: true },
  { to: '/ucty', label: 'Účty', icon: 'wallet' },
  { to: '/platby', label: 'Platby', icon: 'send' },
  { to: '/karty', label: 'Karty', icon: 'card' },
  { to: '/vklady', label: 'Termínované vklady', icon: 'vault' },
  { to: '/vydavky', label: 'Spending report TB', icon: 'chart' },
  { to: '/prijemcovia', label: 'Príjemcovia', icon: 'users' },
  { to: '/dokumenty', label: 'Dokumenty', icon: 'file' },
  { to: '/spravy', label: 'Správy', icon: 'inbox' },
  { to: '/nastavenia', label: 'Nastavenia', icon: 'gear' },
]

export default function Layout() {
  const bank = useBank()
  const nav = useNavigate()
  const unread = bank.messages.filter((m) => !m.read).length

  return (
    <div className="app-shell">
      <div className="demo-bar">
        <strong>DEMO</strong> — toto nie je oficiálna služba Tatra banky. Ukážková kópia s fiktívnymi dátami.
      </div>
      <header className="topbar">
        <Logo light compact={false} />
        <div className="search">
          <Icon name="search" size={16} />
          <input placeholder="Hľadať pohyb, príjemcu, IBAN…" />
        </div>
        <div className="topbar-right">
          <button className="icon-btn" onClick={() => nav('/spravy')} title="Správy">
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
          <button className="icon-btn" onClick={bank.logout} title="Odhlásiť sa">
            <Icon name="logout" />
          </button>
        </div>
      </header>
      <div className="app-body">
        <aside className="sidebar">
          <div className="nav-label">Bankovníctvo</div>
          {NAV.slice(0, 6).map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon name={n.icon} /> {n.label}
            </NavLink>
          ))}
          <div className="nav-label">Ostatné</div>
          {NAV.slice(6).map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon name={n.icon} /> {n.label}
            </NavLink>
          ))}
          <div className="sidebar-foot">
            DIALOG Live <b>*1100</b>
            <br />
            Denne 8:00 – 20:00
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
        {bank.toasts.map((t) => (
          <div key={t.id} className={`toast ${t.tone === 'err' ? 'err' : ''}`}>
            {t.text}
          </div>
        ))}
      </div>
    </div>
  )
}
