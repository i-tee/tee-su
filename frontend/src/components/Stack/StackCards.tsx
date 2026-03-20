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
            {/* Категория сверху — subtitle */}
            {group.subtitle && (
              <div className={styles.cardCat}>{group.subtitle}</div>
            )}

            {/* Название */}
            <div className={styles.cardName}>{group.title}</div>

            {/* Теги */}
            <div className={styles.tags}>
              {group.skills
                .sort((a, b) => a.order - b.order)
                .map((skill) => (
                  <span
                    key={skill.id}
                    className={`${styles.tag} ${skill.isNew ? styles.tagGreen : ''}`}
                  >
                    {skill.name}
                  </span>
                ))}
            </div>
          </div>
        ))}
    </div>
  )
}
