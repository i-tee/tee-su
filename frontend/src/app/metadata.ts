import type { Metadata } from 'next'
import { getSeoMeta } from '@/services/pageService'

const FALLBACK: Metadata = {
  title: 'Eugene Tarasov — Fullstack Developer',
  description: 'Fullstack developer, 16 years experience, backend-first.',
}

export async function buildMetadata(): Promise<Metadata> {
  const seo = await getSeoMeta()

  if (!seo) return FALLBACK

  return {
    title: seo.title || FALLBACK.title,
    description: seo.description || (FALLBACK.description as string),
    keywords: seo.keywords || undefined,
    authors: seo.author ? [{ name: seo.author }] : undefined,
    robots: seo.robots || 'index, follow',
    themeColor: seo.themeColor || undefined,

    openGraph: {
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      images: seo.ogImage
        ? [{ url: seo.ogImage, alt: seo.ogImageAlt || seo.ogTitle }]
        : [],
      url: seo.canonical || undefined,
      type: (seo.ogType as 'website' | 'profile') || 'website',
      locale: seo.ogLocale || 'en_US',
      siteName: seo.ogSiteName || undefined,
    },

    twitter: {
      card:
        (seo.twitterCard as 'summary' | 'summary_large_image') ||
        'summary_large_image',
      title: seo.twitterTitle || seo.title,
      description: seo.twitterDescription || seo.description,
      site: seo.twitterSite || undefined, // ← добавили
      creator: seo.twitterCreator || undefined, // ← добавили
      images: seo.ogImage ? [seo.ogImage] : [],
    },

    alternates: {
      canonical: seo.canonical || undefined,
    },
  }
}
