import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AttendanceService {
    constructor(private readonly httpService: HttpService) { }
    private baseUrl = 'http://localhost:8069/jsonrpc';

    async getAttendancesOdoo(id: number, password: string, register_attendance_id: number) {
        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["prueba", id, password, "attendance", "search_read", [["register_attendance_id", "=", register_attendance_id]], ["attended", "leave", "missing","student_id"]]
            }
        };
        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data, { headers: { 'Content-Type': 'application/json' } }));
        return response.data;
    }

    async getAttendancesbyStudentOdoo(id: number, password: string, student_id: Number[] ) {
        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["prueba", id, password, "student", "search_read", [["id", "in", student_id]], ["photo"]]
            }
        };
        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data, { headers: { 'Content-Type': 'application/json' } }));
        return response.data;
    }

    async getAttendanceByStudent(id: number, password: string, register_attendance_id: number) {
        try {
            const response = await this.getAttendancesOdoo(id, password, register_attendance_id);
            console.log(response['result']);
            const student_ids = response['result'].map((attendance) => attendance['student_id'][0]);
            //console.log(student_ids);
            const students = await this.getAttendancesbyStudentOdoo(id, password, student_ids);
            //console.log(students['result']);

            //agregar foto a la respuesta de asistencia student_ids
            response['result'].forEach((attendance) => {
                const student = students['result'].find((student) => student['id'] === attendance['student_id'][0]);
                attendance['student_id'][2] = student['photo'];
            });
            console.log(response['result']);
            return response;

        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}
    
