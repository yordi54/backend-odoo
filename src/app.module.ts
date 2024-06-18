import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { GuardianModule } from './guardian/guardian.module';
import { RegisterAttendanceModule } from './register_attendance/register_attendance.module';
import { AttendanceModule } from './attendance/attendance.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [AuthModule, EmployeeModule, GuardianModule, RegisterAttendanceModule, AttendanceModule, MulterModule.register({
    dest: './files',
  })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
