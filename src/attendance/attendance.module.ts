import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [AttendanceController],
  providers: [AttendanceService],
  imports: [HttpModule]
})
export class AttendanceModule {}
