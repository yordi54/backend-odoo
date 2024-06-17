import { Body, Controller, Post } from '@nestjs/common';
import { RegisterAttendanceService } from './register_attendance.service';

@Controller('register-attendance')
export class RegisterAttendanceController {
  constructor(private readonly registerAttendanceService: RegisterAttendanceService) {}

  @Post('get-grades')
    async getGrades(@Body('id') id: number, @Body('password') password: string, @Body('teacher_id') teacher_id: number, @Body('day') day: string){
        return this.registerAttendanceService.getGradeOdoo(id, password, teacher_id, day);
    }




  @Post('create-attendance')
  async createAttendance(@Body('id') id: number, @Body('password') password: string, @Body('grade_id') grade_id: number){
      return this.registerAttendanceService.createAttendance(id, password, grade_id);
  }
  
  @Post('get-attendance')
  async getAttendance(@Body('id') id: number, @Body('password') password: string, @Body('grade_id') grade_id: number){
      return this.registerAttendanceService.getAttendanceByGrade(id, password, grade_id);
  }

  @Post('get-attendance-student')
  async getAttendanceStudent(@Body('id') id: number, @Body('password') password: string, @Body('attendance_id') attendance_id: number,@Body('attended') attended: boolean, @Body('leave') leave: boolean,@Body('missing') missing: boolean){
      return this.registerAttendanceService.updateAttendance(id, password, attendance_id, attended, leave, missing);
  }

  @Post('generate-attendance')
  async generateAttendance(@Body('id') id: number, @Body('password') password: string, @Body('register_attendance_id') register_attendance_id: number, @Body('photo') photo){
      return this.registerAttendanceService.generateAttendance(id, password, register_attendance_id, photo);
  }

}
