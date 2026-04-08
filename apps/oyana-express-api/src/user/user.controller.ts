import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserResponseDto } from '../swagger/swagger.dto';
import {
  UpdateUserProfileDto,
  UpsertEmergencyContactDto,
  UpsertKycProfileDto,
  UpsertUserAddressDto,
  UpsertUserPreferenceDto,
} from './dtos/user.dto';
import {
  DeleteEmergencyContactResponse,
  DeleteUserAddressResponse,
  GetKycProfileResponse,
  GetUserPreferenceResponse,
  GetUserResponse,
  ListEmergencyContactsResponse,
  ListUserAddressesResponse,
  UpdateUserProfileResponse,
  UpsertEmergencyContactResponse,
  UpsertKycProfileResponse,
  UpsertUserAddressResponse,
  UpsertUserPreferenceResponse,
} from '@package/packages/generated/user';

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
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ type: UserResponseDto })
  async getUserById(@Param('id') id: string): Promise<GetUserResponse> {
    return this.userService.getUser(id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update the authenticated user profile' })
  async updateMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateUserProfileDto,
  ): Promise<UpdateUserProfileResponse> {
    return this.userService.updateUserProfile(user.userId, dto);
  }

  @Get('me/addresses')
  @ApiOperation({ summary: 'List authenticated user addresses' })
  async listMyAddresses(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ListUserAddressesResponse> {
    return this.userService.listUserAddresses(user.userId);
  }

  @Post('me/addresses')
  @ApiOperation({ summary: 'Create a new address for authenticated user' })
  async createMyAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpsertUserAddressDto,
  ): Promise<UpsertUserAddressResponse> {
    return this.userService.createUserAddress(user.userId, dto);
  }

  @Patch('me/addresses/:addressId')
  @ApiOperation({ summary: 'Update an address for authenticated user' })
  @ApiParam({ name: 'addressId', description: 'Address ID' })
  async updateMyAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Param('addressId') addressId: string,
    @Body() dto: UpsertUserAddressDto,
  ): Promise<UpsertUserAddressResponse> {
    return this.userService.updateUserAddress(user.userId, addressId, dto);
  }

  @Delete('me/addresses/:addressId')
  @ApiOperation({ summary: 'Delete an address for authenticated user' })
  @ApiParam({ name: 'addressId', description: 'Address ID' })
  async deleteMyAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Param('addressId') addressId: string,
  ): Promise<DeleteUserAddressResponse> {
    return this.userService.deleteUserAddress(user.userId, addressId);
  }

  @Get('me/preferences')
  @ApiOperation({ summary: 'Get authenticated user preferences' })
  async getMyPreferences(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<GetUserPreferenceResponse> {
    return this.userService.getUserPreference(user.userId);
  }

  @Put('me/preferences')
  @ApiOperation({ summary: 'Create or update authenticated user preferences' })
  async upsertMyPreferences(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpsertUserPreferenceDto,
  ): Promise<UpsertUserPreferenceResponse> {
    return this.userService.upsertUserPreference(user.userId, dto);
  }

  @Get('me/emergency-contacts')
  @ApiOperation({ summary: 'List authenticated user emergency contacts' })
  async listMyEmergencyContacts(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ListEmergencyContactsResponse> {
    return this.userService.listEmergencyContacts(user.userId);
  }

  @Post('me/emergency-contacts')
  @ApiOperation({
    summary: 'Create a new emergency contact for authenticated user',
  })
  async createMyEmergencyContact(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpsertEmergencyContactDto,
  ): Promise<UpsertEmergencyContactResponse> {
    return this.userService.createEmergencyContact(user.userId, dto);
  }

  @Patch('me/emergency-contacts/:contactId')
  @ApiOperation({
    summary: 'Update an emergency contact for authenticated user',
  })
  @ApiParam({ name: 'contactId', description: 'Emergency contact ID' })
  async updateMyEmergencyContact(
    @CurrentUser() user: AuthenticatedUser,
    @Param('contactId') contactId: string,
    @Body() dto: UpsertEmergencyContactDto,
  ): Promise<UpsertEmergencyContactResponse> {
    return this.userService.updateEmergencyContact(user.userId, contactId, dto);
  }

  @Delete('me/emergency-contacts/:contactId')
  @ApiOperation({
    summary: 'Delete an emergency contact for authenticated user',
  })
  @ApiParam({ name: 'contactId', description: 'Emergency contact ID' })
  async deleteMyEmergencyContact(
    @CurrentUser() user: AuthenticatedUser,
    @Param('contactId') contactId: string,
  ): Promise<DeleteEmergencyContactResponse> {
    return this.userService.deleteEmergencyContact(user.userId, contactId);
  }

  @Get('me/kyc-profile')
  @ApiOperation({ summary: 'Get authenticated user KYC profile' })
  async getMyKycProfile(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<GetKycProfileResponse> {
    return this.userService.getKycProfile(user.userId);
  }

  @Put('me/kyc-profile')
  @ApiOperation({ summary: 'Create or update authenticated user KYC profile' })
  async upsertMyKycProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpsertKycProfileDto,
  ): Promise<UpsertKycProfileResponse> {
    return this.userService.upsertKycProfile(user.userId, dto);
  }
}
