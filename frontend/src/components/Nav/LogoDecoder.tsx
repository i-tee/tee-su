'use client'

import { useState, useRef } from 'react'
import styles from './LogoDecoder.module.css'

// Символы для Matrix-скрамблинга
const GLYPHS = '!@#$%&?<>[]{}|01アイウエオカキクケコ'

const ROWS = [
  { letter: 't', word: 'Tarasov', ussr: false },
  { letter: 'e', word: 'Eugene', ussr: false },
  { letter: 'e', word: 'Evgenievich', ussr: false },
  { letter: '.', word: 'Born in USSR', ussr: true },
  { letter: 's', word: 'Soviet', ussr: false },
  { letter: 'u', word: 'Union', ussr: false },
]

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

export default function LogoDecoder() {
  const [open, setOpen] = useState(false)
  const [decoded, setDecoded] = useState<string[]>(ROWS.map(() => ''))
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  function clearAll() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  function animateRow(index: number, onDone?: () => void) {
    const target = ROWS[index].word
    const STEPS = 14
    const INTERVAL = 38

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
        const t = setTimeout(tick, INTERVAL)
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

  function handleEnter() {
    clearAll()
    setOpen(true)
    setDecoded(ROWS.map((r) => r.word.replace(/\S/g, randomGlyph)))

    // Строки появляются каскадом
    ROWS.forEach((_, i) => {
      const t = setTimeout(() => animateRow(i), i * 100)
      timers.current.push(t)
    })
  }

  function handleLeave() {
    clearAll()
    setOpen(false)
    setDecoded(ROWS.map(() => ''))
  }

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <a className={styles.logo} href="#">
        tee.su
      </a>

      <div
        className={`${styles.panel} ${open ? styles.open : ''}`}
        aria-hidden={!open}
      >
        {ROWS.map((row, i) => (
          <div
            key={i}
            className={`${styles.row} ${row.ussr ? styles.ussr : ''}`}
          >
            <span className={styles.letter}>{row.letter}</span>
            <span className={styles.dash}>—</span>
            <span className={styles.word}>{decoded[i] || row.word}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
