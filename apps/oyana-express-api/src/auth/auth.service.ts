import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import type { AuthClient, LoginResponse, ValidateTokenResponse } from '@package/packages';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private authClient: AuthClient;

  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.authClient = this.client.getService<AuthClient>('Auth');
  }

  async validateToken(token: string): Promise<ValidateTokenResponse> {
    return firstValueFrom(this.authClient.validateToken({ token }));
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    return firstValueFrom(this.authClient.login(dto));
  }
}
