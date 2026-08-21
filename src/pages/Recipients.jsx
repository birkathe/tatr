import { useState } from 'react'
import { useBank } from '../store/BankContext'
import { formatIban } from '../lib/format'
import { useI18n } from '../i18n/I18nContext'

export default function Recipients() {
  const bank = useBank()
  const { t } = useI18n()
  const [form, setForm] = useState({ name: '', iban: '', bankName: '', vs: '', note: '' })
  const [open, setOpen] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (!form.name || form.iban.replace(/\s/g, '').length < 15) return
    bank.addRecipient({ name: form.name, iban: form.iban.toUpperCase(), bank: form.bankName || 'SEPA', vs: form.vs, note: form.note })
    setForm({ name: '', iban: '', bankName: '', vs: '', note: '' })
    setOpen(false)
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{t('recipients.title')}</h1>
          <p>{t('recipients.sub')}</p>
        </div>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setOpen((v) => !v)}>
          + Nový príjemca
        </button>
      </div>

      {open && (
        <form className="card card-pad" style={{ marginBottom: 16, maxWidth: 560 }} onSubmit={submit}>
          <div className="field"><label>Meno</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="field"><label>IBAN</label><input className="mono" value={form.iban} onChange={(e) => setForm({ ...form, iban: e.target.value.toUpperCase() })} /></div>
          <div className="row-2">
            <div className="field"><label>Banka</label><input value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} /></div>
            <div className="field"><label>Predvolený VS</label><input value={form.vs} onChange={(e) => setForm({ ...form, vs: e.target.value })} /></div>
          </div>
          <div className="field"><label>Poznámka</label><input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></div>
          <button className="btn btn-primary" type="submit">Uložiť príjemcu</button>
        </form>
      )}

      <div className="card">
        <table className="data">
          <thead>
            <tr><th>Meno</th><th>IBAN</th><th>Banka</th><th>Poznámka</th><th></th></tr>
          </thead>
          <tbody>
            {bank.recipients.map((r) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600 }}>{r.name}</td>
                <td className="mono">{formatIban(r.iban)}</td>
                <td>{r.bank}</td>
                <td>{r.note}</td>
                <td className="right">
                  <button className="btn btn-sm btn-danger" onClick={() => bank.removeRecipient(r.id)}>Odstrániť</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
