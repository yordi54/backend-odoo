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

}
