'use client'

import { useLocale } from '@/context/LocaleContext'
import styles from './Mcp.module.css'

export default function Mcp() {
  const { t } = useLocale()
  const m = t.mcp

  return (
    <section id="mcp" className={styles.section}>
      <div className={styles.header}>
        <div className={styles.tag}>{m.section_tag}</div>
        <h2 className={styles.title}>
          {m.section_title_line1}
          <br />
          {m.section_title_line2}
        </h2>
        <p className={styles.desc}>{m.description}</p>
      </div>

      <div className={styles.grid}>
        {/* Features list */}
        <ul className={styles.featureList}>
          {m.features.map((feature, i) => (
            <li key={i} className={styles.featureItem}>
              {feature}
            </li>
          ))}
        </ul>

        {/* Tier cards */}
        <div className={styles.tiers}>
          <div className={styles.tiersHeader}>{m.tiers_header}</div>
          {m.tiers.map((tier, i) => (
            <div key={i} className={styles.tier}>
              <div className={styles.tierTag}>{tier.tag}</div>
              <div className={styles.tierName}>{tier.name}</div>
              <p className={styles.tierDesc}>{tier.desc}</p>
            </div>
          ))}

          <a href="#contact" className={styles.cta}>
            {m.cta}
          </a>
        </div>
      </div>
    </section>
  )
}
