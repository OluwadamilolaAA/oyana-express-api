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
import { AuditLogService } from './audit-log.service';
import * as bcrypt from 'bcrypt';
import { SessionService } from './oyana-session.service';
import { AuthEventType } from '../Entities/audit-log.entity';

@Injectable()
export class OyanaAuthService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(
    @Inject('USER_SERVICE') private readonly client: ClientGrpc,
    private readonly jwtService: JwtService,
    private readonly auditLogService: AuditLogService,
    private readonly sessionService: SessionService,
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
      await this.auditLogService.log({
        eventType: AuthEventType.LOGIN_FAILED,
        metadata: { email: request.email },
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    const user = response.user;

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    const session = await this.sessionService.createSession(
      user,
      refreshToken,
      {},
    );

    await this.auditLogService.log({
      userId: user.id,
      eventType: AuthEventType.LOGIN_SUCCESS,
    });

    return {
      accessToken,
      refreshToken,
      sessionId: session.id,
    };
  }


  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const response = await firstValueFrom(
      this.userService.createUser(request),
    );

    if (!response?.user) {
      throw new UnauthorizedException('User registration failed');
    }

    await this.auditLogService.log({
      userId: response.user.id,
      eventType: AuthEventType.CREATE_ACCOUNT,
    });

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
        role: payload.role || '',
  sessionId: payload.sessionId || '',
      };
    } catch (error) {
      await this.auditLogService.log({
        eventType: AuthEventType.LOGIN_FAILED,
        metadata: { reason: 'INVALID_TOKEN' },
      });

      return {
        isValid: false,
        userId: '',
        email: '',
        role: '',
  sessionId: '',
      };
    }
  }


  async logout(sessionId: string) {
    await this.sessionService.revokeSession(sessionId);

    await this.auditLogService.log({
      eventType: AuthEventType.LOGOUT,
      metadata: { sessionId },
    });

    return { message: 'Logged out successfully' };
  }

  async refreshToken(sessionId: string, refreshToken: string) {
    const session = await this.sessionService.validateSession(sessionId);

    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }

    const isMatch = await bcrypt.compare(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = this.generateAccessToken({
      id: session.userId,
    } as User);

    const newRefreshToken = this.generateRefreshToken({
      id: session.userId,
    } as User);

    await this.sessionService.updateRefreshToken(
      session.id,
      newRefreshToken,
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  private generateAccessToken(user: User): string {
    return this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      { expiresIn: '15m' },
    );
  }

  private generateRefreshToken(user: User): string {
    return this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' },
    );
  }
}