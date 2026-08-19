import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createSeed, DEPOSIT_OFFERS } from '../data/seed'
import { addMonths, uid } from '../lib/format'

const STORAGE_KEY = 'tb-ib-demo-v1'
const SESSION_KEY = 'tb-ib-session'

const BankContext = createContext(null)

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createSeed()
    const parsed = JSON.parse(raw)
    if (!parsed?.version || !parsed.user) return createSeed()
    return parsed
  } catch {
    return createSeed()
  }
}

export function BankProvider({ children }) {
  const [state, setState] = useState(loadState)
  const [session, setSession] = useState(() => localStorage.getItem(SESSION_KEY) === '1')
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  function toast(text, tone = 'ok') {
    const id = uid('toast')
    setToasts((t) => [...t, { id, text, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800)
  }

  function login() {
    localStorage.setItem(SESSION_KEY, '1')
    setSession(true)
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    setSession(false)
  }

  function resetDemo() {
    const fresh = createSeed()
    setState(fresh)
    toast('Demo údaje boli obnovené')
  }

  function getAccount(id) {
    return state.accounts.find((a) => a.id === id)
  }

  function patchAccount(id, updater) {
    setState((s) => ({
      ...s,
      accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...updater(a) } : a)),
    }))
  }

  function addTransaction(tx) {
    setState((s) => ({
      ...s,
      transactions: [{ ...tx, id: tx.id || uid('tx') }, ...s.transactions],
    }))
  }

  function sendPayment({ fromId, toName, toIban, amount, vs, ks, ss, note, instant }) {
    const amt = Number(amount)
    const from = getAccount(fromId)
    if (!from || amt <= 0) return { ok: false, error: 'Neplatná suma' }
    if (from.available < amt) return { ok: false, error: 'Nedostatok prostriedkov na účte' }

    const date = new Date().toISOString()
    const newBal = Math.round((from.balance - amt) * 100) / 100
    patchAccount(fromId, () => ({ balance: newBal, available: newBal }))
    addTransaction({
      accountId: fromId,
      date,
      name: toName,
      category: 'transfer',
      amount: -amt,
      currency: 'EUR',
      type: instant ? 'okamžitá' : 'sepa',
      vs: vs || '',
      ks: ks || '0308',
      ss: ss || '',
      note: note || '',
      iban: toIban,
      status: 'zaúčtovaná',
      balanceAfter: newBal,
    })
    toast(instant ? 'Okamžitá platba bola odoslaná' : 'Platobný príkaz bol odoslaný')
    return { ok: true }
  }

  function createDeposit({ fromId, amount, months, autoRenew }) {
    const offer = DEPOSIT_OFFERS.find((o) => o.months === Number(months))
    const amt = Number(amount)
    const from = getAccount(fromId)
    if (!from || !offer) return { ok: false, error: 'Neplatné parametre' }
    if (amt < 100) return { ok: false, error: 'Minimálna suma vkladu je 100 €' }
    if (from.available < amt) return { ok: false, error: 'Nedostatok prostriedkov na účte' }

    const start = new Date().toISOString()
    const end = addMonths(start, offer.months)
    const interestExpected = Math.round(amt * (offer.rate / 100) * (offer.months / 12) * 100) / 100
    const newBal = Math.round((from.balance - amt) * 100) / 100

    patchAccount(fromId, () => ({ balance: newBal, available: newBal }))
    addTransaction({
      accountId: fromId,
      date: start,
      name: `Digitálny termínovaný vklad ${offer.label}`,
      category: 'vklad',
      amount: -amt,
      currency: 'EUR',
      type: 'vklad',
      note: `${offer.rate} % p.a., viazanosť ${offer.label}`,
      status: 'zaúčtovaná',
      balanceAfter: newBal,
    })

    const deposit = {
      id: uid('dep'),
      name: 'Digitálny termínovaný vklad',
      accountFrom: fromId,
      amount: amt,
      rate: offer.rate,
      months: offer.months,
      start,
      end,
      interestExpected,
      autoRenew: Boolean(autoRenew),
      status: 'aktívny',
    }

    setState((s) => ({
      ...s,
      deposits: [deposit, ...s.deposits],
      messages: [
        {
          id: uid('msg'),
          date: start,
          title: 'Nový termínovaný vklad',
          body: `Zriadili sme Digitálny termínovaný vklad ${formatPlain(amt)} na ${offer.label} so sadzbou ${offer.rate} % p.a.`,
          read: false,
          type: 'produkt',
        },
        ...s.messages,
      ],
    }))
    toast('Termínovaný vklad bol zriadený')
    return { ok: true, deposit }
  }

  function closeDeposit(id, early = true) {
    const dep = state.deposits.find((d) => d.id === id)
    if (!dep || dep.status !== 'aktívny') return { ok: false }
    const from = getAccount(dep.accountFrom)
    if (!from) return { ok: false }

    const matured = new Date(dep.end) <= new Date()
    const interest = matured ? dep.interestExpected : early ? Math.round(dep.interestExpected * 0.3 * 100) / 100 : 0
    const payout = Math.round((dep.amount + interest) * 100) / 100
    const newBal = Math.round((from.balance + payout) * 100) / 100
    const date = new Date().toISOString()

    patchAccount(from.id, () => ({ balance: newBal, available: newBal }))
    addTransaction({
      accountId: from.id,
      date,
      name: matured ? 'Splatnosť termínovaného vkladu' : 'Predčasné ukončenie vkladu',
      category: 'vklad',
      amount: payout,
      currency: 'EUR',
      type: 'vklad',
      note: `Istina ${formatPlain(dep.amount)} + úrok ${formatPlain(interest)}`,
      status: 'zaúčtovaná',
      balanceAfter: newBal,
    })
    setState((s) => ({
      ...s,
      deposits: s.deposits.map((d) =>
        d.id === id ? { ...d, status: matured ? 'splatený' : 'ukončený', closedAt: date, paidInterest: interest } : d
      ),
    }))
    toast(matured ? 'Vklad bol splatený na účet' : 'Vklad bol predčasne ukončený')
    return { ok: true }
  }

  function transferBetween({ fromId, toId, amount, note }) {
    const amt = Number(amount)
    const from = getAccount(fromId)
    const to = getAccount(toId)
    if (!from || !to || fromId === toId) return { ok: false, error: 'Vyberte dva rôzne účty' }
    if (amt <= 0) return { ok: false, error: 'Neplatná suma' }
    if (from.available < amt) return { ok: false, error: 'Nedostatok prostriedkov' }
    const date = new Date().toISOString()
    const fromBal = Math.round((from.balance - amt) * 100) / 100
    const toBal = Math.round((to.balance + amt) * 100) / 100
    setState((s) => ({
      ...s,
      accounts: s.accounts.map((a) => {
        if (a.id === fromId) return { ...a, balance: fromBal, available: fromBal }
        if (a.id === toId) return { ...a, balance: toBal, available: toBal }
        return a
      }),
      transactions: [
        {
          id: uid('tx'),
          accountId: fromId,
          date,
          name: to.name,
          category: 'transfer',
          amount: -amt,
          currency: 'EUR',
          type: 'interná',
          note: note || 'Prevod medzi vlastnými účtami',
          status: 'zaúčtovaná',
          balanceAfter: fromBal,
        },
        {
          id: uid('tx'),
          accountId: toId,
          date,
          name: from.name,
          category: 'prijem',
          amount: amt,
          currency: 'EUR',
          type: 'interná',
          note: note || 'Prevod medzi vlastnými účtami',
          status: 'zaúčtovaná',
          balanceAfter: toBal,
        },
        ...s.transactions,
      ],
    }))
    toast('Prevod medzi účtami prebehol')
    return { ok: true }
  }

  function updateCard(id, patch) {
    setState((s) => ({
      ...s,
      cards: s.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }))
  }

  function addRecipient(rcp) {
    const item = { id: uid('rcp'), ...rcp }
    setState((s) => ({ ...s, recipients: [item, ...s.recipients] }))
    toast('Príjemca bol uložený')
    return item
  }

  function removeRecipient(id) {
    setState((s) => ({ ...s, recipients: s.recipients.filter((r) => r.id !== id) }))
    toast('Príjemca bol odstránený')
  }

  function markMessage(id) {
    setState((s) => ({
      ...s,
      messages: s.messages.map((m) => (m.id === id ? { ...m, read: true } : m)),
    }))
  }

  function updateSettings(patch) {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }))
  }

  const value = useMemo(
    () => ({
      ...state,
      session,
      toasts,
      login,
      logout,
      resetDemo,
      toast,
      getAccount,
      sendPayment,
      createDeposit,
      closeDeposit,
      transferBetween,
      updateCard,
      addRecipient,
      removeRecipient,
      markMessage,
      updateSettings,
    }),
    [state, session, toasts]
  )

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>
}

function formatPlain(n) {
  return new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' }).format(n)
}

export function useBank() {
  const ctx = useContext(BankContext)
  if (!ctx) throw new Error('useBank must be used within BankProvider')
  return ctx
}
