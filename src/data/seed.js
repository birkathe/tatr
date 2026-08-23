function at(day, hour = 10, minute = 0) {
  return new Date(`${day}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00+02:00`).toISOString()
}

export const CATEGORIES = {
  potraviny: { label: 'Potraviny', color: '#1d7a46' },
  doprava: { label: 'Doprava', color: '#0b6bcb' },
  byvanie: { label: 'Bývanie a energie', color: '#6b4f2a' },
  restauracie: { label: 'Reštaurácie a bary', color: '#c2410c' },
  nakupovanie: { label: 'Nakupovanie', color: '#7c3aed' },
  zabava: { label: 'Zábava a voľný čas', color: '#db2777' },
  zdravie: { label: 'Zdravie', color: '#0f766e' },
  telekom: { label: 'Telekomunikácie', color: '#2563eb' },
  poistne: { label: 'Poistenie a poplatky', color: '#475569' },
  transfer: { label: 'Prevody', color: '#334155' },
  vklad: { label: 'Termínované vklady', color: '#0f766e' },
  prijem: { label: 'Príjem', color: '#15803d' },
  ine: { label: 'Iné', color: '#64748b' },
}

export const DEPOSIT_OFFERS = [
  { months: 1, rate: 3.7, label: '1 mesiac' },
  { months: 3, rate: 4.1, label: '3 mesiace' },
  { months: 6, rate: 4.6, label: '6 mesiacov' },
  { months: 12, rate: 5.0, label: '12 mesiacov' },
  { months: 24, rate: 4.8, label: '24 mesiacov' },
  { months: 36, rate: 4.7, label: '36 mesiacov' },
]

export const FX = [
  { pair: 'EUR / CZK', buy: 24.21, sell: 25.08, flag: '🇨🇿' },
  { pair: 'EUR / USD', buy: 1.072, sell: 1.118, flag: '🇺🇸' },
  { pair: 'EUR / GBP', buy: 0.838, sell: 0.876, flag: '🇬🇧' },
  { pair: 'EUR / CHF', buy: 0.928, sell: 0.969, flag: '🇨🇭' },
  { pair: 'EUR / PLN', buy: 4.18, sell: 4.36, flag: '🇵🇱' },
  { pair: 'EUR / HUF', buy: 388.4, sell: 406.1, flag: '🇭🇺' },
]

