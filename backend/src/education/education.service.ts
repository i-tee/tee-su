import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from './education.entity';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private repo: Repository<Education>,
  ) {}

  findAll(): Promise<Education[]> {
    return this.repo.find({ order: { order: 'ASC' } });
  }
}
