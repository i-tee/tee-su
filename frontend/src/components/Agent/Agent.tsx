'use client'

import { useLocale } from '@/context/LocaleContext'
import styles from './Agent.module.css'

export default function Agent() {
  const { t } = useLocale()
  const a = t.agent

  return (
    <section id="agent" className={styles.section}>
      <div className={styles.header}>
        <div className={styles.tag}>{a.section_tag}</div>
        <h2 className={styles.title}>
          {a.section_title_line1}
          <br />
          {a.section_title_line2}
        </h2>
        <p className={styles.desc}>{a.description}</p>
      </div>

      <div className={styles.grid}>
        {/* Features list */}
        <ul className={styles.featureList}>
          {a.features.map((feature, i) => (
            <li key={i} className={styles.featureItem}>
              {feature}
            </li>
          ))}
        </ul>

        {/* Agent card */}
        <div className={styles.card}>
          <div className={styles.cardBadge}>
            <span className={styles.badgeDot} />
            {a.card_badge}
          </div>
          <div className={styles.cardAvatar}>🤖</div>
          <div className={styles.cardName}>{a.card_name}</div>
          <div className={styles.cardHandle}>{a.card_handle}</div>
          <p className={styles.cardDesc}>{a.card_desc}</p>
          <a
            href={a.card_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cardBtn}
          >
            {a.card_cta}
          </a>
        </div>
      </div>
    </section>
  )
}
