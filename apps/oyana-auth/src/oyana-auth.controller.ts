import { Controller, Get } from '@nestjs/common';
import { OyanaAuthService } from './oyana-auth.service';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import { AuthController, AuthControllerMethods, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ValidateTokenRequest, ValidateTokenResponse } from '@package/packages';

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
}
