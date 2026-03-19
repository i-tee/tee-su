import { cookies } from 'next/headers'
import Nav from '@/components/Nav/Nav'
import type { Theme } from '@/components/Nav/Nav'

export default async function Page() {
  const cookieStore = await cookies()
  const themeCookie = cookieStore.get('theme')?.value
  const initialTheme: Theme =
    themeCookie === 'light' || themeCookie === 'dark' ? themeCookie : 'dark'

  return (
    <>
      <Nav initialTheme={initialTheme} />
      <main style={{ padding: '8rem 4rem 2rem' }}>
        <h1 style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>
          Nav works ✅
        </h1>
      </main>
    </>
  )
}
