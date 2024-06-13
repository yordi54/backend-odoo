import { Controller, Post } from '@nestjs/common';
import { GuardianService } from './guardian.service';

@Controller('guardian')
export class GuardianController {
  constructor(private readonly guardianService: GuardianService) {}

  @Post('getAnnouncementByGuardians')
  async getAnnouncementByGuardians() {
    return this.guardianService.getAnnouncementByGuardians(6, 'jorge1234', []);
  }

}
