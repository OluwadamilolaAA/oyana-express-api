export * from './packages.module';
export * from './packages.service';
export * from './hybrid-service-bootstrap';
export * from './runtime-config';
export * from './validation';
export {
  type AuthController,
  AuthControllerMethods,
  type AuthClient,
} from './generated/auth';
export {
  type UserServiceController,
  UserServiceControllerMethods,
} from './generated/user';
export {
  type DriverServiceController,
  DriverServiceControllerMethods,
} from './generated/driver';
export type {
  GetAuthContextRequest,
  GetAuthContextResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
  RegisterRequest,
  RegisterResponse,
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from './generated/auth';

export type {
  CreateUserRequest,
  CreateUserResponse,
  GetUserRequest,
  GetUserResponse,
  ValidateUserRequest,
  ValidateUserResponse,
  User,
  UserServiceClient,
} from './generated/user';

export type {
  CreateDriverRequest,
  CreateDriverResponse,
  Driver,
  DriverServiceClient,
  GetDriverRequest,
  GetDriverResponse,
  ListDriversRequest,
  ListDriversResponse,
  UpdateDriverRequest,
  UpdateDriverResponse,
} from './generated/driver';
