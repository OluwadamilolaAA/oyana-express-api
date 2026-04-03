import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { DriverService } from './driver.service';
import {
  type AuthenticatedUser,
  CurrentUser,
} from '../auth/decorators/user.decorator';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  async createDriver(
    @CurrentUser() user: AuthenticatedUser,
    @Body()
    body: { vehicleType: string; licenceNumber: string },
  ) {
    return this.driverService.createDriver(
      user.userId,
      body.vehicleType,
      body.licenceNumber,
    );
  }

  @Get('me')
  async getDriver(@CurrentUser() user: AuthenticatedUser) {
    return this.driverService.getDriver(user.userId);
  }

  @Patch()
  async updateDriver(
    @CurrentUser() user: AuthenticatedUser,
    @Body()
    body: {
      vehicleType: string;
      licenseNumber: string;
      isAvailable: boolean;
    },
  ) {
    return this.driverService.updateDriver(
      user.userId,
      body.vehicleType,
      body.licenseNumber,
      body.isAvailable,
    );
  }

  @Get()
  async listDrivers(@Query('available') available?: string) {
    const onlyAvailable = available === 'true';
    return this.driverService.listDrivers(onlyAvailable);
  }
}
