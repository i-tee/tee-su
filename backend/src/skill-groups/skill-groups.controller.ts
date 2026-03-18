import { Controller, Get } from '@nestjs/common';
import { SkillGroupsService } from './skill-groups.service';

@Controller('skill-groups')
export class SkillGroupsController {
  constructor(private service: SkillGroupsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
