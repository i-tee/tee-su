import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillGroup } from './skill-group.entity';
import { SkillGroupsService } from './skill-groups.service';
import { SkillGroupsController } from './skill-groups.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SkillGroup])],
  providers: [SkillGroupsService],
  controllers: [SkillGroupsController],
})
export class SkillGroupsModule {}
