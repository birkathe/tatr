import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const THEME_KEY = 'tb-ib-theme'
const ThemeContext = createContext(null)

function readTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  document.documentElement.style.colorScheme = theme
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const value = useMemo(() => {
    function setTheme(next) {
      const id = next === 'light' ? 'light' : 'dark'
      localStorage.setItem(THEME_KEY, id)
      setThemeState(id)
      applyTheme(id)
    }
    function toggleTheme() {
      setTheme(theme === 'dark' ? 'light' : 'dark')
    }
    return { theme, setTheme, toggleTheme, isDark: theme === 'dark' }
  }, [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
