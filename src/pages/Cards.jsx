import { useState } from 'react'
import { useBank } from '../store/BankContext'
import { formatMoney } from '../lib/format'

export default function Cards() {
  const bank = useBank()
  const [pinFor, setPinFor] = useState(null)
  const [edit, setEdit] = useState(null)

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Karty</h1>
          <p>Správa debetných a kreditných kariet, limity a PIN</p>
        </div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {bank.cards.map((c) => {
          const acc = bank.getAccount(c.accountId)
          return (
            <div key={c.id} className="card card-pad">
              <div className={`paycard ${c.variant}`} style={{ marginBottom: 16 }}>
                <div className="brand">{c.brand.toUpperCase()}</div>
                <div>
                  <div className="pan">{c.panMasked}</div>
                  <div className="bot">
                    <span>{c.holder}</span>
                    <span>EXP {c.expiry}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{c.product}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{acc?.name}</div>
                </div>
                <span className={`pill ${c.status === 'aktívna' ? 'ok' : 'off'}`}>{c.status}</span>
              </div>
              <div className="detail-grid" style={{ margin: '12px 0' }}>
                <div><div className="k">ATM / deň</div><div className="v">{formatMoney(c.limits.atm)}</div></div>
                <div><div className="k">POS / deň</div><div className="v">{formatMoney(c.limits.pos)}</div></div>
                <div><div className="k">Internet / deň</div><div className="v">{formatMoney(c.limits.online)}</div></div>
                <div><div className="k">Bezkontaktne bez PIN</div><div className="v">{formatMoney(c.limits.contactless)}</div></div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  className={`btn btn-sm ${c.status === 'aktívna' ? 'btn-danger' : 'btn-soft'}`}
                  onClick={() => bank.updateCard(c.id, { status: c.status === 'aktívna' ? 'blokovaná' : 'aktívna' })}
                >
                  {c.status === 'aktívna' ? 'Blokovať kartu' : 'Odblokovať'}
                </button>
                <button className="btn btn-sm btn-ghost" onClick={() => setPinFor(pinFor === c.id ? null : c.id)}>
                  Zobraziť PIN
                </button>
                <button className="btn btn-sm btn-ghost" onClick={() => setEdit(edit === c.id ? null : c.id)}>
                  Upraviť limity
                </button>
              </div>
              {pinFor === c.id && (
                <div style={{ marginTop: 12, background: '#f6f7f9', borderRadius: 10, padding: 12, fontSize: 14 }}>
                  PIN karty: <b className="mono" style={{ letterSpacing: '.2em' }}>{c.pin}</b>
                </div>
              )}
              {edit === c.id && (
                <LimitEditor card={c} onSave={(limits) => { bank.updateCard(c.id, { limits }); setEdit(null); bank.toast('Limity boli uložené') }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function LimitEditor({ card, onSave }) {
  const [limits, setLimits] = useState(card.limits)
  return (
    <div style={{ marginTop: 14 }}>
      {['atm', 'pos', 'online', 'contactless'].map((k) => (
        <div className="field" key={k}>
          <label>{k === 'atm' ? 'Bankomat' : k === 'pos' ? 'Platby u obchodníka' : k === 'online' ? 'Internet' : 'Bezkontaktne bez PIN'}</label>
          <input type="number" value={limits[k]} onChange={(e) => setLimits({ ...limits, [k]: Number(e.target.value) })} />
        </div>
      ))}
      <button className="btn btn-primary" type="button" onClick={() => onSave(limits)}>Uložiť limity</button>
    </div>
  )
}
