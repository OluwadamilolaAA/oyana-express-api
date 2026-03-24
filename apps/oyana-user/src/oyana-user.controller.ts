import { Controller } from '@nestjs/common';
import { OyanaUserService } from './oyana-user.service';
import {
  CreateUserRequest,
  CreateUserResponse,
  GetUserRequest,
  GetUserResponse,
  UserServiceController,
  UserServiceControllerMethods,
  ValidateUserRequest,
  ValidateUserResponse,
} from '@package/packages';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

@Controller()
@UserServiceControllerMethods()
export class OyanaUserController implements UserServiceController {
  constructor(private readonly oyanaUserService: OyanaUserService) {}

  createUser(
    request: CreateUserRequest,
    metadata?: Metadata,
  ):
    | Promise<CreateUserResponse>
    | Observable<CreateUserResponse>
    | CreateUserResponse {
    return this.oyanaUserService.createUser(request);
  }

  getUser(
    request: GetUserRequest,
    metadata?: Metadata,
  ): Promise<GetUserResponse> | Observable<GetUserResponse> | GetUserResponse {
    return this.oyanaUserService.getUserById(request);
  }

  validateUser(
    request: ValidateUserRequest,
    metadata?: Metadata,
  ):
    | Promise<ValidateUserResponse>
    | Observable<ValidateUserResponse>
    | ValidateUserResponse {
    return this.oyanaUserService.validateUser(request);
  }
}
