import { Controller, Get } from '@nestjs/common';
import { SkillsService } from './skills.service'; // ← было ../skills.service

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  findAll() {
    return this.skillsService.findAll();
  }
}
