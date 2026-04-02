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
import { buildFeature, ActionResponse } from 'adminjs';
import { ImagesModule } from '../images/images.module';
import { S3UploadService } from '../images/s3-upload.service';
import { ComponentLoader } from 'adminjs';
import { SeoMeta } from '../seo-meta/seo-meta.entity';

@Module({
  imports: [
    AdminJSModule.createAdminAsync({
      imports: [ConfigModule, ImagesModule],
      inject: [ConfigService, S3UploadService],
      useFactory: (config: ConfigService, s3UploadService: S3UploadService) => {
        const authEnabled = config.get('ADMIN_AUTH_ENABLED') === 'true';
        const menuName = 'Entityes';

        const s3AfterFeature = buildFeature({
          actions: {
            new: {
              after: async (
                response: ActionResponse,
              ): Promise<ActionResponse> => {
                const record = response.record as
                  | { id?: string | number }
                  | undefined;
                const id = record?.id;
                if (id) {
                  await s3UploadService
                    .handlePostUpload(Number(id))
                    .catch((err) =>
                      console.error('[S3] Ошибка после загрузки:', err),
                    );
                }
                return response;
              },
            },
            edit: {
              after: async (
                response: ActionResponse,
              ): Promise<ActionResponse> => {
                const record = response.record as
                  | { id?: string | number }
                  | undefined;
                const id = record?.id;
                if (id) {
                  await s3UploadService
                    .handlePostUpload(Number(id))
                    .catch((err) =>
                      console.error('[S3] Ошибка после редактирования:', err),
                    );
                }
                return response;
              },
            },
          },
        });

        const componentLoader = new ComponentLoader();

        return {
          adminJsOptions: {
            rootPath: '/admin',
            componentLoader,
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
                resource: SeoMeta,
                options: {
                  navigation: { name: 'SEO', icon: 'Search' },
                  properties: {
                    id: {
                      isVisible: {
                        list: false,
                        edit: false,
                        show: true,
                        filter: false,
                      },
                    },
                    personSameAs: {
                      type: 'textarea',
                      description:
                        'JSON-массив URL. Пример: ["https://github.com/i-tee"]',
                    },
                    robots: {
                      availableValues: [
                        {
                          value: 'index, follow',
                          label: 'index, follow (по умолчанию)',
                        },
                        { value: 'noindex, follow', label: 'noindex, follow' },
                        {
                          value: 'noindex, nofollow',
                          label: 'noindex, nofollow',
                        },
                      ],
                    },
                    ogType: {
                      availableValues: [
                        { value: 'website', label: 'website' },
                        { value: 'profile', label: 'profile' },
                      ],
                    },
                    twitterCard: {
                      availableValues: [
                        { value: 'summary', label: 'summary' },
                        {
                          value: 'summary_large_image',
                          label: 'summary_large_image (рекомендуется)',
                        },
                      ],
                    },
                    ogLocale: {
                      availableValues: [
                        { value: 'en_US', label: 'en_US' },
                        { value: 'ru_RU', label: 'ru_RU' },
                      ],
                    },
                    description: { type: 'textarea' },
                    ogDescription: { type: 'textarea' },
                    keywords: { type: 'textarea' },
                  },
                  actions: {
                    // Запрещаем создавать новые записи и удалять — singleton
                    new: { isAccessible: false },
                    delete: { isAccessible: false },
                    bulkDelete: { isAccessible: false },
                  },
                },
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
                    saveToS3: {
                      isVisible: {
                        list: false,
                        show: true,
                        edit: true,
                        filter: false,
                      },
                      description: 'Загрузить в S3 после сохранения',
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
                  s3AfterFeature,
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
