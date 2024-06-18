import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
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


    ////////////

    async getStudentOdoo(id: number, password: String, guardian_id: number) {
        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["prueba", id, password, "student", "search_read", [["guardian_ids", "in", guardian_id]], ["name", "lastname"]]
            }
        }
        //comunicados
        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data));
        return response.data;

    }

    async getStudent(id: number, password: String, guardina_id: number) {
        try {
            const response = await this.getStudentOdoo(id, password, guardina_id);
            console.log(response);
            return response;

        }
        catch (error) {
            throw new BadRequestException(error);
        }

    }

    async getPeriodOdoo(id: number, password: String) {

        

        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["prueba", id, password, "period", "search_read", [], ["name", "management_id"]]
            }
        }
        //comunicados
        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data));
        return response.data;
    }

    async getPeriod(id: number, password: String) {
        try {
            const response = await this.getPeriodOdoo(id, password);
            console.log(response);
            //quitar los que no son de este año
            return response;
        }catch (error) {
            throw new BadRequestException(error);
        }
    }

    //get boletin
    async getBoletinOdoo(id: number, password: String, student_id: number, period_id: number) {
            
            const data = {
                "jsonrpc": "2.0",
                "method": "call",
                "params": {
                    "service": "object",
                    "method": "execute",
                    "args": ["prueba", id, password, "report.card", "search_read", [["student_id", "=", student_id], ["period_id", "=", period_id]], ["mark_ids"]]
                }
            }
            const response = await firstValueFrom(this.httpService.post(this.baseUrl, data));
            return response.data;
    }

    async getMarksByOdoo(id: number, password: String, marks_id: number[] ) {
                
                const data = {
                    "jsonrpc": "2.0",
                    "method": "call",
                    "params": {
                        "service": "object",
                        "method": "execute",
                        "args": ["prueba", id, password, "mark", "search_read", [["id", "in", marks_id]], ["number", "subject_id"]]
                    }
                }
                const response = await firstValueFrom(this.httpService.post(this.baseUrl, data));
                return response.data;

    }

    async getReportMark(id: number, password: String, student_id: number, period_id: number) {
        try {
            const response = await this.getBoletinOdoo(id, password, student_id, period_id);
            const marks_id = [];
            response['result'][0]['mark_ids'].forEach(async (element) => {
                marks_id.push(element);
            });
            const marks = await this.getMarksByOdoo(id, password, marks_id);
            console.log(marks);
            return marks;
        }catch (error) {
            throw new BadRequestException(error);
        }
    }





}
