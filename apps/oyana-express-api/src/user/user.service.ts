import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  CreateUserResponse,
  DEFAULT_PORTS,
  getCloudRunGrpcMetadata,
  getGrpcClientAudience,
  UserServiceClient,
} from '@package/packages';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService implements OnModuleInit {
  private userService!: UserServiceClient;
  private readonly userServiceAudience = getGrpcClientAudience(
    'USER_GRPC_URL',
    DEFAULT_PORTS.userGrpc,
  );

  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.userService =
      this.userClient.getService<UserServiceClient>('UserService');
  }

  private async getRequestMetadata() {
    return getCloudRunGrpcMetadata(this.userServiceAudience);
  }

  async getUser(userId: string) {
    const user = this.userService.getUser(
      { userId },
      await this.getRequestMetadata(),
    );
    return firstValueFrom(user);
  }

  async createUser(
    email: string,
    password: string,
    name: string,
  ): Promise<CreateUserResponse> {
    return firstValueFrom(
      this.userService.createUser(
        { email, password, name },
        await this.getRequestMetadata(),
      ),
    );
  }
}
