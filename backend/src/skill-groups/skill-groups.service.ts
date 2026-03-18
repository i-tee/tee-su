import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillGroup } from './skill-group.entity';

@Injectable()
export class SkillGroupsService {
  constructor(
    @InjectRepository(SkillGroup)
    private repo: Repository<SkillGroup>,
  ) {}

  findAll(): Promise<SkillGroup[]> {
    return this.repo.find({
      order: { order: 'ASC' },
      relations: ['skills'], // ← подтягивает скиллы автоматически
    });
  }
}
