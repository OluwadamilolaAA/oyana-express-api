import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import type {
  AuthClient,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  RegisterResponse,
  SendOTPResponse,
  VerifyOTPResponse,
  ValidateTokenResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
} from '@package/packages';
import {
  DEFAULT_PORTS,
  getCloudRunGrpcMetadata,
  getGrpcClientAudience,
} from '@package/packages';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { ForgotPasswordDto } from './dtos/forgot_password.dto';
import { ResetPasswordDto } from './dtos/reset_password.dto';

export interface IAuthService {
  login(dto: LoginDto): Promise<LoginResponse>;
  register(dto: RegisterDto): Promise<RegisterResponse>;
  refreshToken(
    refreshToken: string,
    sessionId: string,
  ): Promise<RefreshTokenResponse>;
  logout(sessionId: string): Promise<LogoutResponse>;
  sendOtp(userId: string, type: string): Promise<SendOTPResponse>;
  verifyOtp(
    userId: string,
    code: string,
    type: string,
  ): Promise<VerifyOTPResponse>;
  forgotPassword(dto: ForgotPasswordDto): Promise<ForgotPasswordResponse>;
  resetPassword(dto: ResetPasswordDto): Promise<ResetPasswordResponse>;
  validateToken(token: string): Promise<ValidateTokenResponse>;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private authClient!: AuthClient;
  private readonly authServiceAudience = getGrpcClientAudience(
    'AUTH_GRPC_URL',
    DEFAULT_PORTS.authGrpc,
  );

  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.authClient = this.client.getService<AuthClient>('Auth');
  }

  private async getRequestMetadata() {
    return getCloudRunGrpcMetadata(this.authServiceAudience);
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    return firstValueFrom(
      this.authClient.login(dto, await this.getRequestMetadata()),
    );
  }

  async register(dto: RegisterDto): Promise<RegisterResponse> {
    return firstValueFrom(
      this.authClient.register(dto, await this.getRequestMetadata()),
    );
  }

  async refreshToken(
    refreshToken: string,
    sessionId: string,
  ): Promise<RefreshTokenResponse> {
    return firstValueFrom(
      this.authClient.refreshToken(
        { refreshToken, sessionId },
        await this.getRequestMetadata(),
      ),
    );
  }

  async logout(sessionId: string): Promise<LogoutResponse> {
    return firstValueFrom(
      this.authClient.logout({ sessionId }, await this.getRequestMetadata()),
    );
  }

  async sendOtp(userId: string, type: string): Promise<SendOTPResponse> {
    return firstValueFrom(
      this.authClient.sendOtp(
        { userId, type },
        await this.getRequestMetadata(),
      ),
    );
  }

  async forgotPassword(
    dto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> {
    return firstValueFrom(
      this.authClient.forgotPassword(dto, await this.getRequestMetadata()),
    );
  }

  async resetPassword(dto: ResetPasswordDto): Promise<ResetPasswordResponse> {
    return firstValueFrom(
      this.authClient.resetPassword(dto, await this.getRequestMetadata()),
    );
  }

  async verifyOtp(
    userId: string,
    code: string,
    type: string,
  ): Promise<VerifyOTPResponse> {
    return firstValueFrom(
      this.authClient.verifyOtp(
        { userId, code, type },
        await this.getRequestMetadata(),
      ),
    );
  }

  async validateToken(token: string): Promise<ValidateTokenResponse> {
    return firstValueFrom(
      this.authClient.validateToken({ token }, await this.getRequestMetadata()),
    );
  }
}
