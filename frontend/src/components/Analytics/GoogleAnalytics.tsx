'use client'

import Script from 'next/script'

interface Props {
  /** ID счётчика (G-XXXXXXXXXX). Пусто = компонент ничего не рендерит. */
  id: string | undefined | null
}

/**
 * Google Analytics 4 (gtag.js) для Next.js App Router.
 *
 * Первый <Script> с strategy="afterInteractive" грузит сам gtag.js асинхронно
 * после гидратации, чтобы не блокировать первый рендер.
 *
 * Второй <Script> инициализирует dataLayer и отправляет первое событие config.
 */
export default function GoogleAnalytics({ id }: Props) {
  if (!id) return null

  return (
    <>
      <Script
        id="ga-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
      />
      <Script
        id="ga-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${id}');
          `,
        }}
      />
    </>
  )
}
