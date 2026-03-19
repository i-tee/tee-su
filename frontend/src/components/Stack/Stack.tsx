'use client'

import { useLocale } from '@/context/LocaleContext'
import type { ApiSkillGroup } from '@/services/pageService'
import StackTerminal from './StackTerminal'
import StackCards from './StackCards'
import StackSkills from './StackSkills'
import styles from './Stack.module.css'

interface StackProps {
  skillGroups: ApiSkillGroup[]
}

export default function Stack({ skillGroups }: StackProps) {
  const { t } = useLocale()

  return (
    <section id="stack" className={styles.section}>
      {/* Заголовок */}
      <div className={styles.header}>
        <div className={styles.tag}>{t.stack.section_tag}</div>
        <h2 className={styles.title}>
          {t.stack.section_title_line1}
          <br />
          {t.stack.section_title_line2}
        </h2>
        <p className={styles.desc}>{t.stack.section_desc}</p>
      </div>

      {/* Терминал */}
      <StackTerminal />

      {/* Карточки стека */}
      <StackCards skillGroups={skillGroups} />

      {/* Шкала навыков */}
      <StackSkills skillGroups={skillGroups} />
    </section>
  )
}
