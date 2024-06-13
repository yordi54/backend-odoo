import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GuardianService {
    constructor(private readonly httpService: HttpService) { }
    private baseUrl = 'https://colegio-mariscal.eastus.cloudapp.azure.com/jsonrpc/';

    async geAnnouncementOdoo(id: number, password: String) {

        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["colegio_mariscal", id, password, "announcement", "search_read", [], []]
            }
        }
        //comunicados
        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data));

        return response.data;

    }
    ////////////////////////////////////////////
    async gradeOdoo(id: number, password: String, cycleIds: Number[]) {

        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["colegio_mariscal", id, password, "grade", "search_read", [], ['name', 'enrollment_ids', 'cycle_id']]
            }
        }
        //comunicados
        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data));
        const grades = response.data['result'];
        const gradesFiltered = [];
        grades.forEach(async (element) => {
            if (cycleIds.includes(element['cycle_id'][0])) {
                gradesFiltered.push(element);
            }
        });
        //añadir a response de comunicados
        response.data['result'] = gradesFiltered;
        return response.data;

    }
    async enrollmentOdoo(id: number, password: String, enrollmentIds: Number[]) {

        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["colegio_mariscal", id, password, "enrollment", "search_read", [["id", "in", enrollmentIds]], []]
            }
        }
        //comunicados
        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data));
        return response.data;

    }

    async getStudents(id: number, password: String, student_ids: number[]) {
            
            const data = {
                "jsonrpc": "2.0",
                "method": "call",
                "params": {
                    "service": "object",
                    "method": "execute",
                    "args": ["colegio_mariscal", id, password, "student", "search_read", [["id", "in", student_ids]], []]
                }
            }
            //comunicados
            const response = await firstValueFrom(this.httpService.post(this.baseUrl, data));
            return response.data;
    }

    async getAnnouncementByGuardians(id: number, password: String, student_ids: number[]) {

        try {
            const announcements = await this.geAnnouncementOdoo(id, password);
            const filteredAnnouncements = [];

            announcements['result'].forEach(async (element) => {
                if (element['state'] === 'cycle') {
                    const respGrades = await this.gradeOdoo(id, password, element['cycle_ids']);
                    const enrollmentsIds = [];
                    respGrades['result'].forEach(async (element) => {
                        element['enrollment_ids'].forEach(async (enrollment) => {
                            enrollmentsIds.push(enrollment);
                        });
                    });

                    const enrollments = await this.enrollmentOdoo(id, password, enrollmentsIds);
                    const student_ids = [];
                    enrollments['result'].forEach(async (element) => {
                        element['student_ids'].forEach(async (student) => {
                            student_ids.push(student);
                        });
                    });
                    const students = await this.getStudents(id, password, student_ids);
                    if (students['result'].length > 0) {
                        filteredAnnouncements.push(element);
                    }
                    //console.log(enrollments['result'][0]['student_ids']);
                }
            });
            console.log(announcements);

        } catch (error) {
        }

    }

}
