import Nav from '@/components/Nav/Nav'

export default function Page() {
  return (
    <>
      <Nav />
      <main style={{ padding: '8rem 4rem 2rem' }}>
        <h1 style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>
          Nav works ✅
        </h1>
      </main>
    </>
  )
}
