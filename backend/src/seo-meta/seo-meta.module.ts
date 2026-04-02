import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeoMeta } from './seo-meta.entity';
import { SeoMetaService } from './seo-meta.service';
import { SeoMetaController } from './seo-meta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SeoMeta])],
  controllers: [SeoMetaController],
  providers: [SeoMetaService],
  exports: [SeoMetaService],
})
export class SeoMetaModule {}
