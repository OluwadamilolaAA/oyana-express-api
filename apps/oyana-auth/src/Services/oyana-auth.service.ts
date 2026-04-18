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
  DEFAULT_PORTS,
  GetAuthContextRequest,
  GetAuthContextResponse,
  getCloudRunGrpcMetadata,
  getGrpcClientAudience,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  requireEmail,
  requireNonEmptyString,
  requirePassword,
  SendOTPRequest,
  SendOTPResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  User,
} from '@package/packages';
import { UserServiceClient } from '@package/packages';
import { firstValueFrom } from 'rxjs';
import { AuthEventType } from '../entities/audit-log.entity';
import type { OTPType } from '../entities/verification-otp.entity';
import * as bcrypt from 'bcrypt';
import { MongoRepository } from 'typeorm';
import { AUTH_IDENTITY_REPOSITORY } from '../provider/auth.providers';
import { AuthIdentity } from '../entities/auth.entity';
import { AuditLogService } from './audit-log.service';
import { SessionService } from './oyana-session.service';
import { OTPService } from './generate-otp.service';
import { CredentialService } from './credential.service';

interface AuthTokenPayload {
  sub: string;
  email: string;
  role: string;
  sessionId?: string;
  type: 'access' | 'refresh';
}

@Injectable()
export class OyanaAuthService implements OnModuleInit {
  private userService!: UserServiceClient;
  private readonly userServiceAudience = getGrpcClientAudience(
    'USER_GRPC_URL',
    DEFAULT_PORTS.userGrpc,
  );

  constructor(
    @Inject('USER_SERVICE') private readonly client: ClientGrpc,
    private readonly jwtService: JwtService,
    private readonly auditLogService: AuditLogService,
    private readonly sessionService: SessionService,
    private readonly otpService: OTPService,
    private readonly credentialService: CredentialService,
    @Inject(AUTH_IDENTITY_REPOSITORY)
    private readonly authIdentityRepo: MongoRepository<AuthIdentity>,
  ) {}

  onModuleInit(): void {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }

