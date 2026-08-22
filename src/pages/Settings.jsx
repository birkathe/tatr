import { useBank } from '../store/BankContext'
import { LangSwitch, useI18n } from '../i18n/I18nContext'
import { useTheme } from '../theme/ThemeContext'

export default function Settings() {
  const bank = useBank()
  const { t, date, langs, lang, setLang } = useI18n()
  const { theme, setTheme } = useTheme()
  const n = bank.settings.notifications

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{t('settings.title')}</h1>
          <p>{t('settings.sub')}</p>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card card-pad">
          <h3 style={{ margin: '0 0 14px', fontSize: 15 }}>{t('settings.profile')}</h3>
          <div className="detail-grid">
            <div><div className="k">{t('settings.name')}</div><div className="v">{bank.user.fullName}</div></div>
            <div><div className="k">PID</div><div className="v">{bank.user.pid}</div></div>
            <div><div className="k">E-mail</div><div className="v">{bank.user.email}</div></div>
            <div><div className="k">Tel.</div><div className="v">{bank.user.phone}</div></div>
            <div><div className="k">{t('settings.address')}</div><div className="v">{bank.user.address}</div></div>
            <div><div className="k">{t('settings.branch')}</div><div className="v">{bank.user.branch}</div></div>
            <div><div className="k">{t('settings.since')}</div><div className="v">{date(bank.user.clientFrom)}</div></div>
          </div>
        </div>

        <div className="card card-pad">
          <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>{t('settings.display')}</h3>
          <div className="switch">
            <div>
              <div className="t">{t('settings.theme')}</div>
              <div className="d">{t('settings.themeD')}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '0 0 12px' }}>
            <button type="button" className={`chip ${theme === 'dark' ? 'on' : ''}`} onClick={() => setTheme('dark')}>
              {t('settings.themeDark')}
            </button>
            <button type="button" className={`chip ${theme === 'light' ? 'on' : ''}`} onClick={() => setTheme('light')}>
              {t('settings.themeLight')}
            </button>
          </div>
          <div className="switch">
            <div>
              <div className="t">{t('settings.lang')}</div>
            </div>
            <LangSwitch />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '8px 0 12px' }}>
            {langs.map((l) => (
              <button key={l.id} type="button" className={`chip ${lang === l.id ? 'on' : ''}`} onClick={() => setLang(l.id)}>
                {l.name}
              </button>
            ))}
          </div>
          <label className="switch">
            <div>
              <div className="t">{t('settings.hide')}</div>
              <div className="d">{t('settings.hideD')}</div>
            </div>
            <input
              type="checkbox"
              checked={bank.settings.hideBalances}
              onChange={(e) => bank.updateSettings({ hideBalances: e.target.checked })}
            />
          </label>
          <label className="switch">
            <div>
              <div className="t">{t('settings.instant')}</div>
              <div className="d">{t('settings.instantD')}</div>
            </div>
            <input
              type="checkbox"
              checked={bank.settings.instantPayments}
              onChange={(e) => bank.updateSettings({ instantPayments: e.target.checked })}
            />
          </label>
          {['incoming', 'outgoing', 'card', 'marketing'].map((k) => (
            <label className="switch" key={k}>
              <div><div className="t">{t(`settings.${k}`)}</div></div>
              <input
                type="checkbox"
                checked={n[k]}
                onChange={(e) => bank.updateSettings({ notifications: { ...n, [k]: e.target.checked } })}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="card card-pad" style={{ marginTop: 16 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>{t('settings.demo')}</h3>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 0 }}>{t('settings.demoP')}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" style={{ width: 'auto' }} onClick={bank.resetDemo}>{t('settings.reset')}</button>
          <button className="btn btn-danger" style={{ width: 'auto' }} onClick={bank.logout}>{t('settings.logout')}</button>
        </div>
      </div>
    </div>
  )
}
