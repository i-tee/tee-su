import { Controller, Get } from '@nestjs/common';
import { EducationService } from './education.service';

@Controller('education')
export class EducationController {
  constructor(private service: EducationService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
