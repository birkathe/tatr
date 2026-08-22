import { FX } from '../data/seed'
import { useBank } from '../store/BankContext'
import { formatIban } from '../lib/format'
import { useI18n } from '../i18n/I18nContext'

export function RatesPage() {
  const { t } = useI18n()
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{t('nav.rates')}</h1>
          <p>Tatra banka · {new Date().toLocaleDateString('sk-SK')}</p>
        </div>
      </div>
      <div className="card">
        <table className="data">
          <thead>
            <tr><th>Mena</th><th className="right">Nákup</th><th className="right">Predaj</th></tr>
          </thead>
          <tbody>
            {FX.map((f) => (
              <tr key={f.pair}>
                <td>{f.flag} {f.pair}</td>
                <td className="right mono">{f.buy}</td>
                <td className="right mono">{f.sell}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const BRANCHES = [
  { name: 'Košice – Hlavná', addr: 'Hlavná 8, 040 01 Košice', hours: 'Po–Pi 8:00–17:00', type: 'Pobočka' },
  { name: 'Košice – Aupark', addr: 'Námestie osloboditeľov 1, OC Aupark', hours: 'Po–Ne 9:00–21:00', type: 'Pobočka' },
  { name: 'Košice – Optima', addr: 'Moldavská cesta 32, OC Optima', hours: 'Po–Ne 9:00–21:00', type: 'Pobočka' },
  { name: 'Bankomat Hlavná', addr: 'Hlavná 8, Košice', hours: '0–24', type: 'Bankomat' },
  { name: 'Bankomat Toryská Tesco', addr: 'Toryská 3, Košice', hours: '0–24', type: 'Bankomat' },
  { name: 'Bankomat Aupark', addr: 'OC Aupark, Košice', hours: '0–24', type: 'Bankomat' },
]

export function BranchesPage() {
  const { t } = useI18n()
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{t('nav.branches')}</h1>
          <p>Košice</p>
        </div>
      </div>
      <div className="grid grid-eq">
        {BRANCHES.map((b) => (
          <div key={b.name} className="card card-pad">
            <span className="pill ok">{b.type}</span>
            <h3 style={{ margin: '10px 0 6px', fontSize: 16 }}>{b.name}</h3>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14 }}>{b.addr}</p>
            <p style={{ margin: '8px 0 0', fontSize: 13 }}>{b.hours}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProductsPage() {
  const { t } = useI18n()
  const items = [
    { t: 'Tatra Personal', d: 'Bežný účet pre každodenné platby, karty a internet banking.' },
    { t: 'Digitálny termínovaný vklad', d: 'Fixná sadzba, zriadenie online bez návštevy pobočky.' },
    { t: 'TatraCard Visa Classic', d: 'Debetná karta k účtu, platby v SR aj v zahraničí.' },
    { t: 'Hypotéka TB', d: 'Bývanie s možnosťou refinancovania. Žiadosť na pobočke alebo v appke.' },
    { t: 'Spotrebný úver', d: 'Neúčelový úver s predschválenou ponukou v mobilnej aplikácii.' },
    { t: 'DDS / podielové fondy', d: 'Dôchodok a investície cez Tatra Asset Management.' },
  ]
  return (
    <div>
      <div className="page-head"><div><h1>{t('nav.products')}</h1></div></div>
      <div className="grid grid-eq">
        {items.map((p) => (
          <div key={p.t} className="card card-pad">
            <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>{p.t}</h3>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14 }}>{p.d}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LoansPage() {
  const { t } = useI18n()
  return (
    <div>
      <div className="page-head"><div><h1>{t('nav.loans')}</h1><p>Prehľad úverových produktov</p></div></div>
      <div className="card card-pad">
        <h3 style={{ marginTop: 0 }}>Aktívne úvery</h3>
        <p style={{ color: 'var(--muted)' }}>Momentálne nemáte splácaný úver v Tatra banke.</p>
        <div className="grid grid-eq" style={{ marginTop: 16 }}>
          <div className="card card-pad">
            <b>Hypotéka</b>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>Od 3,49 % p.a. podľa LTV a fixácie.</p>
          </div>
          <div className="card card-pad">
            <b>Spotrebný úver</b>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>Predschválená suma sa zobrazí v aplikácii.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SecurityPage() {
  const { t } = useI18n()
  const bank = useBank()
  return (
    <div>
      <div className="page-head"><div><h1>{t('nav.security')}</h1></div></div>
      <div className="card card-pad">
        <div className="detail-grid">
          <div><div className="k">PID</div><div className="v">{bank.user.pid}</div></div>
          <div><div className="k">Čítačka TB</div><div className="v">aktívna</div></div>
          <div><div className="k">Okamžité platby</div><div className="v">{bank.settings.instantPayments ? 'zapnuté' : 'vypnuté'}</div></div>
          <div><div className="k">Posledné prihlásenie</div><div className="v">{localStorage.getItem('tb-ib-last-login') ? new Date(localStorage.getItem('tb-ib-last-login')).toLocaleString('sk-SK') : '—'}</div></div>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 18 }}>
          Banka vás nikdy nežiada o PID, heslo ani kód e-mailom. Prihlasujte sa len cez overenú adresu.
        </p>
      </div>
    </div>
  )
}

export function HelpPage() {
  const { t } = useI18n()
  const qa = [
    ['Ako zadám platbu?', 'Platby → Nová platba. Vyplňte IBAN, sumu a potvrďte.'],
    ['Kde nájdem výpis?', 'Dokumenty → Mesačný výpis z účtu.'],
    ['Ako zmením limity karty?', 'Karty → Upraviť limity.'],
    ['Kontakt', 'DIALOG Live *1100, denne 8:00–20:00. Pobočka Košice – Hlavná.'],
  ]
  return (
    <div>
      <div className="page-head"><div><h1>{t('nav.help')}</h1></div></div>
      <div className="card">
        {qa.map(([q, a]) => (
          <div key={q} className="card-pad" style={{ borderBottom: '1px solid var(--line-2)' }}>
            <b>{q}</b>
            <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: 14 }}>{a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AccountExtras() {
  const bank = useBank()
  const { money, date } = useI18n()
  const acc = bank.accounts[0]
  if (!acc) return null
  const out = bank.transactions.filter((x) => x.amount < 0).slice(0, 3)
  return (
    <div className="grid grid-eq" style={{ marginBottom: 16 }}>
      <div className="card card-pad">
        <div className="k">Majiteľ</div>
        <div className="v" style={{ marginTop: 6 }}>{bank.user.fullName}</div>
        <div className="k" style={{ marginTop: 12 }}>Pobočka</div>
        <div className="v" style={{ marginTop: 6 }}>{bank.user.branch}</div>
      </div>
      <div className="card card-pad">
        <div className="k">Posledné odchody</div>
        {out.map((x) => (
          <div key={x.id} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 13 }}>
            <span>{x.name}</span>
            <span className="mono">{money(x.amount)}</span>
          </div>
        ))}
      </div>
      <div className="card card-pad">
        <div className="k">IBAN / BIC</div>
        <div className="v mono" style={{ marginTop: 8 }}>{formatIban(acc.iban)}</div>
        <div className="v" style={{ marginTop: 6 }}>{acc.bic}</div>
        <div className="k" style={{ marginTop: 12 }}>Otvorený</div>
        <div className="v">{date(acc.opened)}</div>
      </div>
    </div>
  )
}
