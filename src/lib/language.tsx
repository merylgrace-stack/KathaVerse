import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { Language } from '../data/types'
import { useLanguagePreference } from './store'

interface LanguageValue {
  lang: Language
  setLang: (lang: Language) => void
  pick: (value: { en: string; ml: string }) => string
}

const LanguageContext = createContext<LanguageValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useLanguagePreference()

  const value = useMemo<LanguageValue>(
    () => ({
      lang,
      setLang,
      pick: (entry) => (lang === 'ml' ? entry.ml : entry.en),
    }),
    [lang, setLang],
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used inside a LanguageProvider')
  }
  return context
}

export const LANGUAGE_LABELS: { id: Language; label: string; short: string }[] = [
  { id: 'en', label: 'English', short: 'EN' },
  { id: 'ml', label: 'മലയാളം', short: 'ML' },
]
