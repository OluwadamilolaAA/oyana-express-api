import { Inject, Injectable } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { UserServiceClient } from '@package/packages';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
    private userService: UserServiceClient;
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientGrpc,
  ) {}

   onModuleInit(): void {
      this.userService = this.userClient.getService<UserServiceClient>('UserService');
    }

  async getUser(userId: string) {
    const user = this.userService.getUser({userId})
    return firstValueFrom(user);
  }
}
