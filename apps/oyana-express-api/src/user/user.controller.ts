import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  type AuthenticatedUser,
  CurrentUser,
} from '../auth/decorators/user.decorator';
import { CreateUserResponse } from '@package/packages';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async getUser(@CurrentUser() user: AuthenticatedUser) {
    return this.userService.getUser(user.userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Post()
  async createUser(
    @Body() body: { email: string; password: string; name: string },
  ): Promise<CreateUserResponse> {
    return this.userService.createUser(body.email, body.password, body.name);
  }
}
