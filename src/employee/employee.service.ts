import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EmployeeService {
    constructor(private readonly httpService: HttpService) { }
    private baseUrl = 'https://colegio-mariscal.eastus.cloudapp.azure.com/jsonrpc/';

    async getEmployeeOdoo(id: number, password: string) {
        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["prueba", id, password, "hr.employee", "search_read", [["user_id", "=", id]], ["name", "schedule_ids", "department_id", "job_id", "work_email", "user_id"]]
            }
        };
        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data, { headers: { 'Content-Type': 'application/json' } }));
        const employee = response.data.result[0];
        const employeeId = employee['id'];
        if (employee['schedule_ids'].length > 0) {
            const schedules = employee['schedule_ids'];
            //console.log(schedules);
            const scheduleData = {
                "jsonrpc": "2.0",
                "method": "call",
                "params": {
                    "service": "object",
                    "method": "execute",
                    "args": ["prueba", id, password, "schedule", "search_read", [["teacher_id", "=", employeeId]], ["start_time", "end_time", "day", "subject_id", "classroom_id", "grade_id"]]
                }
            };
            const scheduleResponse = await firstValueFrom(this.httpService.post(this.baseUrl, scheduleData, { headers: { 'Content-Type': 'application/json' } }));
            return scheduleResponse.data;

        } else {
            console.log("No hay horarios");
        }


    }

    async getSchedules(id: number, password: string) {
        try {
            const response = await this.getEmployeeOdoo(id, password);
            console.log(response);
            return response;

        } catch (error) {
            throw new BadRequestException(error);
        }

    }


    async getGradeOdoo(id: number, password: string) {
        try {
            const response = await this.getEmployeeOdoo(id, password);
            console.log(response);
            const employee = response.result;
            const grade_ids = employee.map((employee) => employee['grade_id'][0]);
            console.log(grade_ids);
            if (employee.length > 0) {
                const gradesData = {
                    "jsonrpc": "2.0",
                    "method": "call",
                    "params": {
                        "service": "object",
                        "method": "execute",
                        "args": ["colegio_mariscal", id, password, "grade", "search_read", [["id", "in", grade_ids]], ["name", "parallel_id","cycle_id","register_attendance_ids"]]
                    }
                };
                const gradeResponse = await firstValueFrom(this.httpService.post(this.baseUrl, gradesData, { headers: { 'Content-Type': 'application/json' } }));
                return gradeResponse.data;
            } else {
                console.log("No hay grados");
            }

        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async getGrades(id: number, password: string) {
        try {
            const response = await this.getGradeOdoo(id, password);
            console.log(response);
            return response;

        } catch (error) {
            throw new BadRequestException(error);
        }

    }

}
