import { Controller } from '@nestjs/common';
import { OyanaAuthService } from './services/oyana-auth.service';
import { Metadata } from '@grpc/grpc-js';
import {
  AuthController,
  AuthControllerMethods,
  GetAuthContextRequest,
  GetAuthContextResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  SendOTPRequest,
  SendOTPResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from '@package/packages';

@Controller()
@AuthControllerMethods()
export class OyanaAuthController implements AuthController {
  constructor(private readonly oyanaAuthService: OyanaAuthService) {}

  async login(
    request: LoginRequest,
    metadata?: Metadata,
  ): Promise<LoginResponse> {
    void metadata;
    return this.oyanaAuthService.login(request);
  }

  async register(
    request: RegisterRequest,
    metadata?: Metadata,
  ): Promise<RegisterResponse> {
    void metadata;
    return this.oyanaAuthService.register(request);
  }
  async validateToken(
    request: ValidateTokenRequest,
    metadata?: Metadata,
  ): Promise<ValidateTokenResponse> {
    void metadata;
    return this.oyanaAuthService.validateToken(request);
  }

  async refreshToken(
    request: RefreshTokenRequest,
    metadata?: Metadata,
  ): Promise<RefreshTokenResponse> {
    void metadata;
    return this.oyanaAuthService.refreshToken(request);
  }

  async logout(
    request: LogoutRequest,
    metadata?: Metadata,
  ): Promise<LogoutResponse> {
    void metadata;
    return this.oyanaAuthService.logout(request);
  }

  async sendOtp(
    request: SendOTPRequest,
    metadata?: Metadata,
  ): Promise<SendOTPResponse> {
    void metadata;
    return this.oyanaAuthService.sendOtp(request);
  }

  async verifyOtp(
    request: VerifyOTPRequest,
    metadata?: Metadata,
  ): Promise<VerifyOTPResponse> {
    void metadata;
    return this.oyanaAuthService.verifyOtp(request);
  }

  async resetPassword(
    request: ResetPasswordRequest,
    metadata?: Metadata,
  ): Promise<ResetPasswordResponse> {
    void metadata;
    return this.oyanaAuthService.resetPassword(request);
  }

  async forgotPassword(
    request: ForgotPasswordRequest,
    metadata?: Metadata,
  ): Promise<ForgotPasswordResponse> {
    void metadata;
    return this.oyanaAuthService.forgotPassword(request);
  }

  async getAuthContext(
    request: GetAuthContextRequest,
    metadata?: Metadata,
  ): Promise<GetAuthContextResponse> {
    void metadata;
    return this.oyanaAuthService.getAuthContext(request);
  }
}
