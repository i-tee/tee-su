import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminModule as AdminJSModule } from '@adminjs/nestjs';
import { Profile } from '../profile/profile.entity';
import { Skill } from '../skills/skill.entity';
import { SkillGroup } from '../skill-groups/skill-group.entity';
import { Education } from '../education/education.entity';
import { Image } from '../images/image.entity';
import { join } from 'path';

import uploadFeature from '@adminjs/upload';

@Module({
  imports: [
    AdminJSModule.createAdminAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const authEnabled = config.get('ADMIN_AUTH_ENABLED') === 'true';
        const menuName = 'Entityes';

        return {
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              {
                resource: Profile,
                options: { navigation: { name: menuName } },
              },
              {
                resource: Skill,
                options: {
                  navigation: { name: menuName },
                  properties: {
                    groupId: { reference: 'SkillGroup' },
                  },
                },
              },
              {
                resource: SkillGroup,
                options: { navigation: { name: menuName } },
              },
              {
                resource: Education,
                options: { navigation: { name: menuName } },
              },
              {
                resource: Image,
                options: {
                  navigation: { name: menuName },
                  properties: {
                    url: {
                      isVisible: {
                        list: true,
                        show: true,
                        edit: false,
                        filter: false,
                      },
                    },
                    mimeType: {
                      isVisible: {
                        list: false,
                        show: true,
                        edit: false,
                        filter: false,
                      },
                    },
                    description: { type: 'textarea' },
                  },
                },
                features: [
                  uploadFeature({
                    provider: {
                      local: {
                        bucket: join(__dirname, '..', '..', 'uploads'),
                        opts: {
                          baseUrl: '/uploads',
                        },
                      },
                    },
                    properties: {
                      key: 'url',
                      mimeType: 'mimeType',
                    },
                    uploadPath: (_record, filename) =>
                      `${Date.now()}-${filename}`,
                  }),
                ],
              },
            ],
          },

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
