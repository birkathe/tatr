import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { Icon } from '../components/Icons'
import { LangSwitch, useI18n } from '../i18n/I18nContext'
import { useTheme } from '../theme/ThemeContext'

export default function Landing() {
  const { t } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const [menu, setMenu] = useState(false)

  const products = [
    { icon: 'wallet', title: t('landing.accT'), text: t('landing.accD') },
    { icon: 'card', title: t('landing.cardT'), text: t('landing.cardD') },
    { icon: 'vault', title: t('landing.depT'), text: t('landing.depD') },
    { icon: 'send', title: t('landing.payT'), text: t('landing.payD') },
  ]

  return (
    <div className="site">
      <header className="site-top">
        <Logo light sub={false} />
        <div className="site-top-right">
          <nav className="site-nav">
            <a href="#produkty">{t('nav.products')}</a>
            <a href="#pobocky">{t('nav.branches')}</a>
            <a href="#pomoc">{t('nav.help')}</a>
          </nav>
          <button type="button" className="icon-btn desktop-only" onClick={toggleTheme} title={t('settings.theme')}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
          </button>
          <LangSwitch light />
          <Link to="/prihlasenie" className="btn btn-primary site-login">
            {t('login.submit')}
          </Link>
          <button type="button" className="icon-btn site-burger" onClick={() => setMenu(true)} aria-label={t('more')}>
            <Icon name="menu" />
          </button>
        </div>
      </header>

      <section className="site-hero">
        <p className="site-kicker">{t('landing.kicker')}</p>
        <h1>{t('landing.h1')}</h1>
        <p className="site-lead">{t('landing.lead')}</p>
        <div className="site-hero-actions">
          <Link to="/prihlasenie" className="btn btn-primary site-cta">
            {t('landing.cta')}
          </Link>
          <a href="#produkty" className="btn btn-ghost site-ghost">
            {t('nav.products')}
          </a>
        </div>
      </section>

      <section id="produkty" className="site-section">
        <h2>{t('landing.products')}</h2>
        <div className="site-cards">
          {products.map((p) => (
            <article key={p.title} className="site-card">
              <span className="quick-ico"><Icon name={p.icon} size={18} /></span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pobocky" className="site-section">
        <h2>{t('landing.branchT')}</h2>
        <p className="site-note">{t('landing.branchD')}</p>
      </section>

      <section id="pomoc" className="site-section">
        <h2>{t('landing.helpT')}</h2>
        <p className="site-note">{t('landing.helpD')}</p>
      </section>

      <footer className="site-foot">
        {t('landing.foot')}
      </footer>

      {menu && (
        <div className="more-sheet site-sheet" onClick={() => setMenu(false)}>
          <div className="more-panel" onClick={(e) => e.stopPropagation()}>
            <div className="more-handle" />
            <h3>{t('more')}</h3>
            <a className="more-link" href="#produkty" onClick={() => setMenu(false)}>
              <Icon name="wallet" /> {t('nav.products')}
            </a>
            <a className="more-link" href="#pobocky" onClick={() => setMenu(false)}>
              <Icon name="home" /> {t('nav.branches')}
            </a>
            <a className="more-link" href="#pomoc" onClick={() => setMenu(false)}>
              <Icon name="inbox" /> {t('nav.help')}
            </a>
            <button type="button" className="more-link" onClick={() => { toggleTheme(); setMenu(false) }}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} /> {t('settings.theme')}
            </button>
            <Link className="btn btn-primary" to="/prihlasenie" style={{ marginTop: 12 }} onClick={() => setMenu(false)}>
              {t('login.submit')}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
