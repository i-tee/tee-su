import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  // запускается автоматически когда NestJS стартует
  async onModuleInit() {
    const count = await this.profileRepository.count();

    // если база пустая — создаём запись
    if (count === 0) {
      await this.profileRepository.save({
        name: 'Евгений Тарасов',
        title: 'Fullstack разработчик',
        city: 'Москва',
        experience: 16,
      });
    }
  }

  async getProfile(): Promise<Profile | null> {
    return this.profileRepository.findOne({ where: { id: 1 } });
  }
}
