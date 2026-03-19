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

  findAll(): Promise<Image[]> {
    return this.repo.find({ order: { sortOrder: 'ASC' } });
  }

  findOne(id: number): Promise<Image | null> {
    return this.repo.findOne({ where: { id } });
  }
}
