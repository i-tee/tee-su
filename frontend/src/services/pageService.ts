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

export interface ApiSkill {
  id: number
  name: string
  isNew: boolean
  isHighlighted: boolean
  level: number
  order: number
  groupId: number
}

export interface ApiSkillGroup {
  id: number
  title: string
  subtitle: string
  category: string
  order: number
  skills: ApiSkill[]
}

export interface ApiEducation {
  id: number
  year: string
  institution: string
  specialty: string
  order: number
}

export interface ApiProfile {
  id: number
  name: string
  title: string
  city: string
  experience_start: string
  tagline: string
  heroText: string
  statsProjects: number
  statsBots: number
}

export interface ApiSeoMeta {
  title: string
  titleTemplate: string
  description: string
  keywords: string
  author: string
  canonical: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogImageAlt: string
  ogType: string
  ogLocale: string
  ogSiteName: string
  twitterCard: string
  twitterTitle: string
  twitterDescription: string
  twitterSite: string
  twitterCreator: string
  personName: string
  personJobTitle: string
  personUrl: string
  personImage: string
  personSameAs: string[]
  robots: string
  themeColor: string
  locale: string
}

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

export async function getSkillGroups(): Promise<ApiSkillGroup[]> {
  try {
    const res = await fetch(`${API_URL}/skill-groups`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function getEducation(): Promise<ApiEducation[]> {
  try {
    const res = await fetch(`${API_URL}/education`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function getProfile(): Promise<ApiProfile | null> {
  try {
    const res = await fetch(`${API_URL}/profile`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getSeoMeta(): Promise<ApiSeoMeta | null> {
  try {
    const res = await fetch(`${API_URL}/seo-meta`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}
