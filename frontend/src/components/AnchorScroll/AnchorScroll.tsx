'use client'

import { useEffect } from 'react'

/**
 * Чинит прямой переход по якорной ссылке (`https://tee.su/#mcp`).
 *
 * Проблема: в Next.js App Router секции часто рендерятся асинхронно
 * (Suspense, server actions), и браузерный нативный скролл по якорю
 * успевает отработать раньше — до того как нужный элемент появится в DOM.
 *
 * Решение: после монтирования читаем `location.hash` и пытаемся найти
 * элемент через `requestAnimationFrame` несколько раз подряд.
 * Как только найден — скроллим к нему.
 */
export default function AnchorScroll() {
  useEffect(() => {
    const hash = window.location.hash
    if (!hash || hash === '#') return

    const id = hash.slice(1)
    let attempts = 0
    const MAX_ATTEMPTS = 30 // ~500мс при 60fps — достаточно для гидратации

    function tryScroll() {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      if (++attempts < MAX_ATTEMPTS) {
        requestAnimationFrame(tryScroll)
      }
    }

    // Первый кадр — пусть React закончит инициальный рендер
    requestAnimationFrame(tryScroll)
  }, [])

  return null
}
