import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [EmployeeController],
  imports: [HttpModule],
  providers: [EmployeeService],
})
export class EmployeeModule {}
