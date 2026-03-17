import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Profile } from './profile.entity';
import { Skill } from './skill.entity';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';

import AdminJS from 'adminjs';
import { AdminModule } from '@adminjs/nestjs';
import { Database, Resource } from '@adminjs/typeorm';

AdminJS.registerAdapter({ Database, Resource });

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forFeature([Profile, Skill]),

    AdminModule.createAdminAsync({
      useFactory: () => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [
            {
              resource: Profile,
              options: {
                navigation: { name: 'Контент сайта' },
              },
            },
            {
              resource: Skill,
              options: {
                navigation: { name: 'Контент сайта' },
              },
            },
          ],
        },
      }),
    }),
  ],
  controllers: [AppController, SkillsController],
  providers: [AppService, SkillsService],
})
export class AppModule {}
