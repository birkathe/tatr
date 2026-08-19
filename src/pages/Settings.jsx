import { useBank } from '../store/BankContext'

export default function Settings() {
  const bank = useBank()
  const n = bank.settings.notifications

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Nastavenia</h1>
          <p>Profil klienta, notifikácie a bezpečnosť</p>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card card-pad">
          <h3 style={{ margin: '0 0 14px', fontSize: 15 }}>Profil</h3>
          <div className="detail-grid">
            <div><div className="k">Meno</div><div className="v">{bank.user.fullName}</div></div>
            <div><div className="k">PID</div><div className="v">{bank.user.pid}</div></div>
            <div><div className="k">E-mail</div><div className="v">{bank.user.email}</div></div>
            <div><div className="k">Telefón</div><div className="v">{bank.user.phone}</div></div>
            <div><div className="k">Adresa</div><div className="v">{bank.user.address}</div></div>
            <div><div className="k">Pobočka</div><div className="v">{bank.user.branch}</div></div>
            <div><div className="k">Klient od</div><div className="v">{new Date(bank.user.clientFrom).toLocaleDateString('sk-SK')}</div></div>
          </div>
        </div>

        <div className="card card-pad">
          <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>Zobrazenie a notifikácie</h3>
          <label className="switch">
            <div>
              <div className="t">Skryť zostatky</div>
              <div className="d">Na prehľade sa namiesto súm zobrazia bodky</div>
            </div>
            <input
              type="checkbox"
              checked={bank.settings.hideBalances}
              onChange={(e) => bank.updateSettings({ hideBalances: e.target.checked })}
            />
          </label>
          <label className="switch">
            <div>
              <div className="t">Okamžité platby</div>
              <div className="d">Povoliť odosielanie okamžitých platieb 24/7</div>
            </div>
            <input
              type="checkbox"
              checked={bank.settings.instantPayments}
              onChange={(e) => bank.updateSettings({ instantPayments: e.target.checked })}
            />
          </label>
          {Object.entries({ incoming: 'Prichádzajúce platby', outgoing: 'Odchádzajúce platby', card: 'Pohyby kartou', marketing: 'Obchodné ponuky' }).map(([k, label]) => (
            <label className="switch" key={k}>
              <div><div className="t">{label}</div></div>
              <input
                type="checkbox"
                checked={n[k]}
                onChange={(e) =>
                  bank.updateSettings({ notifications: { ...n, [k]: e.target.checked } })
                }
              />
            </label>
          ))}
        </div>
      </div>

      <div className="card card-pad" style={{ marginTop: 16 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>Demo</h3>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 0 }}>
          Všetky údaje sú fiktívne a uložené len v tomto prehliadači (localStorage). Obnovením sa vrátite k predvolenému stavu.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" style={{ width: 'auto' }} onClick={bank.resetDemo}>Obnoviť demo dáta</button>
          <button className="btn btn-danger" style={{ width: 'auto' }} onClick={bank.logout}>Odhlásiť sa</button>
        </div>
      </div>
    </div>
  )
}
