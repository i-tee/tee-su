'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { locales, defaultLocale } from '@/locales'
import type { Locale, Translations } from '@/locales'

interface LocaleContextValue {
  locale: Locale
  t: Translations
  setLocale: (l: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  t: locales[defaultLocale],
  setLocale: () => {},
})

export function LocaleProvider({
  children,
  initialLocale = defaultLocale,
}: {
  children: ReactNode
  initialLocale?: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    // Пишем в куки — 1 год
    document.cookie = `locale=${next};path=/;max-age=31536000`
    document.documentElement.lang = locales[next].meta.lang
  }, [])

  return (
    <LocaleContext.Provider value={{ locale, t: locales[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
