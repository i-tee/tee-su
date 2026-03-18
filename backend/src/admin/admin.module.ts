import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminModule as AdminJSModule } from '@adminjs/nestjs';
import { Profile } from '../profile/profile.entity';
import { Skill } from '../skills/skill.entity';
import { SkillGroup } from '../skill-groups/skill-group.entity';

@Module({
  imports: [
    AdminJSModule.createAdminAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // Читаем флаг из .env, по умолчанию false (локалка открыта)
        const authEnabled = config.get('ADMIN_AUTH_ENABLED') === 'true';

        return {
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              {
                resource: Profile,
                options: { navigation: { name: 'Контент сайта' } },
              },
              {
                resource: Skill,
                options: { navigation: { name: 'Контент сайта' } },
              },
              {
                resource: SkillGroup,
                options: { navigation: { name: 'Контент сайта' } },
              },
            ],
          },

          // Spread с условием — если false, ключи auth и sessionOptions
          // вообще не попадают в объект, AdminJS видит конфиг без auth
          ...(authEnabled && {
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
        };
      },
    }),
  ],
  exports: [AdminJSModule],
})
export class AdminPanelModule {}