const TX = [
  { day: '2026-06-17', h: 18, m: 41, name: 'Lidl Košice – Moldavská', cat: 'potraviny', amt: -32.18, type: 'karta', note: 'POS nákup' },
  { day: '2026-06-17', h: 7, m: 28, name: 'Slovnaft Košice Južná', cat: 'doprava', amt: -35.40, type: 'karta', note: 'PHM' },
  { day: '2026-06-16', h: 16, m: 40, name: 'Dr. Max OC Optima', cat: 'zdravie', amt: -12.90, type: 'karta' },
  { day: '2026-06-15', h: 11, m: 20, name: 'Kateryna Horbach', cat: 'transfer', amt: -200, type: 'sepa', vs: '20260615', note: 'Prevod', iban: 'SK42 0200 0000 0036 8841 2210' },
  { day: '2026-06-14', h: 13, m: 25, name: 'Kaufland Košice', cat: 'potraviny', amt: -54.62, type: 'karta' },
  { day: '2026-06-13', h: 9, m: 12, name: 'Lidl Košice – Moldavská', cat: 'potraviny', amt: -27.35, type: 'karta' },
  { day: '2026-06-12', h: 17, m: 48, name: 'Kaufland Košice', cat: 'potraviny', amt: -41.90, type: 'karta' },
  { day: '2026-06-11', h: 8, m: 5, name: 'Lidl Košice – Šaca', cat: 'potraviny', amt: -19.74, type: 'karta' },
  { day: '2026-06-10', h: 9, m: 0, name: 'PixelForge s.r.o.', cat: 'prijem', amt: 2140, type: 'mzda', note: 'Mzda za jún 2026' },
  { day: '2026-06-10', h: 10, m: 15, name: 'VSE Energia', cat: 'byvanie', amt: -84.3, type: 'inkaso', note: 'Záloha elektrina Košice' },
  { day: '2026-06-08', h: 15, m: 2, name: 'Decathlon Košice', cat: 'nakupovanie', amt: -54.99, type: 'karta' },
  { day: '2026-06-06', h: 12, m: 30, name: 'KFC Aupark Košice', cat: 'restauracie', amt: -12.7, type: 'karta' },
  { day: '2026-06-04', h: 8, m: 5, name: 'Tatra banka, a.s.', cat: 'poistne', amt: -4.9, type: 'poplatok', note: 'Mesačný poplatok za účet' },
  { day: '2026-06-02', h: 20, m: 21, name: 'Wolt Košice', cat: 'restauracie', amt: -19.6, type: 'karta' },
  { day: '2026-06-01', h: 11, m: 18, name: 'Kaufland Košice', cat: 'potraviny', amt: -73.11, type: 'karta' },
  { day: '2026-05-28', h: 16, m: 5, name: 'Datart OC Optima', cat: 'nakupovanie', amt: -129.0, type: 'karta' },
  { day: '2026-05-25', h: 13, m: 40, name: 'Shell Košice Jazerná', cat: 'doprava', amt: -48.2, type: 'karta' },
  { day: '2026-05-23', h: 9, m: 0, name: 'PixelForge s.r.o.', cat: 'prijem', amt: 2140, type: 'mzda', note: 'Mzda za máj 2026' },
  { day: '2026-05-21', h: 10, m: 22, name: 'dm drogerie OC Optima', cat: 'nakupovanie', amt: -23.48, type: 'karta' },
  { day: '2026-05-19', h: 19, m: 15, name: 'Netflix International', cat: 'zabava', amt: -13.99, type: 'inkaso' },
  { day: '2026-05-16', h: 17, m: 48, name: 'Tesco Extra Toryská', cat: 'potraviny', amt: -55.2, type: 'karta' },
  { day: '2026-05-13', h: 12, m: 5, name: 'Villa Regia Košice', cat: 'restauracie', amt: -42.3, type: 'karta' },
  { day: '2026-05-10', h: 8, m: 20, name: 'VSE Energia', cat: 'byvanie', amt: -84.3, type: 'inkaso' },
  { day: '2026-05-08', h: 9, m: 10, name: 'Orange Slovensko', cat: 'telekom', amt: -29.9, type: 'inkaso' },
  { day: '2026-05-05', h: 11, m: 33, name: 'Lidl Košice – Šaca', cat: 'potraviny', amt: -31.9, type: 'karta' },
  { day: '2026-05-02', h: 16, m: 10, name: 'Nay OC Optima', cat: 'nakupovanie', amt: -159.0, type: 'karta' },
  { day: '2026-04-28', h: 7, m: 40, name: 'OMV Košice Južné nábrežie', cat: 'doprava', amt: -61.15, type: 'karta' },
  { day: '2026-04-24', h: 9, m: 0, name: 'PixelForge s.r.o.', cat: 'prijem', amt: 2080, type: 'mzda', note: 'Mzda za apríl 2026' },
  { day: '2026-04-21', h: 13, m: 22, name: 'Billa Mlynská Košice', cat: 'potraviny', amt: -38.64, type: 'karta' },
  { day: '2026-04-18', h: 10, m: 0, name: 'Tatra banka, a.s.', cat: 'poistne', amt: -4.9, type: 'poplatok', note: 'Mesačný poplatok za účet' },
  { day: '2026-04-14', h: 18, m: 30, name: 'Costa Coffee Aupark KE', cat: 'restauracie', amt: -6.4, type: 'karta' },
  { day: '2026-04-10', h: 15, m: 12, name: 'H&M OC Optima', cat: 'nakupovanie', amt: -47.8, type: 'karta' },
  { day: '2026-04-06', h: 8, m: 55, name: 'Lidl Košice – Moldavská', cat: 'potraviny', amt: -26.33, type: 'karta' },
  { day: '2026-04-02', h: 9, m: 10, name: 'Orange Slovensko', cat: 'telekom', amt: -29.9, type: 'inkaso' },
  { day: '2026-03-28', h: 12, m: 40, name: 'Benu Lekáreň Hlavná', cat: 'zdravie', amt: -9.8, type: 'karta' },
  { day: '2026-03-25', h: 9, m: 0, name: 'PixelForge s.r.o.', cat: 'prijem', amt: 2080, type: 'mzda', note: 'Mzda za marec 2026' },
  { day: '2026-03-21', h: 17, m: 5, name: 'Tesco Extra Toryská', cat: 'potraviny', amt: -62.77, type: 'karta' },
  { day: '2026-03-16', h: 8, m: 0, name: 'VSE Energia', cat: 'byvanie', amt: -84.3, type: 'inkaso' },
  { day: '2026-03-12', h: 11, m: 50, name: 'Kaufland Košice', cat: 'potraviny', amt: -49.2, type: 'karta' },
  { day: '2026-03-08', h: 19, m: 40, name: 'Wolt Košice', cat: 'restauracie', amt: -17.3, type: 'karta' },
  { day: '2026-03-04', h: 7, m: 30, name: 'Slovnaft Košice Južná', cat: 'doprava', amt: -55.0, type: 'karta' },
]

