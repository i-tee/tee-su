'use client'

import type { ApiSkillGroup } from '@/services/pageService'
import styles from './Stack.module.css'

interface StackCardsProps {
  skillGroups: ApiSkillGroup[]
}

export default function StackCards({ skillGroups }: StackCardsProps) {
  return (
    <div className={styles.cardGrid}>
      {skillGroups
        .sort((a, b) => a.order - b.order)
        .map((group) => (
          <div key={group.id} className={styles.card}>
            {group.category && (
              <div className={styles.cardCat}>{group.category}</div>
            )}
            <div className={styles.cardName}>{group.title}</div>
            {group.subtitle && (
              <div className={styles.cardSub}>{group.subtitle}</div>
            )}
            <div className={styles.tags}>
              {group.skills
                .sort((a, b) => a.order - b.order)
                .map((skill) => (
                  <span
                    key={skill.id}
                    className={`${styles.tag} ${skill.isHighlighted ? styles.tagGreen : ''}`}
                  >
                    {skill.name}
                    {skill.isNew && <span className={styles.tagNew}>new</span>}
                  </span>
                ))}
            </div>
          </div>
        ))}
    </div>
  )
}
