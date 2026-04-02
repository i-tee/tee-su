import { Controller, Get } from '@nestjs/common';
import { SeoMetaService } from './seo-meta.service';
import { SeoMetaResponseDto } from './dto/seo-meta-response.dto';

@Controller('seo-meta')
export class SeoMetaController {
  constructor(private readonly seoMetaService: SeoMetaService) {}

  /**
   * GET /seo-meta
   * Возвращает все SEO-настройки сайта.
   * Next.js дёргает этот endpoint на уровне layout.tsx.
   */
  @Get()
  getForFrontend(): Promise<SeoMetaResponseDto> {
    return this.seoMetaService.getForFrontend();
  }
}
