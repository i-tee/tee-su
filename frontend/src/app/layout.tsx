import type { Metadata } from 'next'
import { Geist, Geist_Mono, DM_Serif_Display } from 'next/font/google'
import { cookies } from 'next/headers'
import { LocaleProvider } from '@/context/LocaleContext'
import type { Locale } from '@/locales'
import { buildMetadata } from './metadata'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const dmSerifDisplay = DM_Serif_Display({
  variable: '--font-dm-serif',
  subsets: ['latin'],
  weight: '400',
})

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata()
}

// Этот скрипт запускается ДО React — читает cookie и сразу
// ставит data-theme, чтобы не было вспышки белого фона
const THEME_SCRIPT = `
(function() {
  var cookie = document.cookie.split(';').find(function(c) {
    return c.trim().startsWith('theme=')
  })
  var theme = cookie
    ? cookie.split('=')[1].trim()
    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  document.documentElement.setAttribute('data-theme', theme)
})()
`.trim()

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('locale')?.value
  const initialLocale: Locale =
    localeCookie === 'en' || localeCookie === 'ru' ? localeCookie : 'en'

  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Антифлеш скрипт — применяет тему до первого рендера */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSerifDisplay.variable}`}
      >
        {/* LocaleProvider даёт доступ к переводам через useLocale() */}
        <LocaleProvider initialLocale={initialLocale}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
