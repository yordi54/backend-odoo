import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { AxiosResponse } from 'axios';
import { Observable, catchError, firstValueFrom, map, throwError } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(private readonly httpService: HttpService) {}

    private baseUrl = 'http://localhost:8069/jsonrpc';

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
            console.log(response);
            return response;

        }catch(error){
            throw new BadRequestException(error);
        }
    }

    async getEmployeeOdoo(id: number, password: string){
        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["prueba", id, password, "hr.employee", "search_read", [["user_id", "=",id ]],["resource_id", "company_id", "department_id", "job_id", "work_email", "user_id"]]
            }
        };
        const response = await firstValueFrom(this.httpService.post(this.baseUrl, data, { headers: { 'Content-Type': 'application/json' } }));
        return response.data;
    }

    async getEmployee(id: number, password: string){
        try{
            const response = await this.getEmployeeOdoo(id, password);
            console.log(response);
            return response;

        }catch(error){
            throw new BadRequestException(error);
        }
        
    }

    async getSchedulesOdoo(id: number, password: string, teacher_id: number){
        const data = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "service": "object",
                "method": "execute",
                "args": ["prueba", id, password, "schedule", "search_read", [["teacher_id", "=",teacher_id ]],[]]
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
        


}


