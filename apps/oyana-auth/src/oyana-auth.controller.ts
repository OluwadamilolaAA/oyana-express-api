import { Controller } from '@nestjs/common';
import { OyanaAuthService } from './Services/oyana-auth.service';
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
    _metadata?: Metadata,
  ): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse {
    return this.oyanaAuthService.login(request);
  }

  register(
    request: RegisterRequest,
    _metadata?: Metadata,
  ):
    | Promise<RegisterResponse>
    | Observable<RegisterResponse>
    | RegisterResponse {
    return this.oyanaAuthService.register(request);
  }
  validateToken(
    request: ValidateTokenRequest,
    _metadata?: Metadata,
  ):
    | Promise<ValidateTokenResponse>
    | Observable<ValidateTokenResponse>
    | ValidateTokenResponse {
    return this.oyanaAuthService.validateToken(request);
  }

  refreshToken(
    request: RefreshTokenRequest,
    _metadata?: Metadata,
  ):
    | Promise<RefreshTokenResponse>
    | Observable<RefreshTokenResponse>
    | RefreshTokenResponse {
    return this.oyanaAuthService.refreshToken(request);
  }

  logout(
    request: LogoutRequest,
    _metadata?: Metadata,
  ): Promise<LogoutResponse> | Observable<LogoutResponse> | LogoutResponse {
    return this.oyanaAuthService.logout(request);
  }

  sendOtp(
    request: SendOTPRequest,
    _metadata?: Metadata,
  ): Promise<SendOTPResponse> | Observable<SendOTPResponse> | SendOTPResponse {
    return this.oyanaAuthService.sendOtp(request);
  }

  verifyOtp(
    request: VerifyOTPRequest,
    _metadata?: Metadata,
  ):
    | Promise<VerifyOTPResponse>
    | Observable<VerifyOTPResponse>
    | VerifyOTPResponse {
    return this.oyanaAuthService.verifyOtp(request);
  }

  getAuthContext(
    request: GetAuthContextRequest,
    _metadata?: Metadata,
  ):
    | Promise<GetAuthContextResponse>
    | Observable<GetAuthContextResponse>
    | GetAuthContextResponse {
    return this.oyanaAuthService.getAuthContext(request);
  }
}
