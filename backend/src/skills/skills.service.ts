import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './skill.entity'; // ← было ../skill.entity

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
  ) {}

  findAll(): Promise<Skill[]> {
    return this.skillsRepository.find({ order: { order: 'ASC' } });
  }
}
