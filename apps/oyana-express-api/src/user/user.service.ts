import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { CreateUserResponse, UserServiceClient } from '@package/packages';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService implements OnModuleInit {
  private userService: UserServiceClient;
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.userService =
      this.userClient.getService<UserServiceClient>('UserService');
  }

  async getUser(userId: string) {
    const user = this.userService.getUser({ userId });
    return firstValueFrom(user);
  }

  async createUser(
    email: string,
    password: string,
    name: string,
  ): Promise<CreateUserResponse> {
    return firstValueFrom(
      this.userService.createUser({ email, password, name }),
    );
  }
}
