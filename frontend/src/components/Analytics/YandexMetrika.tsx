'use client'

import Script from 'next/script'

interface Props {
  /** ID счётчика. Пусто = компонент ничего не рендерит. */
  id: string | number | undefined | null
}

/**
 * Яндекс.Метрика для Next.js App Router.
 * Загружается через next/script со стратегией afterInteractive —
 * не блокирует первый рендер, но грузится сразу после гидратации.
 *
 * Опции: webvisor, clickmap, accurateTrackBounce, trackLinks — те же
 * что в стандартном сниппете из ЛК Яндекс.Метрики.
 */
export default function YandexMetrika({ id }: Props) {
  if (!id) return null

  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) { return; }
              }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

            ym(${id}, 'init', {
              webvisor: true,
              clickmap: true,
              referrer: document.referrer,
              url: location.href,
              accurateTrackBounce: true,
              trackLinks: true
            });
          `,
        }}
      />
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${id}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  )
}
