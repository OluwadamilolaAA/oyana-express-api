import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import {
  type AuthenticatedUser,
  CurrentUser,
} from '../auth/decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getUser(@CurrentUser() user: AuthenticatedUser) {
    return this.userService.getUser(user.userId);
  }
}
