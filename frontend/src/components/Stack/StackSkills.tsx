'use client'

import { useRef, useEffect } from 'react'
import type { ApiSkillGroup } from '@/services/pageService'
import styles from './Stack.module.css'

interface StackSkillsProps {
  skillGroups: ApiSkillGroup[]
}

export default function StackSkills({ skillGroups }: StackSkillsProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Анимация шкал при появлении в viewport
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.querySelectorAll<HTMLElement>('[data-level]').forEach((bar) => {
          const level = bar.getAttribute('data-level') ?? '0'
          bar.style.transform = `scaleX(${Number(level) / 100})`
        })
        obs.disconnect()
      },
      { threshold: 0.2 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Берём только скиллы у которых задан level > 0
  const skillsWithLevel = skillGroups
    .flatMap((g) => g.skills)
    .filter((s) => s.level > 0)
    .sort((a, b) => b.level - a.level)

  if (!skillsWithLevel.length) return null

  return (
    <div ref={ref} className={styles.skillsGrid}>
      {skillsWithLevel.map((skill) => (
        <div key={skill.id} className={styles.skillItem}>
          <div className={styles.skillMeta}>
            <span className={styles.skillName}>{skill.name}</span>
            <span className={styles.skillPct}>{skill.level}%</span>
          </div>
          <div className={styles.skillTrack}>
            <div
              className={styles.skillFill}
              data-level={skill.level}
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
