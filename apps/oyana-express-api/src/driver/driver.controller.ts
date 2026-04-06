import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DriverService } from './driver.service';
import {
  type AuthenticatedUser,
  CurrentUser,
} from '../auth/decorators/user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import {
  CreateDriverDto,
  DriverListResponseDto,
  DriverResponseDto,
  UpdateDriverDto,
} from '../swagger/swagger.dto';

@ApiTags('Drivers')
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({
    summary: 'Create a driver profile for the authenticated user',
  })
  @ApiBearerAuth('bearer')
  @ApiCreatedResponse({ type: DriverResponseDto })
  async createDriver(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateDriverDto,
  ) {
    return this.driverService.createDriver(
      user.userId,
      body.vehicleType,
      body.licenceNumber,
    );
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get the authenticated driver profile' })
  @ApiBearerAuth('bearer')
  @ApiOkResponse({ type: DriverResponseDto })
  async getDriver(@CurrentUser() user: AuthenticatedUser) {
    return this.driverService.getDriver(user.userId);
  }

  @UseGuards(AuthGuard)
  @Patch()
  @ApiOperation({ summary: 'Update the authenticated driver profile' })
  @ApiBearerAuth('bearer')
  @ApiOkResponse({ type: DriverResponseDto })
  async updateDriver(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpdateDriverDto,
  ) {
    return this.driverService.updateDriver(
      user.userId,
      body.vehicleType,
      body.licenseNumber,
      body.isAvailable,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List driver profiles' })
  @ApiQuery({ name: 'available', required: false, type: Boolean })
  @ApiOkResponse({ type: DriverListResponseDto })
  async listDrivers(@Query('available') available?: string) {
    const onlyAvailable = available === 'true';
    return this.driverService.listDrivers(onlyAvailable);
  }
}
