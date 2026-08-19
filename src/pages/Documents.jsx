import { useBank } from '../store/BankContext'
import { formatIban, formatMoney } from '../lib/format'

export default function Documents() {
  const bank = useBank()
  const acc = bank.accounts[0]

  function download(st) {
    const txs = bank.transactions.filter((t) => t.accountId === st.accountId && t.date.slice(0, 10) >= st.from && t.date.slice(0, 10) <= st.to)
    const income = txs.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
    const expense = txs.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0)
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Výpis ${st.period}</title>
      <style>body{font-family:Inter,Arial;padding:32px;color:#111}h1{margin:0}table{width:100%;border-collapse:collapse;margin-top:20px;font-size:13px}
      td,th{border-bottom:1px solid #eee;padding:8px;text-align:left}.r{text-align:right}</style></head><body>
      <h1>Tatra banka — výpis z účtu</h1>
      <p>DEMO dokument · ${acc.name} · ${formatIban(acc.iban)}<br>${st.period} (${st.from} – ${st.to})</p>
      <p>Obrat kredit ${formatMoney(income)} · obrat debet ${formatMoney(expense)}</p>
      <table><tr><th>Dátum</th><th>Popis</th><th class="r">Suma</th></tr>
      ${txs.map((t) => `<tr><td>${t.date.slice(0, 10)}</td><td>${t.name}</td><td class="r">${formatMoney(t.amount)}</td></tr>`).join('')}
      </table></body></html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vypis-${st.id}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Dokumenty</h1>
          <p>Mesačné výpisy a zmluvná dokumentácia</p>
        </div>
      </div>
      <div className="card">
        <table className="data">
          <thead>
            <tr><th>Dokument</th><th>Účet</th><th>Obdobie</th><th></th></tr>
          </thead>
          <tbody>
            {bank.statements.map((st) => (
              <tr key={st.id}>
                <td>Mesačný výpis z účtu</td>
                <td>{acc.name}</td>
                <td>{st.period}</td>
                <td className="right">
                  <button className="btn btn-sm btn-soft" onClick={() => download(st)}>Stiahnuť</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
