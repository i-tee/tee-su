import { cookies } from 'next/headers'
import Nav, { type Theme } from '@/components/Nav/Nav'
import Hero from '@/components/Hero/Hero'
import Stack from '@/components/Stack/Stack'
import Agent from '@/components/Agent/Agent'
import About from '@/components/About/About'
import Contact from '@/components/Contact/Contact'
import Footer from '@/components/Footer/Footer'
import { getImages, getSkillGroups, getEducation } from '@/services/pageService'

export default async function Page() {
  const cookieStore = await cookies()
  const initialTheme = (cookieStore.get('theme')?.value ?? 'dark') as Theme

  const [images, skillGroups, education] = await Promise.all([
    getImages(),
    getSkillGroups(),
    getEducation(),
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
        <Agent />
        <About
          education={education}
          lightImageUrl={lightImage?.url ?? ''}
          lightImageAlt={lightImage?.alt ?? ''}
          darkImageUrl={darkImage?.url ?? ''}
          darkImageAlt={darkImage?.alt ?? ''}
        />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
