import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import type {
  AuthClient,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  RegisterResponse,
  SendOTPResponse,
  ValidateTokenResponse,
  VerifyOTPResponse,
} from '@package/packages';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private authClient: AuthClient;

  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.authClient = this.client.getService<AuthClient>('Auth');
  }

  async validateToken(token: string): Promise<ValidateTokenResponse> {
    return firstValueFrom(this.authClient.validateToken({ token }));
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    return firstValueFrom(this.authClient.login(dto));
  }

  async register(dto: RegisterDto): Promise<RegisterResponse> {
    return firstValueFrom(this.authClient.register(dto));
  }

  async refreshToken(
    refreshToken: string,
    sessionId: string,
  ): Promise<RefreshTokenResponse> {
    return firstValueFrom(
      this.authClient.refreshToken({ refreshToken, sessionId }),
    );
  }

  async logout(sessionId: string): Promise<LogoutResponse> {
    return firstValueFrom(this.authClient.logout({ sessionId }));
  }

  async sendOtp(userId: string, type: string): Promise<SendOTPResponse> {
    return firstValueFrom(this.authClient.sendOtp({ userId, type }));
  }

  async verifyOtp(
    userId: string,
    code: string,
    type: string,
  ): Promise<VerifyOTPResponse> {
    return firstValueFrom(this.authClient.verifyOtp({ userId, code, type }));
  }
}
