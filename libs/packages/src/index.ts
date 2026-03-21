import { RegisterRequest } from './generated/auth';

export * from './packages.module';
export * from './packages.service';
export { type AuthController, AuthControllerMethods } from './generated/auth';
export {
  type UserServiceController,
  UserServiceControllerMethods,
} from './generated/user';
export type {
  LoginRequest,
  LoginResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
  RegisterRequest,
  RegisterResponse,
} from './generated/auth';

export type {
  CreateUserRequest,
  CreateUserResponse,
  GetUserRequest,
  GetUserResponse,
  ValidateUserRequest,
  ValidateUserResponse,
  User,
} from './generated/user';
