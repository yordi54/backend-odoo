import { Module } from '@nestjs/common';
import { GuardianService } from './guardian.service';
import { GuardianController } from './guardian.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [GuardianController],
  providers: [GuardianService],
  imports: [HttpModule],
})
export class GuardianModule {}
