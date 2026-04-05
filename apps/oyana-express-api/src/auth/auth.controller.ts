import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import {
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  RegisterResponse,
  SendOTPResponse,
  ValidateTokenResponse,
  VerifyOTPResponse,
} from '@package/packages';
import { RegisterDto } from './dtos/register.dto';
import { ref } from 'process';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Add your controller methods here
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(dto);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<RegisterResponse> {
    return this.authService.register(dto);
  }

  @Post('validate-token')
  async validateToken(
    @Body('token') token: string,
  ): Promise<ValidateTokenResponse> {
    return this.authService.validateToken(token);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
    @Body('sessionId') sessionId: string,
  ): Promise<RefreshTokenResponse> {
    return this.authService.refreshToken(refreshToken, sessionId);
  }

  @Post('logout')
  async logout(@Body('sessionId') sessionId: string): Promise<LogoutResponse> {
    return this.authService.logout(sessionId);
  }

  @Post('send-otp')
  async sendOtp(
    @Body('userId') userId: string,
    @Body('type') type: string,
  ): Promise<SendOTPResponse> {
    return this.authService.sendOtp(userId, type);
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body('userId') userId: string,
    @Body('code') code: string,
    @Body('type') type: string,
  ): Promise<VerifyOTPResponse> {
    return this.authService.verifyOtp(userId, code, type);
  }
}
