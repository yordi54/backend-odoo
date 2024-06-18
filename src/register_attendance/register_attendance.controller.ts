import { Body, Controller, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RegisterAttendanceService } from './register_attendance.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('register-attendance')
export class RegisterAttendanceController {
  constructor(private readonly registerAttendanceService: RegisterAttendanceService) {}

  @Post('get-grades')
    async getGrades(@Body('id') id: number, @Body('password') password: string, @Body('teacher_id') teacher_id: number){
        return this.registerAttendanceService.getGradeOdoo(id, password, teacher_id);
    }

    @Post('get-register-attendance')
    async getRegisterAttendance(@Body('id') id: number, @Body('password') password: string, @Body('grade_id') grade_id: number){
        return this.registerAttendanceService.getRegisterAttendance(id, password, grade_id);
    }

    @Post('get-attendance')
    async getAttendanceByRegister(@Body('id') id: number, @Body('password') password: string, @Body('register_attendance_id') register_attendance_id: number){
        return this.registerAttendanceService.getAttendance(id, password, register_attendance_id);
    }

    @Post('image-upload')
    @UseInterceptors(FileInterceptor('file'))
    async imagenUpload(@Body('id',ParseIntPipe) id: number, @Body('password') password: string, @Body('register_attendance_id',ParseIntPipe) register_attendance_id, @UploadedFile() file: Express.Multer.File){
        return this.registerAttendanceService.uploadImageIA(id, password, register_attendance_id, file);
    }

    ////



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
