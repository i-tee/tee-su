import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';

@Injectable()
export class ProfileService implements OnModuleInit {
  constructor(
    @InjectRepository(Profile)
    private repo: Repository<Profile>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) {
      await this.repo.save({
        name: 'Евгений Тарасов',
        title: 'Fullstack / AI Developer',
        city: 'Одинцово, Москва',
        experience: 16,
        tagline: '',
        heroText: '',
        statsProjects: 0,
        statsBots: 0,
      });
    }
  }

  getProfile(): Promise<Profile | null> {
    return this.repo.findOne({ where: { id: 1 } });
  }
}
