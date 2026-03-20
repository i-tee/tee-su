'use client'

import { useEffect, useRef } from 'react'
import styles from './HeroEffects.module.css'

// ─── Кастомный курсор ────────────────────────────────────
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.left = mx - 5 + 'px'
      dot.style.top = my - 5 + 'px'
    }

    // Кольцо с задержкой — плавно догоняет курсор
    const animRing = () => {
      rx += (mx - rx - 16) * 0.12
      ry += (my - ry - 16) * 0.12
      ring.style.left = rx + 'px'
      ring.style.top = ry + 'px'
      requestAnimationFrame(animRing)
    }

    const onEnter = () => ring.classList.add(styles.ringHovered)
    const onLeave = () => ring.classList.remove(styles.ringHovered)

    document.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    animRing()

    return () => {
      document.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className={styles.cursorDot} aria-hidden />
      <div ref={ringRef} className={styles.cursorRing} aria-hidden />
    </>
  )
}

// ─── Canvas с частицами ──────────────────────────────────
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf = 0

    const pts: { x: number; y: number; vx: number; vy: number; r: number }[] =
      []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = canvas.parentElement?.offsetHeight ?? window.innerHeight
      init()
    }

    const init = () => {
      pts.length = 0
      for (let i = 0; i < 50; i++) {
        pts.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const dark =
        document.documentElement.getAttribute('data-theme') !== 'light'
      const c = dark ? '124,106,247' : '108,92,231'

      pts.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${c}, .6)`
        ctx.fill()
      })

      // Линии между близкими частицами
      pts.forEach((a, i) =>
        pts.slice(i + 1).forEach((b) => {
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 120) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(${c}, ${0.15 * (1 - d / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }),
      )

      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.particles} aria-hidden />
}

// ─── Сетка на фоне ───────────────────────────────────────
function Grid() {
  return <div className={styles.grid} aria-hidden />
}

// ─── Светящиеся шары ─────────────────────────────────────
function Orbs() {
  return (
    <>
      <div className={`${styles.orb} ${styles.orb1}`} aria-hidden />
      <div className={`${styles.orb} ${styles.orb2}`} aria-hidden />
      <div className={`${styles.orb} ${styles.orb3}`} aria-hidden />
    </>
  )
}

// ─── Глитч эффект на имени ───────────────────────────────
// Используется через CSS — просто экспортируем класс
export { styles as glitchStyles }

// ─── Главный экспорт ─────────────────────────────────────
export default function HeroEffects() {
  return (
    <>
      <CustomCursor />
      <Grid />
      <Orbs />
      <Particles />
    </>
  )
}
