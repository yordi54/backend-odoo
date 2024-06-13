import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import { parse } from 'path/posix';

@Injectable()
export class RegisterAttendanceService {
    constructor(private readonly httpService: HttpService) { }
    private baseUrl = 'https://colegio-mariscal.eastus.cloudapp.azure.com/jsonrpc/';

    async createRegisterAttendance(id: number, password: String, grade_id: number) {
        const current_date = new Date();
        const formattedDate = current_date.toISOString().slice(0, 10);  // Obtén la fecha en formato 'YYYY-MM-DD'
        const nameWithDate = `Registro Asistencia - ${current_date.toLocaleDateString()}`;
        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["colegio_mariscal", id, password, "register.attendance", "create", {
                    "date": formattedDate,
                    "name": nameWithDate,
                    "grade_id": grade_id
                }]
            }
        };
        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data, { headers: { 'Content-Type': 'application/json' } }));
        return response.data;
    }

    async createAttendance(id: number, password: string, grade_id: number) {
        try {
            const response = await this.createRegisterAttendance(id, password, grade_id);
            console.log(response);
            return response;

        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async getAttendanceByGradeOdoo(id: number, password: string, grade_id: number) {
        /* console.log(response.data);
        if (response.data['result'] != false) {
            console.log(response.data['result']);
            const data = {
                "jsonrpc": "2.0",
                "method": "call",
                "params": {
                    "service": "object",
                    "method": "execute",
                    "args": ["prueba", id, password, "register.attendance", "search_read", [["id", "=", response.data['result']]], []]
                }
            };
            const resp = await firstValueFrom(this.httpService.post(this.baseUrl, data, { headers: { 'Content-Type': 'application/json' } }));
            return resp.data;
        } else {
            console.log("No se pudo registrar la asistencia");
        } */

        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["colegio_mariscal", id, password, "register.attendance", "search_read", [["grade_id", "=", grade_id]], []]
            }
        };

        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data, { headers: { 'Content-Type': 'application/json' } }));
        console.log(response.data);
        return response.data;
    }


    /////ATENDANCES 
    async getAttendancesOdoo(id: number, password: string, register_attendance_id: number) {
        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["colegio_mariscal", id, password, "attendance", "search_read", [["register_attendance_id", "=", register_attendance_id]], ["attended", "leave", "missing", "student_id"]]
            }
        };
        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data, { headers: { 'Content-Type': 'application/json' } }));
        return response.data;
    }


    /// STUDENTS    


    async getAttendancesbyStudentOdoo(id: number, password: string, student_id: Number[]) {
        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["colegio_mariscal", id, password, "student", "search_read", [["id", "in", student_id]], ["photo", "full_name"]]
            }
        };
        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data, { headers: { 'Content-Type': 'application/json' } }));
        return response.data;
    }

    ////LLAMADA COMPLETA

    async getAttendanceByGrade(id: number, password: string, grade_id: number) {
        try {
            const response = await this.getAttendanceByGradeOdoo(id, password, grade_id);
            console.log(response);
            const registerId = response['result'][0]['id'];
            const attendances = await this.getAttendancesOdoo(id, password, registerId);
            const student_ids = attendances['result'].map((attendance) => attendance['student_id'][0]);
            const students = await this.getAttendancesbyStudentOdoo(id, password, student_ids);
            const studentsData = students['result'];
            //añadir campo foto a attendances
            attendances['result'].forEach((attendance) => {
                const student = students['result'].find((student) => student['id'] === attendance['student_id'][0]);
                attendance['student_id'][2] = student['photo'];
            });

            //añadir a register_Attenden lo de attendances
            response['result'][0]['attendances'] = attendances['result'];

            return response;

        } catch (error) {
            throw new BadRequestException(error);
        }
    }


    //actualizar campo de asistencia
    async updateAttendanceOdoo(id: number, password: string, attendance_id: number, attended: boolean, leave: boolean, missing: boolean) {
        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["colegio_mariscal", id, password, "attendance", "write", [attendance_id], {
                    "attended": attended,
                    "leave": leave,
                    "missing": missing
                }]
            }
        };
        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data, { headers: { 'Content-Type': 'application/json' } }));
        return response.data;
    }

    async updateAttendance(id: number, password: string, attendance_id: number, attended: boolean, leave: boolean, missing: boolean) {
        try {
            const response = await this.updateAttendanceOdoo(id, password, attendance_id, attended, leave, missing);
            console.log(response);
            return response;

        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    ///IA

    async generateRegisterAttendanceOdoo(id: number, password: string, register_attendance_id: number) {
        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["colegio_mariscal", id, password, "register.attendance", "search_read", [["id", "=", register_attendance_id]], []]
            }
        };
        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data, { headers: { 'Content-Type': 'application/json' } }));
        return response.data;
    }

    async getAttendanceByRegisterAttendance(id: number, password: string, register_attendance_id: number[]) {
        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["colegio_mariscal", id, password, "attendance", "search_read", [["id", "in", register_attendance_id]], ["attended", "leave", "missing", "student_id"]]
            }
        };

        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data, { headers: { 'Content-Type': 'application/json' } }));
        return response.data;

    }

    async generateAttendance(id: number, password: string, register_attendance_id: number, photo: string) {
        try {
            const response = await this.generateRegisterAttendanceOdoo(id, password, register_attendance_id);

            //traer  la asistencia
            const attendances = response['result'][0]['attendance_ids'];
            const attendanceData = await this.getAttendanceByRegisterAttendance(id, password, attendances);
            //traer los estudiantes
            const student_ids = attendanceData['result'].map((attendance) => attendance['student_id'][0]);
            const students = await this.getAttendancesbyStudentOdoo(id, password, student_ids);
            const studentsData = students['result'];
            
            // Cargar personas en paralelo
        await Promise.all(studentsData.map(async (student) => {
            await this.cargarPerson(student['id'], student['photo']);
        }));

        // Validar asistencias
        const responseFace = await this.recognizeFace(photo);

        await Promise.all(responseFace.map(async (face) => {
            studentsData.forEach(async (student) => {
                if (face['name'] === student['id'].toString()) {
                    const attendance = attendanceData['result'].find((attendance) => attendance['student_id'][0] === student['id']);
                    await this.updateAttendanceOdoo(id, password, attendance['id'], true, false, false);
                }else {
                    const attendance = attendanceData['result'].find((attendance) => attendance['student_id'][0] === student['id']);
                    await this.updateAttendanceOdoo(id, password, attendance['id'], false, false, true);
                }
            });
        }));
        

        // Eliminar personas e imágenes
        await this.deletePersons();
        this.deleteImages();
            
            return {
                "jsonrpc": "2.0",
                "id": null,
                "result": true
            };

        } catch (error) {
            console.log(error);
            throw new BadRequestException(error);
        }

    }

    deleteImages() {
        const directory = path.join(__dirname);
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp']; // Lista de extensiones de imagen

        fs.readdir(directory, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                const extension = path.extname(file).toLowerCase(); // Obtiene la extensión del archivo en minúsculas
                if (imageExtensions.includes(extension)) { // Verifica si la extensión está en la lista de extensiones de imagen
                    const filePath = path.join(directory, file);

                    fs.unlink(filePath, err => {
                        if (err) throw err;
                        console.log(`Deleted image: ${file}`);
                    });
                }
            }
        });
    }

    async cargarPerson(id: number, photo: string) {
        // Convert base64 to file
        const buffer = Buffer.from(photo, 'base64');
        const filePath = path.join(__dirname, `${id}.jpg`);
        fs.writeFileSync(filePath, buffer);
        console.log(`Image saved at: ${filePath}`);

        //luxand

        const formData = new FormData();
        formData.append('name', id.toString());
        formData.append('photos', fs.createReadStream(filePath));
        formData.append('collections', id.toString());
        const response = await firstValueFrom(this.httpService.post('https://api.luxand.cloud/v2/person', formData, {
            headers: {
                ...formData.getHeaders(),
                'token': '7023ac2757454737a7a99da323127512'
            }
        }));
        return response.data;
    }

    //compaara fotos
    async recognizeFace(photo: string) {
        // Convert base64 to file
        const buffer = Buffer.from(photo, 'base64');
        const filePath = path.join(__dirname, `imagen.jpg`);
        fs.writeFileSync(filePath, buffer);
        console.log(`Image saved at: ${filePath}`);

        //luxand

        const formData = new FormData();
        formData.append('photo', fs.createReadStream(filePath));
        const response = await firstValueFrom(this.httpService.post('https://api.luxand.cloud/photo/search/v2', formData, {
            headers: {
                ...formData.getHeaders(),
                'token': '7023ac2757454737a7a99da323127512'
            }
        }));
        return response.data; 
    }

    //delete base de datos
    async deletePersons() {
        const response = await firstValueFrom(this.httpService.delete('https://api.luxand.cloud/person', {
            headers: { 'token': '7023ac2757454737a7a99da323127512' }
        }));
        return response.data;
    }


}






