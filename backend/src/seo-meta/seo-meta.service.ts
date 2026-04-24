import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeoMeta } from './seo-meta.entity';
import { SeoMetaResponseDto } from './dto/seo-meta-response.dto';

@Injectable()
export class SeoMetaService implements OnModuleInit {
  constructor(
    @InjectRepository(SeoMeta)
    private readonly repo: Repository<SeoMeta>,
  ) {}

  /**
   * Создаём дефолтную запись при первом запуске,
   * если таблица пустая.
   */
  async onModuleInit(): Promise<void> {
    const count = await this.repo.count();
    if (count === 0) {
      await this.repo.save(
        this.repo.create({
          title: 'Eugene Tarasov — Fullstack Developer',
          titleTemplate: '%s | tee.su',
          description:
            'Fullstack developer with 16+ years of experience. PHP, Laravel, NestJS, Vue.js, React, Docker. Available for new projects.',
          keywords:
            'fullstack developer, php, laravel, nestjs, vue, react, docker, typescript',
          canonical: 'https://tee.su',
          author: 'Eugene Tarasov',
          ogTitle: '',
          ogDescription: '',
          ogImage: 'https://tee.su/og-image.jpg',
          ogImageAlt: 'Eugene Tarasov — Fullstack Developer',
          ogType: 'website',
          ogLocale: 'en_US',
          ogSiteName: 'tee.su',
          twitterCard: 'summary_large_image',
          twitterSite: 'tee_su',
          twitterCreator: 'tee_su',
          personName: 'Eugene Tarasov',
          personJobTitle: 'Fullstack Developer',
          personUrl: 'https://tee.su',
          personImage: 'https://tee.su/i2026b.jpg',
          personSameAs: JSON.stringify([
            'https://github.com/i-tee',
            'https://t.me/tee_su',
            'mailto:me@tee.su',
          ]),
          robots: 'index, follow',
          themeColor: '#1a1612',
          locale: 'en',
        }),
      );
    }
  }

  /**
   * Singleton-паттерн: всегда одна запись в БД.
   * Если вдруг нет — создаём пустую (защита от гонок).
   */
  async getSingleton(): Promise<SeoMeta> {
    let record = await this.repo.findOne({ where: {}, order: { id: 'ASC' } });
    if (!record) {
      record = await this.repo.save(this.repo.create());
    }
    return record;
  }

  /**
   * Возвращает DTO с распарсенным personSameAs и
   * заполненными fallback-значениями (ogTitle → title, etc.)
   */
  async getForFrontend(): Promise<SeoMetaResponseDto> {
    const meta = await this.getSingleton();

    let sameAs: string[] = [];
    try {
      sameAs = JSON.parse(meta.personSameAs) as string[];
    } catch {
      sameAs = [];
    }

    return {
      // Базовые
      title: meta.title,
      titleTemplate: meta.titleTemplate,
      description: meta.description,
      keywords: meta.keywords,
      canonical: meta.canonical,
      author: meta.author,

      // Open Graph — fallback: og* → базовые если поле пустое
      ogTitle: meta.ogTitle || meta.title,
      ogDescription: meta.ogDescription || meta.description,
      ogImage: meta.ogImage,
      ogImageAlt: meta.ogImageAlt || meta.title,
      ogType: meta.ogType,
      ogLocale: meta.ogLocale,
      ogSiteName: meta.ogSiteName,

      // Twitter
      twitterCard: meta.twitterCard,
      twitterSite: meta.twitterSite ? `@${meta.twitterSite}` : '',
      twitterCreator: meta.twitterCreator ? `@${meta.twitterCreator}` : '',

      // JSON-LD
      personName: meta.personName,
      personJobTitle: meta.personJobTitle,
      personUrl: meta.personUrl || meta.canonical,
      personImage: meta.personImage,
      personSameAs: sameAs,

      // Технические
      robots: meta.robots,
      themeColor: meta.themeColor,
      locale: meta.locale,
    };
  }
}
