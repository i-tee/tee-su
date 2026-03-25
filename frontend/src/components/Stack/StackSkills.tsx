'use client'

import { useRef, useEffect } from 'react'
import { useLocale } from '@/context/LocaleContext'
import type { ApiSkillGroup } from '@/services/pageService'
import styles from './Stack.module.css'

interface StackSkillsProps {
  skillGroups: ApiSkillGroup[]
}

export default function StackSkills({ skillGroups }: StackSkillsProps) {
  const { t } = useLocale()
  const ref = useRef<HTMLDivElement>(null)

  // Анимация шкал при появлении в viewport
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.querySelectorAll<HTMLElement>('[data-level]').forEach((bar) => {
          bar.style.transform = `scaleX(${Number(bar.getAttribute('data-level')) / 100})`
        })
        obs.disconnect()
      },
      { threshold: 0.2 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // API-данные если есть, иначе — из локали
  const apiSkills = skillGroups.flatMap((g) => g.skills).filter((s) => s.level > 0)

  const coreSkills =
    apiSkills.length > 0
      ? apiSkills.filter((s) => !s.isNew).sort((a, b) => b.level - a.level).slice(0, 4)
          .map((s) => ({ name: s.name, pct: s.level }))
      : t.stack.skills

  const emergingSkills =
    apiSkills.length > 0
      ? apiSkills.filter((s) => s.isNew).sort((a, b) => b.level - a.level).slice(0, 4)
          .map((s) => ({ name: s.name, pct: s.level }))
      : t.stack.skills_emerging

  return (
    <div ref={ref} className={styles.skillsWrapper}>
      {/* Колонка 1 */}
      <div className={styles.skillsCol}>
        <div className={styles.skillsColHeader}>{t.stack.skills_header_1}</div>
        {coreSkills.map((skill) => (
          <div key={skill.name} className={styles.skillItem}>
            <div className={styles.skillMeta}>
              <span className={styles.skillName}>{skill.name}</span>
              <span className={styles.skillPct}>{skill.pct}%</span>
            </div>
            <div className={styles.skillTrack}>
              <div
                className={styles.skillFill}
                data-level={skill.pct}
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Колонка 2 */}
      <div className={styles.skillsCol}>
        <div className={styles.skillsColHeader}>{t.stack.skills_header_2}</div>
        {emergingSkills.map((skill) => (
          <div key={skill.name} className={styles.skillItem}>
            <div className={styles.skillMeta}>
              <span className={styles.skillName}>{skill.name}</span>
              <span className={styles.skillPct}>{skill.pct}%</span>
            </div>
            <div className={styles.skillTrack}>
              <div
                className={styles.skillFill}
                data-level={skill.pct}
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
