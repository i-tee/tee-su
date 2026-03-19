import { cookies } from 'next/headers'
import Nav, { type Theme } from '@/components/Nav/Nav'
import Hero from '@/components/Hero/Hero'
import Stack from '@/components/Stack/Stack'
import { getImages, getSkillGroups } from '@/services/pageService'

export default async function Page() {
  const cookieStore = await cookies()
  const initialTheme = (cookieStore.get('theme')?.value ?? 'dark') as Theme

  // Все данные с бэкенда
  const [images, skillGroups] = await Promise.all([
    getImages(),
    getSkillGroups(),
  ])

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
        <Stack skillGroups={skillGroups} />
      </main>
    </>
  )
}
