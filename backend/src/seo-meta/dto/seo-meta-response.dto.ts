/**
 * Что получает Next.js — уже готовые данные
 * без сырых JSON-строк и без null-значений.
 */
export class SeoMetaResponseDto {
  // Базовые
  title: string;
  titleTemplate: string;
  description: string;
  keywords: string;
  canonical: string;
  author: string;

  // Open Graph
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageAlt: string;
  ogType: string;
  ogLocale: string;
  ogSiteName: string;

  // Twitter Card
  twitterCard: string;
  twitterSite: string; // уже с @
  twitterCreator: string; // уже с @

  // JSON-LD
  personName: string;
  personJobTitle: string;
  personUrl: string;
  personImage: string;
  personSameAs: string[]; // распарсенный массив

  // Технические
  robots: string;
  themeColor: string;
  locale: string;
}
