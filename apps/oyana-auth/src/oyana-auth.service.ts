import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
import { UserServiceClient } from '@package/packages';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OyanaAuthService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(
    @Inject('USER_SERVICE') private readonly client: ClientGrpc,
    private readonly jwtService: JwtService,
  ) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await firstValueFrom(
      this.userService.validateUser({
        email: request.email,
        password: request.password,
      }),
    );

    if (!response?.user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(response.user);

    return { token };
  }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const response = await firstValueFrom(this.userService.createUser(request));

    if (!response?.user) {
      throw new UnauthorizedException('User registration failed');
    }

    return {
      message: 'User registered successfully',
      status: 'success',
    };
  }

  async validateToken(
    request: ValidateTokenRequest,
  ): Promise<ValidateTokenResponse> {
    try {
      const payload = this.jwtService.verify(request.token);

      return {
        isValid: true,
        userId: payload.sub,
        email: payload.email,
      };
    } catch (error) {
      return {
        isValid: false,
        userId: '',
        email: '',
      };
    }
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }
}