  private async getUserServiceMetadata() {
    return getCloudRunGrpcMetadata(this.userServiceAudience);
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const emailRaw = request.email ?? '';
    const email = requireEmail(emailRaw);
    const password = requirePassword(request.password);

    const response = await firstValueFrom(
      this.userService.validateUser(
        {
          email,
          password,
        },
        await this.getUserServiceMetadata(),
      ),
    );

    if (!response?.user) {
      await this.auditLogService.log({
        eventType: AuthEventType.LOGIN_FAILED,
        metadata: { email },
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    const user = response.user;
    const refreshToken = this.generateRefreshToken(user.id);

    const session = await this.sessionService.createSession(
      user,
      refreshToken,
      {},
    );

    const accessToken = this.generateAccessToken(user, session.id);

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
    const email = requireEmail(request.email);
    const password = requirePassword(request.password);
    const name = requireNonEmptyString(request.name, 'Name');

    const response = await firstValueFrom(
      this.userService.createUser(
        {
          email,
          password,
          name,
        },
        await this.getUserServiceMetadata(),
      ),
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
      const token = requireNonEmptyString(request.token, 'Token');
      const payload = this.jwtService.verify<AuthTokenPayload>(token);

      if (payload.type !== 'access') {
        return this.invalidTokenResponse();
      }

      if (payload.sessionId) {
        const session = await this.sessionService.validateSession(
          payload.sessionId,
        );

        if (!session || session.userId !== payload.sub) {
          return this.invalidTokenResponse();
        }
      }

      return {
        isValid: true,
        userId: payload.sub,
        email: payload.email,
        role: payload.role || '',
        sessionId: payload.sessionId || '',
      };
    } catch {
      await this.auditLogService.log({
        eventType: AuthEventType.LOGIN_FAILED,
        metadata: { reason: 'INVALID_TOKEN' },
      });

      return this.invalidTokenResponse();
    }
  }

  async refreshToken(
    request: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    const sessionId = requireNonEmptyString(request.sessionId, 'Session id');
    const refreshToken = requireNonEmptyString(
      request.refreshToken,
      'Refresh token',
    );

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

    const user = await this.getUserById(session.userId);
    const newRefreshToken = this.generateRefreshToken(session.userId);

    await this.sessionService.updateRefreshToken(session.id, newRefreshToken);

    return {
      accessToken: this.generateAccessToken(user, session.id),
      refreshToken: newRefreshToken,
    };
  }

  async logout(request: LogoutRequest): Promise<LogoutResponse> {
    const sessionId = requireNonEmptyString(request.sessionId, 'Session id');

    await this.sessionService.revokeSession(sessionId);

    await this.auditLogService.log({
      eventType: AuthEventType.LOGOUT,
      metadata: { sessionId },
    });

    return { message: 'Logged out successfully' };
  }

  async sendOtp(request: SendOTPRequest): Promise<SendOTPResponse> {
    const userId = requireNonEmptyString(request.userId, 'User id');
    const otpType = this.normalizeOtpType(request.type);

    await this.otpService.generateOTP(userId, otpType);

    await this.auditLogService.log({
      userId,
      eventType: AuthEventType.PASSWORD_RESET_REQUESTED,
      metadata: { type: otpType },
    });

    return {
      message: 'OTP generated successfully',
    };
  }

  async verifyOtp(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    const userId = requireNonEmptyString(request.userId, 'User id');
    const code = requireNonEmptyString(request.code, 'OTP code');
    const otpType = this.normalizeOtpType(request.type);

    const verified = await this.otpService.verifyOTP(userId, code, otpType);

    return { verified };
  }

  async resetPassword(
    request: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> {
    const email = requireEmail(request.email);
    const code = requireNonEmptyString(request.code, 'OTP code');
    const newPassword = requirePassword(request.newPassword);

    const identity = await this.authIdentityRepo.findOne({ where: { email } });

    if (!identity) {
      throw new BadRequestException('User not found');
    }

    await this.otpService.verifyOTP(identity.userId, code, 'PASSWORD_RESET');

    await this.credentialService.updatePasswordCredential(
      identity.userId,
      newPassword,
    );

    await this.auditLogService.log({
      userId: identity.userId,
      eventType: AuthEventType.PASSWORD_RESET_REQUESTED,
      metadata: { method: 'reset' },
    });

    return { message: 'Password reset successfully', status: 'success' };
  }

  async forgotPassword(
    request: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    const email = requireEmail(request.email);

    const identity = await this.authIdentityRepo.findOne({ where: { email } });

    if (!identity) {
      return { message: 'If the account exists, an OTP has been sent' };
    }

    await this.otpService.generateOTP(identity.userId, 'PASSWORD_RESET');

    await this.auditLogService.log({
      userId: identity.userId,
      eventType: AuthEventType.PASSWORD_RESET_REQUESTED,
      metadata: { email },
    });

    return { message: 'If the account exists, an OTP has been sent' };
  }

  async getAuthContext(
    request: GetAuthContextRequest,
  ): Promise<GetAuthContextResponse> {
    return this.validateToken({ token: request.token });
  }

  private async getUserById(userId: string): Promise<User> {
    const response = await firstValueFrom(
      this.userService.getUser({ userId }, await this.getUserServiceMetadata()),
    );

    if (!response.user) {
      throw new UnauthorizedException('User not found');
    }

    return response.user;
  }

  private generateAccessToken(user: User, sessionId: string): string {
    return this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        sessionId,
        type: 'access',
      } satisfies AuthTokenPayload,
      { expiresIn: '15m' },
    );
  }

  private generateRefreshToken(userId: string): string {
    return this.jwtService.sign(
      {
        sub: userId,
        email: '',
        role: '',
        type: 'refresh',
      } satisfies AuthTokenPayload,
      { expiresIn: '7d' },
    );
  }

  private normalizeOtpType(type: string): OTPType {
    const normalizedType = requireNonEmptyString(
      type,
      'OTP type',
    ).toUpperCase();

    if (
      normalizedType !== 'EMAIL_VERIFICATION' &&
      normalizedType !== 'PHONE_VERIFICATION' &&
      normalizedType !== 'PASSWORD_RESET'
    ) {
      throw new BadRequestException('Unsupported OTP type');
    }

    return normalizedType as OTPType;
  }

  private invalidTokenResponse(): ValidateTokenResponse {
    return {
      isValid: false,
      userId: '',
      email: '',
      role: '',
      sessionId: '',
    };
  }
}
