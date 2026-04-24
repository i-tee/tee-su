import type { Metadata } from 'next'
import { getSeoMeta } from '@/services/pageService'

const SITE_URL = 'https://tee.su'

const FALLBACK: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Eugene Tarasov — Fullstack Developer',
  description: 'Fullstack developer, 16 years experience, backend-first.',
}

export async function buildMetadata(): Promise<Metadata> {
  const seo = await getSeoMeta()

  if (!seo) return FALLBACK

  return {
    metadataBase: new URL(SITE_URL),

    title: seo.title || FALLBACK.title,
    description: seo.description || (FALLBACK.description as string),
    keywords: seo.keywords || undefined,
    authors: seo.author ? [{ name: seo.author }] : undefined,
    robots: seo.robots || 'index, follow',

    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
        { url: '/favicon.ico', sizes: 'any' },
      ],
      apple: [{ url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }],
      shortcut: '/favicon.ico',
    },

    manifest: '/site.webmanifest',

    openGraph: {
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      images: seo.ogImage
        ? [{ url: seo.ogImage, alt: seo.ogImageAlt || seo.ogTitle, width: 1200, height: 630 }]
        : [],
      url: seo.canonical || SITE_URL,
      type: (seo.ogType as 'website' | 'profile') || 'website',
      locale: seo.ogLocale || 'en_US',
      siteName: seo.ogSiteName || 'tee.su',
    },

    twitter: {
      card: (seo.twitterCard as 'summary' | 'summary_large_image') || 'summary_large_image',
      title: seo.twitterTitle || seo.title,
      description: seo.twitterDescription || seo.description,
      site: seo.twitterSite || undefined,
      creator: seo.twitterCreator || undefined,
      images: seo.ogImage ? [{ url: seo.ogImage, alt: seo.ogImageAlt || seo.title }] : [],
    },

    alternates: {
      canonical: seo.canonical || SITE_URL,
    },
  }
}
