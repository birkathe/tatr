import { useBank } from '../store/BankContext'
import { formatDateTime } from '../lib/format'
import { useI18n } from '../i18n/I18nContext'

export default function Messages() {
  const bank = useBank()
  const { t } = useI18n()
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{t('messages.title')}</h1>
          <p>{t('messages.sub')}</p>
        </div>
      </div>
      <div className="card">
        {bank.messages.map((m) => (
          <button
            key={m.id}
            className="tx-row"
            style={{ width: '100%', border: 0, background: m.read ? 'none' : '#f3f8ff', borderRadius: 0 }}
            onClick={() => bank.markMessage(m.id)}
          >
            <div className={`tx-ico ${m.read ? '' : 'in'}`}>{m.type.slice(0, 2).toUpperCase()}</div>
            <div style={{ textAlign: 'left' }}>
              <div className="tx-name">{m.title}</div>
              <div className="tx-meta">{formatDateTime(m.date)} · {m.body}</div>
            </div>
            {!m.read && <span className="pill ok">nová</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
