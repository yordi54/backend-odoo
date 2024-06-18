import { Body, Controller, Post } from '@nestjs/common';
import { GuardianService } from './guardian.service';

@Controller('guardian')
export class GuardianController {
  constructor(private readonly guardianService: GuardianService) {}

  @Post('getAnnouncementByGuardians')
  async getAnnouncementByGuardians() {
    return this.guardianService.getAnnouncementByGuardians(6, 'jorge1234', []);
  }
  @Post('get-student')
  async getStudent(@Body('id') id: number, @Body('password') password: string, @Body('guardian_id') guardian_id: number){
    return this.guardianService.getStudent(id, password, guardian_id);
  }
}
