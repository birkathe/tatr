import { useState } from 'react'
import { useBank } from '../store/BankContext'
import { formatIban } from '../lib/format'
import { useI18n } from '../i18n/I18nContext'

function TatraMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="542 543 1168 926" fill="currentColor" aria-hidden>
      <path d="M542.9,1468.9h1167v-925h-191v19h172v887H562.9l-1-887h630v-19h-649v925Z" />
      <polygon points="958.15 799.9 668.9 1343.9 813.9 1343.9 1103.15 799.9 958.15 799.9" />
      <polygon points="1299.27 543.9 873.9 1343.9 1018.9 1343.9 1444.27 543.9 1299.27 543.9" />
      <polygon points="1435.15 673.9 1078.9 1343.9 1223.9 1343.9 1580.15 673.9 1435.15 673.9" />
    </svg>
  )
}

function PayCard({ card }) {
  const { t } = useI18n()
  return (
    <div className="paycard classic">
      <div className="paycard-top">
        <span className="paycard-logo"><TatraMark /> Tatra banka</span>
        <span className="paycard-contactless">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M8.5 8.5c2 2 2 5 0 7" />
            <path d="M12 6c3.2 3 3.2 9 0 12" />
            <path d="M15.5 3.8c4.2 4 4.2 12.4 0 16.4" />
          </svg>
        </span>
      </div>
      <div className="paycard-chip" />
      <div className="pan">{card.panMasked}</div>
      <div className="bot">
        <div>
          <div className="paycard-label">{t('cards.holder')}</div>
          <div>{card.holder}</div>
        </div>
        <div>
          <div className="paycard-label">{t('cards.exp')}</div>
          <div>{card.expiry}</div>
        </div>
        <div className="paycard-visa">VISA</div>
      </div>
    </div>
  )
}

export default function Cards() {
  const bank = useBank()
  const { t, money } = useI18n()
  const [pinFor, setPinFor] = useState(null)
  const [edit, setEdit] = useState(null)
  const card = bank.cards[0]
  if (!card) return <div className="empty">Žiadna karta.</div>
  const acc = bank.getAccount(card.accountId)

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{t('cards.title')}</h1>
          <p>{t('cards.sub')}</p>
        </div>
      </div>
      <div className="card-page">
        <div className="card card-pad card-spotlight">
          <PayCard card={card} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 10px' }}>
            <div>
              <div style={{ fontWeight: 650, fontSize: 16 }}>{card.product}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                {acc?.name} · {acc ? formatIban(acc.iban) : ''}
              </div>
            </div>
            <span className={`pill ${card.status === 'aktívna' ? 'ok' : 'off'}`}>{card.status}</span>
          </div>
          <div className="detail-grid" style={{ margin: '12px 0' }}>
            <div><div className="k">ATM / deň</div><div className="v">{money(card.limits.atm)}</div></div>
            <div><div className="k">POS / deň</div><div className="v">{money(card.limits.pos)}</div></div>
            <div><div className="k">Internet / deň</div><div className="v">{money(card.limits.online)}</div></div>
            <div><div className="k">Bezkontaktne bez PIN</div><div className="v">{money(card.limits.contactless)}</div></div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              className={`btn btn-sm ${card.status === 'aktívna' ? 'btn-danger' : 'btn-soft'}`}
              onClick={() => bank.updateCard(card.id, { status: card.status === 'aktívna' ? 'blokovaná' : 'aktívna' })}
            >
              {card.status === 'aktívna' ? 'Blokovať kartu' : 'Odblokovať'}
            </button>
            <button className="btn btn-sm btn-ghost" onClick={() => setPinFor(pinFor === card.id ? null : card.id)}>
              Zobraziť PIN
            </button>
            <button className="btn btn-sm btn-ghost" onClick={() => setEdit(edit === card.id ? null : card.id)}>
              Upraviť limity
            </button>
          </div>
          {pinFor === card.id && (
            <div className="pin-reveal">
              PIN karty: <b className="mono" style={{ letterSpacing: '.2em' }}>{card.pin}</b>
            </div>
          )}
          {edit === card.id && (
            <LimitEditor card={card} onSave={(limits) => { bank.updateCard(card.id, { limits }); setEdit(null); bank.toast('Limity boli uložené') }} />
          )}
        </div>
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
