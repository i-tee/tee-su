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
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
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
        auth: {
          authenticate: async (email, password) => {
            if (
              email === config.get('ADMIN_EMAIL') &&
              password === config.get('ADMIN_PASSWORD')
            ) {
              return Promise.resolve({ email });
            }
            return Promise.resolve(null);
          },
          cookieName: 'adminjs',
          cookiePassword: config.get(
            'ADMIN_COOKIE_SECRET',
            'fallback-secret-32-chars-minimum!',
          ),
        },
        sessionOptions: {
          resave: false,
          saveUninitialized: true,
          secret: config.get(
            'ADMIN_COOKIE_SECRET',
            'fallback-secret-32-chars-minimum!',
          ),
        },
      }),
    }),
  ],
  controllers: [AppController, SkillsController],
  providers: [AppService, SkillsService],
})
export class AppModule {}
