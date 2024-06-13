import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { GuardianModule } from './guardian/guardian.module';
import { RegisterAttendanceModule } from './register_attendance/register_attendance.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [AuthModule, EmployeeModule, GuardianModule, RegisterAttendanceModule, AttendanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
