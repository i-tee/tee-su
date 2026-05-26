'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './LogoDecoder.module.css'

// Символы для Matrix-скрамблинга
const GLYPHS = '!@#$%&?<>[]{}|01アイウエオカキクケコ'

const ROWS = [
  { letter: 't', word: 'Tarasov', ussr: false },
  { letter: 'e', word: 'Eugene', ussr: false },
  { letter: 'e', word: 'Evgenievich', ussr: false },
  { letter: '.', word: 'made in', ussr: true },
  { letter: 's', word: 'Soviet', ussr: false },
  { letter: 'u', word: 'Union', ussr: false },
]

// Тайминги анимации (должны совпадать с animateRow ниже)
const ROW_STAGGER = 100 // мс между стартом каждой строки
const STEPS = 14
const STEP_INTERVAL = 38
const READ_DELAY = 2700 // сколько держим панель открытой после конца анимации (итого ~3.8с)

const TOTAL_OPEN_MS =
  ROWS.length * ROW_STAGGER + STEPS * STEP_INTERVAL + READ_DELAY

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

export default function LogoDecoder() {
  const [open, setOpen] = useState(false)
  const [decoded, setDecoded] = useState<string[]>(ROWS.map(() => ''))
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)

  function clearAll() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  function animateRow(index: number, onDone?: () => void) {
    const target = ROWS[index].word
    let step = 0

    function tick() {
      step++
      const progress = step / STEPS
      const chars = target.split('').map((ch, i) => {
        if (ch === ' ') return ' '
        return i < Math.floor(progress * target.length) ? ch : randomGlyph()
      })
      setDecoded((prev) => {
        const next = [...prev]
        next[index] = chars.join('')
        return next
      })

      if (step < STEPS) {
        const t = setTimeout(tick, STEP_INTERVAL)
        timers.current.push(t)
      } else {
        setDecoded((prev) => {
          const next = [...prev]
          next[index] = target
          return next
        })
        onDone?.()
      }
    }

    tick()
  }

  function openPanel() {
    clearAll()
    setOpen(true)
    setDecoded(ROWS.map((r) => r.word.replace(/\S/g, randomGlyph)))

    // Каскадная анимация по строкам
    ROWS.forEach((_, i) => {
      const t = setTimeout(() => animateRow(i), i * ROW_STAGGER)
      timers.current.push(t)
    })

    // Автоматическое закрытие — для мобильных и если пользователь
    // оставил мышь на десктопе и не уводит её
    const autoClose = setTimeout(closePanel, TOTAL_OPEN_MS)
    timers.current.push(autoClose)
  }

  function closePanel() {
    clearAll()
    setOpen(false)
    setDecoded(ROWS.map(() => ''))
  }

  // Тап мимо панели на мобильных → закрываем
  useEffect(() => {
    if (!open) return

    function onOutside(e: PointerEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        closePanel()
      }
    }

    document.addEventListener('pointerdown', onOutside)
    return () => document.removeEventListener('pointerdown', onOutside)
  }, [open])

  // Клик по логотипу:
  //  - На десктопе (есть hover) — пропускаем дефолтное поведение,
  //    href="#" скроллит страницу наверх.
  //  - На тач-устройствах (нет hover) — переключаем панель,
  //    т.к. mouseenter на iOS срабатывает один раз, а второй тап раньше
  //    ничего не делал.
  function handleLogoClick(e: React.MouseEvent) {
    const isTouch = window.matchMedia('(hover: none)').matches
    if (!isTouch) return // десктоп: даём href="#" работать → скролл наверх

    e.preventDefault()
    if (open) closePanel()
    else openPanel()
  }

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      onMouseEnter={openPanel}
      onMouseLeave={closePanel}
    >
      <a className={styles.logo} href="#" onClick={handleLogoClick}>
        tee.su
      </a>

      <div
        className={`${styles.panel} ${open ? styles.open : ''}`}
        aria-hidden={!open}
      >
        {ROWS.map((row, i) => {
          const displayed = decoded[i] || row.word
          const first = displayed.charAt(0)
          const rest = displayed.slice(1)
          return (
            <div
              key={i}
              className={`${styles.row} ${row.ussr ? styles.ussr : ''}`}
            >
              <span className={styles.letter}>{row.letter}</span>
              <span className={styles.dash}>—</span>
              <span className={styles.word}>
                <strong className={styles.firstLetter}>{first}</strong>
                {rest}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
