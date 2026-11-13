import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private repo: Repository<Image>,
  ) {}

  async findAll(): Promise<Image[]> {
    const images = await this.repo.find({ order: { sortOrder: 'ASC' } });
    return images.map((img) => this.withPublicUrl(img));
  }

  async findOne(id: number): Promise<Image | null> {
    const img = await this.repo.findOne({ where: { id } });
    return img ? this.withPublicUrl(img) : null;
  }

  // Локальный диск хранит в url только ключ файла — отдаём наружу путь /uploads/<key>.
  // Полные URL (S3) пропускаем как есть, поэтому переключение драйвера не ломает старые записи.
  private withPublicUrl(img: Image): Image {
    if (img.url && !/^https?:\/\//.test(img.url) && !img.url.startsWith('/')) {
      img.url = `/uploads/${img.url}`;
    }
    return img;
  }
}
