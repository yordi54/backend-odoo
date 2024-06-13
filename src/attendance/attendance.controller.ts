import { Body, Controller, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('attendances')
  async getAttendances(@Body('id') id: number, @Body('password') password: string, @Body('register_attendance_id') register_attendance_id: number){
    return this.attendanceService.getAttendanceByStudent(id, password, register_attendance_id);
  }
}
