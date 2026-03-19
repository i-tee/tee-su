import { cookies } from 'next/headers'
import Nav, { type Theme } from '@/components/Nav/Nav'
import Hero from '@/components/Hero/Hero'
import { getImages } from '@/services/pageService'

export default async function Page() {
  const cookieStore = await cookies()
  const initialTheme = (cookieStore.get('theme')?.value ?? 'dark') as Theme

  // Все данные с бэкенда — через сервис
  const images = await getImages()

  // sortOrder 1 — светлая, sortOrder 2 — тёмная
  const lightImage = images.find((img) => img.sortOrder === 1)
  const darkImage = images.find((img) => img.sortOrder === 2)

  return (
    <>
      <Nav initialTheme={initialTheme} />
      <main>
        <Hero
          initialTheme={initialTheme}
          lightImageUrl={lightImage?.url ?? ''}
          lightImageAlt={lightImage?.alt ?? ''}
          darkImageUrl={darkImage?.url ?? ''}
          darkImageAlt={darkImage?.alt ?? ''}
        />
      </main>
    </>
  )
}
