import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
  User,
} from '@package/packages';
import { UserServiceClient } from '@package/packages/generated/user';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OyanaAuthService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(@Inject('USER_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    
    return { token: 'dummy-token' };
  }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const user = firstValueFrom(this.userService.createUser(request));

    if (!user) {
      throw new Error('User registration failed');
    }
    return { message: 'User registered successfully', status: 'success' };
  }

  async validateToken(
    request: ValidateTokenRequest,
  ): Promise<ValidateTokenResponse> {
    // Implement token validation logic here
    return {
      isValid: true,
      userId: 'dummy-user-id',
      email: 'dummy@example.com',
    };
  }

  private generateToken(user: User): string {
    // Implement token generation logic here
    return 'dummy-token';
  }
}
