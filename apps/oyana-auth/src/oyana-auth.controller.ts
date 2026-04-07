import { Controller } from '@nestjs/common';
import { OyanaAuthService } from './services/oyana-auth.service';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
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
} from '@package/packages';

@Controller()
@AuthControllerMethods()
export class OyanaAuthController implements AuthController {
  constructor(private readonly oyanaAuthService: OyanaAuthService) {}

  login(
    request: LoginRequest,
    metadata?: Metadata,
  ): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse {
    void metadata;
    return this.oyanaAuthService.login(request);
  }

  register(
    request: RegisterRequest,
    metadata?: Metadata,
  ):
    | Promise<RegisterResponse>
    | Observable<RegisterResponse>
    | RegisterResponse {
    void metadata;
    return this.oyanaAuthService.register(request);
  }
  validateToken(
    request: ValidateTokenRequest,
    metadata?: Metadata,
  ):
    | Promise<ValidateTokenResponse>
    | Observable<ValidateTokenResponse>
    | ValidateTokenResponse {
    void metadata;
    return this.oyanaAuthService.validateToken(request);
  }

  refreshToken(
    request: RefreshTokenRequest,
    metadata?: Metadata,
  ):
    | Promise<RefreshTokenResponse>
    | Observable<RefreshTokenResponse>
    | RefreshTokenResponse {
    void metadata;
    return this.oyanaAuthService.refreshToken(request);
  }

  logout(
    request: LogoutRequest,
    metadata?: Metadata,
  ): Promise<LogoutResponse> | Observable<LogoutResponse> | LogoutResponse {
    void metadata;
    return this.oyanaAuthService.logout(request);
  }

  sendOtp(
    request: SendOTPRequest,
    metadata?: Metadata,
  ): Promise<SendOTPResponse> | Observable<SendOTPResponse> | SendOTPResponse {
    void metadata;
    return this.oyanaAuthService.sendOtp(request);
  }

  verifyOtp(
    request: VerifyOTPRequest,
    metadata?: Metadata,
  ):
    | Promise<VerifyOTPResponse>
    | Observable<VerifyOTPResponse>
    | VerifyOTPResponse {
    void metadata;
    return this.oyanaAuthService.verifyOtp(request);
  }

  getAuthContext(
    request: GetAuthContextRequest,
    metadata?: Metadata,
  ):
    | Promise<GetAuthContextResponse>
    | Observable<GetAuthContextResponse>
    | GetAuthContextResponse {
    void metadata;
    return this.oyanaAuthService.getAuthContext(request);
  }
}
