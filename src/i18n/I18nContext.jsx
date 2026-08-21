import { createContext, useContext, useMemo, useState } from 'react'
import { LANGS, translations } from './translations'

const LANG_KEY = 'tb-ib-lang'
const I18nContext = createContext(null)

const localeTag = { sk: 'sk-SK', en: 'en-GB', ru: 'ru-RU' }

function get(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj)
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem(LANG_KEY)
    return translations[saved] ? saved : 'sk'
  })

  function setLang(next) {
    const id = translations[next] ? next : 'sk'
    localStorage.setItem(LANG_KEY, id)
    setLangState(id)
  }

  const value = useMemo(() => {
    const dict = translations[lang] || translations.sk
    const tag = localeTag[lang] || 'sk-SK'
    function t(path) {
      const v = get(dict, path)
      return v == null ? path : v
    }
    function money(n, currency = 'EUR') {
      return new Intl.NumberFormat(tag, { style: 'currency', currency, minimumFractionDigits: 2 }).format(Number(n) || 0)
    }
    function date(iso) {
      if (!iso) return ''
      return new Date(iso).toLocaleDateString(tag, { day: 'numeric', month: 'numeric', year: 'numeric' })
    }
    function dateTime(iso) {
      if (!iso) return ''
      return new Date(iso).toLocaleString(tag, { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }
    function monthName(isoOrKey) {
      const d = String(isoOrKey).length === 7 ? new Date(`${isoOrKey}-01`) : new Date(isoOrKey)
      return d.toLocaleDateString(tag, { month: 'long', year: 'numeric' })
    }
    function greet() {
      const h = new Date().getHours()
      if (h < 12) return t('greetMorning')
      if (h < 18) return t('greetDay')
      return t('greetEve')
    }
    return { lang, setLang, langs: LANGS, t, tag, money, date, dateTime, monthName, greet }
  }, [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

export function LangSwitch({ light = false }) {
  const { lang, setLang, langs } = useI18n()
  return (
    <div className={`lang-switch ${light ? 'light' : ''}`}>
      {langs.map((l) => (
        <button key={l.id} type="button" className={lang === l.id ? 'on' : ''} onClick={() => setLang(l.id)}>
          {l.label}
        </button>
      ))}
    </div>
  )
}
