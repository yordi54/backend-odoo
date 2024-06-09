import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('')
    async holaMundo() {
        return this.authService.hola();
    }

    @Post('login')
    async login(@Body('email') email: string, @Body('password') password: string){
        return this.authService.login(email, password);
    }
    @Post('employee')
    async getEmployee(@Body('id') id: number, @Body('password') password: string){
        return this.authService.getEmployee(id, password);
    }

    @Post('schedules')
    async getSchedules(@Body('id') id: number, @Body('password') password: string, @Body('employee_id') employee_id: number ){
        return this.authService.getSchedules(id, password, employee_id);
    }
}