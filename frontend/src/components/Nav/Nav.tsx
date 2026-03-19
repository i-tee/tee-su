'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/context/LocaleContext'
import type { Locale } from '@/locales'
import styles from './Nav.module.css'

export type Theme = 'dark' | 'light'


function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value};path=/;max-age=31536000`
}

export default function Nav({ initialTheme = 'dark' }: { initialTheme?: Theme }) {
  const { t, locale, setLocale } = useLocale()

  const [theme, setTheme] = useState<Theme>(initialTheme)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
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
