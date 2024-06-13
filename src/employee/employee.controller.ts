import { Body, Controller, Post } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('shedules')
  async getSchedules(@Body('id') id: number, @Body('password') password: string){
      return this.employeeService.getSchedules(id, password);
  }

  @Post('grades')
  async getGrades(@Body('id') id: number, @Body('password') password: string){
      return this.employeeService.getGrades(id, password);
  }
}
