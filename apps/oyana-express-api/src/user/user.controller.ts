import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  type AuthenticatedUser,
  CurrentUser,
} from '../auth/decorators/user.decorator';
import { CreateUserResponse } from '@package/packages';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateUserDto, UserResponseDto } from '../swagger/swagger.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiBearerAuth('bearer')
  @ApiOkResponse({ type: UserResponseDto })
  async getUser(@CurrentUser() user: AuthenticatedUser) {
    return this.userService.getUser(user.userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiBearerAuth('bearer')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ type: UserResponseDto })
  async getUserById(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ type: UserResponseDto })
  async createUser(@Body() body: CreateUserDto): Promise<CreateUserResponse> {
    return this.userService.createUser(body.email, body.password, body.name);
  }
}
