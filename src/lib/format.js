export const EUR = new Intl.NumberFormat('sk-SK', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
})

export function formatMoney(value, currency = 'EUR') {
  const n = Number(value) || 0
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(n)
}

export function formatNumber(value, digits = 2) {
  return new Intl.NumberFormat('sk-SK', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(value) || 0)
}

export function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('sk-SK', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('sk-SK', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatIban(iban) {
  if (!iban) return ''
  return iban.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
}

export function monthLabel(isoOrKey) {
  const d = isoOrKey.length === 7 ? new Date(`${isoOrKey}-01`) : new Date(isoOrKey)
  return d.toLocaleDateString('sk-SK', { month: 'long', year: 'numeric' })
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function addMonths(isoDate, months) {
  const d = new Date(isoDate)
  d.setMonth(d.getMonth() + months)
  return d.toISOString()
}

export function daysBetween(a, b) {
  const ms = new Date(b) - new Date(a)
  return Math.round(ms / 86400000)
}

export function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Dobré ráno'
  if (h < 18) return 'Dobrý deň'
  return 'Dobrý večer'
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`
}
