'use client'

import { useRef, useEffect } from 'react'
import { useLocale } from '@/context/LocaleContext'
import type { Theme } from '@/components/Nav/Nav'
import styles from './Hero.module.css'
import heroEffectsStyles from './HeroEffects.module.css'
import Image from 'next/image'
import HeroEffects from './HeroEffects'

// ─── Типы пропов ─────────────────────────────────────────
interface HeroProps {
  initialTheme: Theme
  lightImageUrl: string
  lightImageAlt: string
  darkImageUrl: string
  darkImageAlt: string
}

// ─── Плавающие сниппеты кода ─────────────────────────────
const CODE_FLOATS = [
  `async function deploy() {\n  await docker.build()\n  await k8s.rollout()\n}`,
  `SELECT u.*, r.name AS role\nFROM users u\nJOIN roles r ON u.role_id = r.id\nWHERE u.active = true`,
  `@Injectable()\nexport class ApiService {\n  constructor(\n    private db: PrismaService\n  ) {}\n}`,
]

// ─── Хук typewriter ──────────────────────────────────────
function useTypewriter(
  phrases: readonly string[],
  ref: React.RefObject<HTMLSpanElement | null>,
) {
  const state = useRef({ pi: 0, ci: 0, del: false, timer: 0 })

  useEffect(() => {
    const s = state.current
    s.pi = 0
    s.ci = 0
    s.del = false

    function tick() {
      const el = ref.current
      if (!el || !phrases.length) return
      const p = phrases[s.pi % phrases.length]

      if (!s.del) {
        s.ci++
        el.textContent = p.slice(0, s.ci)
        if (s.ci === p.length) {
          s.del = true
          s.timer = window.setTimeout(tick, 2000)
          return
        }
      } else {
        s.ci--
        el.textContent = p.slice(0, s.ci)
        if (s.ci === 0) {
          s.del = false
          s.pi = (s.pi + 1) % phrases.length
          s.timer = window.setTimeout(tick, 400)
          return
        }
      }
      s.timer = window.setTimeout(tick, s.del ? 40 : 65)
    }

    s.timer = window.setTimeout(tick, 800)
    return () => clearTimeout(s.timer)
    // phrases меняется при смене локали — перезапускаем
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrases])
}

// ─── Canvas с частицами ──────────────────────────────────
function Particles({ theme }: { theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf = 0

    const pts: { x: number; y: number; vx: number; vy: number; r: number }[] =
      []

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = canvas!.parentElement?.offsetHeight ?? window.innerHeight
    }

    function init() {
      pts.length = 0
      const W = canvas!.width,
        H = canvas!.height
      for (let i = 0; i < 50; i++) {
        pts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5,
        })
      }
    }

    function draw() {
      const W = canvas!.width,
        H = canvas!.height
      ctx.clearRect(0, 0, W, H)
      const c = theme === 'dark' ? '124,106,247' : '108,92,231'
      pts.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${c},.6)`
        ctx.fill()
      })
      pts.forEach((a, i) =>
        pts.slice(i + 1).forEach((b) => {
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 120) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(${c},${0.15 * (1 - d / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }),
      )
      raf = requestAnimationFrame(draw)
    }

    resize()
    init()
    draw()
    window.addEventListener('resize', () => {
      resize()
      init()
    })
    return () => cancelAnimationFrame(raf)
  }, [theme])

  return <canvas ref={canvasRef} className={styles.particles} aria-hidden />
}

// ─── Компонент ───────────────────────────────────────────
export default function Hero({
  initialTheme,
  lightImageUrl,
  lightImageAlt,
  darkImageUrl,
  darkImageAlt,
}: HeroProps) {
  const { t } = useLocale()
  const twRef = useRef<HTMLSpanElement>(null)
  useTypewriter(t.hero.typewriter, twRef)

  return (
    <section className={styles.hero} id="hero">
      <HeroEffects />
      {/* Фон */}
      <div className={styles.grid} aria-hidden />
      <div className={`${styles.orb} ${styles.orb1}`} aria-hidden />
      <div className={`${styles.orb} ${styles.orb2}`} aria-hidden />
      <Particles theme={initialTheme} />

      {/* Плавающие сниппеты */}
      {CODE_FLOATS.map((code, i) => (
        <pre key={i} className={styles.codeFloat} aria-hidden>
          {code}
        </pre>
      ))}

      <div className={styles.inner}>
        {/* ── Левая колонка ── */}
        <div className={styles.left}>
          <div className={styles.badge}>
            <span className={styles.pulse} aria-hidden />
            {t.hero.badge}
          </div>

          <h1 className={styles.h1}>
            <span>{t.hero.first_name}</span>

            <span
              className={`${styles.accentName} ${heroEffectsStyles.glitch}`}
              data-text={t.hero.last_name}
            >
              {t.hero.last_name}
            </span>
          </h1>

          <p className={styles.typewriterWrap}>
            <span className={styles.prefix}>{t.hero.terminal_prompt}</span>{' '}
            <span ref={twRef} className={styles.twText} />
            <span className={styles.cursor} aria-hidden />
          </p>

          <div className={styles.ctas}>
            <a className={styles.btnPrimary} href="#contact">
              {t.hero.cta_primary}
            </a>
            <a className={styles.btnOutline} href="#stack">
              {t.hero.cta_secondary}
            </a>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statNum}>{t.hero.stats.years_value}</div>
              <div className={styles.statLabel}>{t.hero.stats.years_label}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNum}>
                {t.hero.stats.projects_value}+
              </div>
              <div className={styles.statLabel}>
                {t.hero.stats.projects_label}
              </div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNum}>
                {t.hero.stats.diplomas_value}
              </div>
              <div className={styles.statLabel}>
                {t.hero.stats.diplomas_label}
              </div>
            </div>
          </div>
        </div>

        {/* ── Правая колонка — аватар ── */}
        <div className={styles.avatarWrap}>
          {/* Светлая тема */}
          {lightImageUrl && (
            <Image
              className={`${styles.avatar} ${styles.avatarLight}`}
              src={lightImageUrl}
              alt={lightImageAlt}
              width={600}
              height={600}
              style={{ objectFit: 'cover' }}
              priority
            />
          )}
          {/* Тёмная тема */}
          {darkImageUrl && (
            <Image
              className={`${styles.avatar} ${styles.avatarDark}`}
              src={darkImageUrl}
              alt={darkImageAlt}
              width={600}
              height={600}
              style={{ objectFit: 'cover' }}
              priority
            />
          )}
          <div className={styles.avatarOverlay} aria-hidden />
          <span className={`${styles.corner} ${styles.cornerTL}`} aria-hidden />
          <span className={`${styles.corner} ${styles.cornerTR}`} aria-hidden />
          <div className={styles.avatarTag}>
            <div>
              <div className={styles.avatarTagName}>Eugene Tarasov</div>
              <div className={styles.avatarTagRole}>{t.hero.avatar_role}</div>
            </div>
            <span className={styles.pulse} aria-hidden />
          </div>
        </div>
      </div>
    </section>
  )
}
