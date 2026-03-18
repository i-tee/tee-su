import { Controller, Get } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller()
export class ProfileController {
  constructor(private service: ProfileService) {}

  @Get()
  root(): string {
    return 'API работает!';
  }

  @Get('profile')
  getProfile() {
    return this.service.getProfile();
  }
}
