import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { AdminPanelModule } from './admin/admin.module';
import { Profile } from './profile.entity';
import { Skill } from './skill.entity';
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

    AdminPanelModule,
  ],
  controllers: [AppController, SkillsController],
  providers: [AppService, SkillsService],
})
export class AppModule {}
