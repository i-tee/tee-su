'use client'

import { useLocale } from '@/context/LocaleContext'
import styles from './Footer.module.css'

export default function Footer() {
  const { t } = useLocale()

  return (
    <footer className={styles.footer}>
      <span className={styles.copy}>{t.footer.copy}</span>
      <span className={styles.tagline}>{t.footer.tagline}</span>
    </footer>
  )
}
