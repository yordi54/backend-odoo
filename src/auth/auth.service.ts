import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';

import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(private readonly httpService: HttpService) {}

    private baseUrl = 'https://colegio-mariscal.eastus.cloudapp.azure.com/jsonrpc/';

    hola(): string {
        return 'Hola mundo!';
    }

    async loginOdoo(email: string, password: string) {
        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "common",
                "method": "login",
                "args": ["prueba", email, password]
            }
        };
        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data, { headers: { 'Content-Type': 'application/json' } }));
        return response.data;
        

    }

    async login(email: string, password: string){ 
        try{
            const response = await this.loginOdoo(email, password);
            const verifyEmployee = await this.verifyEmployeeOdoo(response.result, password);
            if (verifyEmployee['result'].length > 0){
                const typeTeacher = verifyEmployee.result[0]['job_id'];
                if( typeTeacher != false &&  typeTeacher[1] === "Profesor" ){
                    console.log(typeTeacher);
                    return verifyEmployee;
                }
            }
            const verifyParent = await this.verifyParentOdoo(response.result, password);
            if (verifyParent['result'].length > 0){
                return verifyParent;
            }
            
            return {
                "result": []
            }
       
            

           
        }catch(error){
            throw new BadRequestException(error);
        }
    }


    async verifyEmployeeOdoo(id: number, password: string){
        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["prueba", id, password, "hr.employee", "search_read", [['user_id', '=', id ]],["name", "schedule_ids", "department_id", "job_id", "work_email", "user_id"]]
            }
        };
        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data, { headers: { 'Content-Type': 'application/json' } }));
        return response.data;

    }

    async verifyParentOdoo(id: number, password: string){
        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["prueba", id, password, "guardian", "search_read", [['user_id', '=', id ]],["name", "lastname", "student_ids", "user_id"]]
            }
        };
        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data, { headers: { 'Content-Type': 'application/json' } }));
        return response.data;
    }




    //////////

    
/* 
    async getUserOdoo(id: number, password: string){
        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["colegio_mariscal", id, password, "res.users", "read", [id],["employee_ids","company_ids","complete_name", "image_1920"]]
            }
        };
        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data, { headers: { 'Content-Type': 'application/json' } }));
        return response.data;
    }

    

    async getSchedulesOdoo(id: number, password: string, teacher_id: number){
        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["colegio_mariscal", id, password, "schedule", "search_read", [["teacher_id", "=",teacher_id ]],[]]
            }
        };
        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data, { headers: { 'Content-Type': 'application/json' } }));
        return response.data;
    }

    async getSchedules(id: number, password: string, teacher_id: number){
        try{
            const response = await this.getSchedulesOdoo(id, password, teacher_id);
            console.log(response);
            return response;

        }catch(error){
            throw new BadRequestException(error);
        }
        
    }


    async getUser(id: number, password: string){
        try{
            const response = await this.getUserOdoo(id, password);
            console.log(response);
            return response;

        }catch(error){
            throw new BadRequestException(error);
        }
    } */
        


}