export function createSeed() {
  const currentId = 'acc_personal'

  const transactions = TX.map((t, i) => ({
    id: `tx_${String(i + 1).padStart(3, '0')}`,
    accountId: t.amt > 0 || t.cat === 'prijem' ? currentId : currentId,
    date: at(t.day, t.h, t.m),
    name: t.name,
    category: t.cat,
    amount: t.amt,
    currency: 'EUR',
    type: t.type,
    vs: t.vs || '',
    ks: t.type === 'sepa' ? '0308' : '',
    ss: '',
    note: t.note || '',
    iban: t.iban || (t.type === 'sepa' ? 'SK31 0900 0000 0001 7123 4567' : ''),
    status: 'zaúčtovaná',
    balanceAfter: 0,
  }))

  const newestFirst = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date))
  let running = 83.52
  newestFirst.forEach((tx) => {
    tx.balanceAfter = Math.round(running * 100) / 100
    running = Math.round((running - tx.amount) * 100) / 100
  })
  const currentBalance = 83.52

  return {
    version: 11,
    user: {
      firstName: 'Yurii',
      lastName: 'Biriukov',
      fullName: 'Yurii Biriukov',
      pid: '0511034199',
      email: 'yurabirka@email.sk',
      phone: '+421 903 441 228',
      address: 'Hlavná 68, 040 01 Košice',
      clientFrom: '2021-09-15',
      branch: 'Košice – Hlavná',
    },
    settings: {
      hideBalances: false,
      instantPayments: true,
      notifications: {
        incoming: true,
        outgoing: true,
        card: true,
        marketing: false,
      },
      pinSet: true,
    },
    accounts: [
      {
        id: currentId,
        name: 'Tatra Personal',
        product: 'Bežný účet',
        iban: 'SK89 1100 0000 0029 4401 8372',
        bic: 'TATRSKBX',
        currency: 'EUR',
        balance: Math.round(currentBalance * 100) / 100,
        available: Math.round(currentBalance * 100) / 100,
        overdraftLimit: 500,
        overdraftUsed: 0,
        favorite: true,
        opened: '2021-09-15',
        color: '#0b0b10',
      },
    ],
    cards: [
      {
        id: 'card_visa',
        accountId: currentId,
        brand: 'Visa',
        product: 'TatraCard Visa Classic',
        holder: 'YURII BIRUKOV',
        last4: '4418',
        panMasked: '**** **** **** 4418',
        expiry: '09/28',
        status: 'aktívna',
        pin: '4419',
        variant: 'classic',
        limits: { atm: 1000, pos: 2500, online: 1500, contactless: 50 },
      },
    ],
    deposits: [
      {
        id: 'dep_74500',
        name: 'Digitálny termínovaný vklad',
        accountFrom: currentId,
        amount: 74500,
        rate: 4.6,
        months: 6,
        start: at('2026-08-23', 8, 0),
        end: at('2027-02-23', 8, 0),
        interestExpected: 1713.5,
        autoRenew: false,
        status: 'aktívny',
      },
    ],
    recipients: [
      { id: 'rcp_kh', name: 'Kateryna Horbach', iban: 'SK42 0200 0000 0036 8841 2210', bank: 'VÚB', vs: '', note: '' },
      { id: 'rcp_1', name: 'Martin Novák', iban: 'SK31 0900 0000 0001 7123 4567', bank: 'Slovenská sporiteľňa', vs: '', note: '' },
      { id: 'rcp_2', name: 'VSE Energia, a.s.', iban: 'SK15 1100 0000 0026 2610 0642', bank: 'Tatra banka', vs: '44018372', note: 'Elektrina' },
      { id: 'rcp_3', name: 'Orange Slovensko, a.s.', iban: 'SK07 0200 0000 0018 0350 4058', bank: 'VÚB', vs: '903441228', note: 'Mobil' },
    ],
    templates: [
      { id: 'tpl_kh', name: 'Kateryna Horbach', recipientId: 'rcp_kh', amount: 200, vs: '', note: 'Prevod' },
      { id: 'tpl_2', name: 'Orange', recipientId: 'rcp_3', amount: 29.9, vs: '903441228', note: 'Faktúra' },
      { id: 'tpl_3', name: 'VSE Energia', recipientId: 'rcp_2', amount: 84.3, vs: '44018372', note: 'Záloha' },
    ],
    standingOrders: [
      {
        id: 'so_orange',
        name: 'Orange Slovensko',
        from: currentId,
        toIban: 'SK07 0200 0000 0018 0350 4058',
        toName: 'Orange Slovensko, a.s.',
        amount: 29.9,
        day: 15,
        next: '2026-09-15',
        active: true,
      },
      {
        id: 'so_vse',
        name: 'VSE Energia',
        from: currentId,
        toIban: 'SK15 1100 0000 0026 2610 0642',
        toName: 'VSE Energia, a.s.',
        amount: 84.3,
        day: 10,
        next: '2026-09-10',
        active: true,
      },
    ],
    messages: [
      {
        id: 'msg_dep_74500',
        date: at('2026-08-23', 8, 0),
        title: 'Digitálny termínovaný vklad 74 500 €',
        body: 'Zriadili sme Digitálny termínovaný vklad 74 500,00 € na 6 mesiacov (23. 8. 2026 – 23. 2. 2027) so sadzbou 4,60 % p.a. Očakávaný úrok 1 713,50 €.',
        read: false,
        type: 'produkt',
      },
      {
        id: 'msg_1',
        date: at('2026-07-01', 9, 0),
        title: 'Výpis za jún 2026 je pripravený',
        body: 'Mesačný výpis z účtu Tatra Personal je dostupný v sekcii Dokumenty.',
        read: false,
        type: 'dokument',
      },
      {
        id: 'msg_3',
        date: at('2026-06-12', 8, 0),
        title: 'Bezpečnostné upozornenie',
        body: 'Tatra banka vás nikdy nežiada o PID, heslo ani kód z Čítačky e-mailom. Prihlasujte sa len na adrese moja.tatrabanka.sk.',
        read: true,
        type: 'bezpecnost',
      },
    ],
    transactions,
    statements: [
      { id: 'st_2026_06', period: 'Jún 2026', accountId: currentId, from: '2026-06-01', to: '2026-06-30' },
      { id: 'st_2026_05', period: 'Máj 2026', accountId: currentId, from: '2026-05-01', to: '2026-05-31' },
      { id: 'st_2026_04', period: 'Apríl 2026', accountId: currentId, from: '2026-04-01', to: '2026-04-30' },
      { id: 'st_2026_03', period: 'Marec 2026', accountId: currentId, from: '2026-03-01', to: '2026-03-31' },
    ],
  }
}
