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

// Читаем куки — работает и на сервере и на клиенте
function getLocaleCookie(): Locale {
  if (typeof document === 'undefined') return defaultLocale
  const found = document.cookie
    .split(';')
    .find((c) => c.trim().startsWith('locale='))
  const value = found?.split('=')[1]?.trim()
  return value === 'en' || value === 'ru' ? value : defaultLocale
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Инициализируем сразу из куки — без useEffect, без расхождений
  const [locale, setLocaleState] = useState<Locale>(() => getLocaleCookie())

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
