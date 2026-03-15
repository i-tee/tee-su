import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './skill.entity';

@Injectable()
export class SkillsService implements OnModuleInit {
  constructor(
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
  ) {}

  async onModuleInit() {
    const count = await this.skillsRepository.count();

    if (count === 0) {
      await this.skillsRepository.save([
        { name: 'Laravel', category: 'Backend', isNew: false },
        { name: 'PHP', category: 'Backend', isNew: false },
        { name: 'NestJS', category: 'Backend', isNew: true },
        { name: 'TypeScript', category: 'Backend', isNew: true },
        { name: 'Vue.js', category: 'Frontend', isNew: false },
        { name: 'Next.js', category: 'Frontend', isNew: true },
        { name: 'PostgreSQL', category: 'Database', isNew: false },
        { name: 'Docker', category: 'DevOps', isNew: false },
      ]);
    }
  }

  async findAll(): Promise<Skill[]> {
    return this.skillsRepository.find();
  }
}
