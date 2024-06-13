import { Module } from '@nestjs/common';
import { RegisterAttendanceService } from './register_attendance.service';
import { RegisterAttendanceController } from './register_attendance.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [RegisterAttendanceController],
  providers: [RegisterAttendanceService],
  imports: [HttpModule]
})
export class RegisterAttendanceModule {}
