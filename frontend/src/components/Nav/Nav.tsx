'use client'

import { useEffect, useState, useCallback } from 'react'
import { useLocale } from '@/context/LocaleContext'
import type { Locale } from '@/locales'
import styles from './Nav.module.css'

type Theme = 'dark' | 'light'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const found = document.cookie
    .split(';')
    .find((c) => c.trim().startsWith(name + '='))
  return found ? found.split('=')[1].trim() : null
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value};path=/;max-age=31536000`
}

export default function Nav() {
  const { t, locale, setLocale } = useLocale()

  const [theme, setTheme] = useState<Theme>('dark')
  const [scrolled, setScrolled] = useState(false)

  const applyTheme = useCallback((next: Theme) => {
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
  }, [])

  useEffect(() => {
    const saved = getCookie('theme') as Theme | null
    if (saved) {
      applyTheme(saved)
    } else {
      const preferred = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      applyTheme(preferred)
    }
  }, [applyTheme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setCookie('theme', next)
  }

  function switchLocale(next: Locale) {
    if (next === locale) return
    setLocale(next)
  }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <a className={styles.logo} href="#">
        {t.nav.logo}
      </a>

      <div className={styles.right}>
        <div className={styles.links}>
          <a href="#stack">{t.nav.stack}</a>
          <a href="#agent">{t.nav.agent}</a>
          <a href="#about">{t.nav.about}</a>
          <a href="#contact">{t.nav.contact}</a>
        </div>

        <button
          className={styles.themeBtn}
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? t.nav.theme_light : t.nav.theme_dark}
        </button>

        <div className={styles.langSwitcher} role="group" aria-label="Language">
          {(['en', 'ru'] as Locale[]).map((lng) => (
            <button
              key={lng}
              className={`${styles.langBtn} ${locale === lng ? styles.langActive : ''}`}
              onClick={() => switchLocale(lng)}
              aria-pressed={locale === lng}
            >
              {lng.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
