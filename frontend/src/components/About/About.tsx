'use client'

import Image from 'next/image'
import { useLocale } from '@/context/LocaleContext'
import type { ApiEducation } from '@/services/pageService'
import styles from './About.module.css'

interface AboutProps {
  education: ApiEducation[]
  lightImageUrl: string
  lightImageAlt: string
  darkImageUrl: string
  darkImageAlt: string
}

export default function About({
  education,
  lightImageUrl,
  lightImageAlt,
  darkImageUrl,
  darkImageAlt,
}: AboutProps) {
  const { t } = useLocale()
  const a = t.about

  // API данные если есть, иначе — из локали
  const timelineItems =
    education.length > 0
      ? education.map((item) => ({
          date: item.year ? String(item.year).substring(0, 4) : '',
          title: item.institution,
          desc: item.specialty,
        }))
      : a.timeline

  const hasPhoto = !!(lightImageUrl || darkImageUrl)

  return (
    <section id="about" className={styles.section}>
      <div className={styles.tag}>{a.section_tag}</div>
      <h2 className={styles.title}>{a.section_title}</h2>

      <div className={styles.grid}>
        {/* Фото — только на мобильном */}
        {hasPhoto && (
          <div className={styles.photoWrap}>
            {darkImageUrl && (
              <Image
                className={`${styles.avatar} ${styles.avatarDark}`}
                src={darkImageUrl}
                alt={darkImageAlt}
                width={600}
                height={600}
                style={{ objectFit: 'cover' }}
              />
            )}
            {lightImageUrl && (
              <Image
                className={`${styles.avatar} ${styles.avatarLight}`}
                src={lightImageUrl}
                alt={lightImageAlt}
                width={600}
                height={600}
                style={{ objectFit: 'cover' }}
              />
            )}
            <div className={styles.photoOverlay} aria-hidden />
            <span className={`${styles.corner} ${styles.cornerTL}`} aria-hidden />
            <span className={`${styles.corner} ${styles.cornerTR}`} aria-hidden />
          </div>
        )}

        {/* Текст */}
        <div className={styles.bio}>
          <p>{a.bio_1}</p>
          <p>{a.bio_2}</p>
          <p>{a.bio_3}</p>

          <div className={styles.eduHeader}>{a.education_header}</div>

          <div className={styles.timeline}>
            {timelineItems.map((item, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineDate}>{item.date}</div>
                <div className={styles.timelineTitle}>{item.title}</div>
                <div className={styles.timelineDesc}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
