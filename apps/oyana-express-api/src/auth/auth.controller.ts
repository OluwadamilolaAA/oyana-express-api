import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { LoginResponse } from '@package/packages';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Add your controller methods here
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(dto);
  }
}
