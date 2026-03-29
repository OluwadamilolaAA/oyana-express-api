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
    return this.oyanaAuthService.login(request);
  }

  register(
    request: RegisterRequest,
    metadata?: Metadata,
  ):
    | Promise<RegisterResponse>
    | Observable<RegisterResponse>
    | RegisterResponse {
    return this.oyanaAuthService.register(request);
  }
  validateToken(
    request: ValidateTokenRequest,
    metadata?: Metadata,
  ):
    | Promise<ValidateTokenResponse>
    | Observable<ValidateTokenResponse>
    | ValidateTokenResponse {
    return this.oyanaAuthService.validateToken(request);
  }

  refreshToken(
    request: RefreshTokenRequest,
    metadata?: Metadata,
  ):
    | Promise<RefreshTokenResponse>
    | Observable<RefreshTokenResponse>
    | RefreshTokenResponse {
    return this.oyanaAuthService.refreshToken(request);
  }

  logout(
    request: LogoutRequest,
    metadata?: Metadata,
  ):
    | Promise<LogoutResponse>
    | Observable<LogoutResponse>
    | LogoutResponse {
    return this.oyanaAuthService.logout(request);
  }

  sendOtp(
    request: SendOTPRequest,
    metadata?: Metadata,
  ):
    | Promise<SendOTPResponse>
    | Observable<SendOTPResponse>
    | SendOTPResponse {
    return this.oyanaAuthService.sendOtp(request);
  }

  verifyOtp(
    request: VerifyOTPRequest,
    metadata?: Metadata,
  ):
    | Promise<VerifyOTPResponse>
    | Observable<VerifyOTPResponse>
    | VerifyOTPResponse {
    return this.oyanaAuthService.verifyOtp(request);
  }

  getAuthContext(
    request: GetAuthContextRequest,
    metadata?: Metadata,
  ):
    | Promise<GetAuthContextResponse>
    | Observable<GetAuthContextResponse>
    | GetAuthContextResponse {
    return this.oyanaAuthService.getAuthContext(request);
  }
}
