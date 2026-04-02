import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SeoMeta extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // ── Базовые ────────────────────────────────────────────────────────────────

  @Column({ default: 'Evgeniy Tarasov — Fullstack Developer' })
  title: string;

  /** Шаблон для внутренних страниц: %s заменяется на заголовок страницы */
  @Column({ default: '%s | tee.su' })
  titleTemplate: string;

  @Column({ type: 'text', default: '' })
  description: string;

  /** Через запятую: php, laravel, nestjs, ... */
  @Column({ type: 'text', default: '' })
  keywords: string;

  @Column({ default: 'https://tee.su' })
  canonical: string;

  /** Имя автора для <meta name="author"> */
  @Column({ default: '' })
  author: string;

  // ── Open Graph ─────────────────────────────────────────────────────────────

  /** Если пустой — фронт подставит title */
  @Column({ default: '' })
  ogTitle: string;

  /** Если пустой — фронт подставит description */
  @Column({ type: 'text', default: '' })
  ogDescription: string;

  /** Полный URL к OG-картинке, рекомендуемый размер 1200×630 */
  @Column({ default: '' })
  ogImage: string;

  /** Альт-текст для OG-картинки (доступность) */
  @Column({ default: '' })
  ogImageAlt: string;

  /** website | profile */
  @Column({ default: 'website' })
  ogType: string;

  /** en_US | ru_RU */
  @Column({ default: 'en_US' })
  ogLocale: string;

  /** Название сайта в OG-теге */
  @Column({ default: 'tee.su' })
  ogSiteName: string;

  // ── Twitter Card ───────────────────────────────────────────────────────────

  /** summary | summary_large_image */
  @Column({ default: 'summary_large_image' })
  twitterCard: string;

  /** Хэндл без @ : просто tee_su */
  @Column({ default: '' })
  twitterSite: string;

  /** Хэндл автора — обычно тот же */
  @Column({ default: '' })
  twitterCreator: string;

  // ── JSON-LD (Person) ───────────────────────────────────────────────────────

  /** Полное имя для schema.org/Person */
  @Column({ default: '' })
  personName: string;

  @Column({ default: '' })
  personJobTitle: string;

  /** URL публичной страницы (обычно canonical) */
  @Column({ default: '' })
  personUrl: string;

  /** URL аватара/фото */
  @Column({ default: '' })
  personImage: string;

  /**
   * JSON-массив URL соцсетей для sameAs.
   * Хранится как строка, парсится в сервисе.
   * Пример: ["https://github.com/i-tee","https://t.me/tee_su"]
   */
  @Column({ type: 'text', default: '[]' })
  personSameAs: string;

  // ── Технические ────────────────────────────────────────────────────────────

  /** index, follow | noindex, nofollow | ... */
  @Column({ default: 'index, follow' })
  robots: string;

  /** Цвет адресной строки в мобильных браузерах */
  @Column({ default: '#1a1612' })
  themeColor: string;

  /** Основной язык сайта: ru | en */
  @Column({ default: 'ru' })
  locale: string;
}
