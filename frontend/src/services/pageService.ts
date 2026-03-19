// Все запросы к бэкенду для главной страницы — в одном месте

const API_URL = process.env.API_URL ?? 'http://localhost:4000'

// ─── Типы ответов от API ──────────────────────────────────

export interface ApiImage {
  id: number
  url: string
  alt: string
  title: string
  caption: string
  description: string
  sortOrder: number
  mimeType: string
}

// Сюда будем добавлять новые типы по мере роста:
// export interface ApiProfile { ... }
// export interface ApiSkill   { ... }

// ─── Запросы ─────────────────────────────────────────────

export async function getImages(): Promise<ApiImage[]> {
  try {
    const res = await fetch(`${API_URL}/images`, {
      next: { revalidate: 3600 }, // кеш на 1 час
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

// Сюда добавим позже:
// export async function getProfile()  { ... }
// export async function getSkills()   { ... }
// export async function getEducation(){ ... }
