import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import {
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  RegisterResponse,
  SendOTPResponse,
  VerifyOTPResponse,
} from '@package/packages';
import { RegisterDto } from './dtos/register.dto';
import {
  LoginResponseDto,
  LogoutDto,
  MessageResponseDto,
  RefreshTokenDto,
  RefreshTokenResponseDto,
  RegisterResponseDto,
  SendOtpDto,
  VerifyOtpDto,
  VerifyOtpResponseDto,
} from '../swagger/swagger.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiOkResponse({ type: LoginResponseDto })
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({ type: RegisterResponseDto })
  async register(@Body() dto: RegisterDto): Promise<RegisterResponse> {
    return this.authService.register(dto);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh an access token' })
  @ApiOkResponse({ type: RefreshTokenResponseDto })
  async refreshToken(
    @Body() dto: RefreshTokenDto,
  ): Promise<RefreshTokenResponse> {
    return this.authService.refreshToken(dto.refreshToken, dto.sessionId);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Log out a session' })
  @ApiOkResponse({ type: MessageResponseDto })
  async logout(@Body() dto: LogoutDto): Promise<LogoutResponse> {
    return this.authService.logout(dto.sessionId);
  }

  @Post('send-otp')
  @ApiOperation({ summary: 'Send an OTP to a user' })
  @ApiOkResponse({ type: MessageResponseDto })
  async sendOtp(@Body() dto: SendOtpDto): Promise<SendOTPResponse> {
    return this.authService.sendOtp(dto.userId, dto.type);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify an OTP code' })
  @ApiOkResponse({ type: VerifyOtpResponseDto })
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<VerifyOTPResponse> {
    return this.authService.verifyOtp(dto.userId, dto.code, dto.type);
  }
}
