import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
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
  DriverListResponseDto,
  DriverResponseDto,
  UpdateDriverDto,
} from '../swagger/swagger.dto';
import { UpdateDriverResponse } from '@package/packages';
import {
  AssignVehicleResponse,
  GetDriverProfileResponse,
  GetDriverStatusResponse,
  ListDriverDocumentsResponse,
  ListVehiclesResponse,
  ListVehicleTypesResponse,
  ReviewDriverResponse,
  UnassignVehicleResponse,
  UpdateDriverProfileResponse,
  UpsertDriverDocumentResponse,
  UpsertDriverStatusResponse,
  UpsertVehicleResponse,
  UpsertVehicleTypeResponse,
} from '@package/packages/generated/driver';
import {
  AssignVehicleDto,
  ListVehiclesQueryDto,
  ListVehicleTypesQueryDto,
  ReviewDriverDto,
  UnassignVehicleDto,
  UpdateDriverProfileDto,
  UpsertDriverDocumentDto,
  UpsertDriverStatusDto,
  UpsertVehicleDto,
  UpsertVehicleTypeDto,
} from './dtos/driver.dto';

@ApiTags('Drivers')
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

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
    @Body() dto: UpdateDriverDto,
  ): Promise<UpdateDriverResponse> {
    return this.driverService.updateDriver(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List driver profiles' })
  @ApiQuery({ name: 'available', required: false, type: Boolean })
  @ApiOkResponse({ type: DriverListResponseDto })
  async listDrivers(@Query('available') available?: string) {
    const onlyAvailable = available === 'true';
    return this.driverService.listDrivers(onlyAvailable);
  }

  @UseGuards(AuthGuard)
  @Get('me/profile')
  @ApiOperation({ summary: 'Get authenticated driver extended profile' })
  @ApiBearerAuth('bearer')
  async getMyDriverProfile(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<GetDriverProfileResponse> {
    return this.driverService.getDriverProfileByUserId(user.userId);
  }

  @Get(':driverId/profile')
  @ApiOperation({ summary: 'Get driver extended profile by driver ID' })
  @ApiParam({ name: 'driverId', description: 'Driver ID' })
  async getDriverProfile(
    @Param('driverId') driverId: string,
  ): Promise<GetDriverProfileResponse> {
    return this.driverService.getDriverProfileByDriverId(driverId);
  }

  @UseGuards(AuthGuard)
  @Patch('me/profile/:profileId')
  @ApiOperation({ summary: 'Update authenticated driver extended profile' })
  @ApiBearerAuth('bearer')
  @ApiParam({ name: 'profileId', description: 'Driver profile ID' })
  async updateMyDriverProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Param('profileId') profileId: string,
    @Body() dto: UpdateDriverProfileDto,
  ): Promise<UpdateDriverProfileResponse> {
    return this.driverService.updateDriverProfile(profileId, user.userId, dto);
  }

  @Post(':driverId/review')
  @ApiOperation({ summary: 'Review a driver profile' })
  @ApiParam({ name: 'driverId', description: 'Driver ID' })
  async reviewDriver(
    @Param('driverId') driverId: string,
    @Body() dto: ReviewDriverDto,
  ): Promise<ReviewDriverResponse> {
    return this.driverService.reviewDriver(driverId, dto);
  }

  @Get(':driverId/status')
  @ApiOperation({ summary: 'Get driver status' })
  @ApiParam({ name: 'driverId', description: 'Driver ID' })
  async getDriverStatus(
    @Param('driverId') driverId: string,
  ): Promise<GetDriverStatusResponse> {
    return this.driverService.getDriverStatus(driverId);
  }

  @Put(':driverId/status')
  @ApiOperation({ summary: 'Create or update driver status' })
  @ApiParam({ name: 'driverId', description: 'Driver ID' })
  async upsertDriverStatus(
    @Param('driverId') driverId: string,
    @Body() dto: UpsertDriverStatusDto,
    @Query('statusId') statusId?: string,
  ): Promise<UpsertDriverStatusResponse> {
    return this.driverService.upsertDriverStatus(driverId, statusId, dto);
  }

  @Get(':driverId/documents')
  @ApiOperation({ summary: 'List driver documents' })
  @ApiParam({ name: 'driverId', description: 'Driver ID' })
  async listDriverDocuments(
    @Param('driverId') driverId: string,
  ): Promise<ListDriverDocumentsResponse> {
    return this.driverService.listDriverDocuments(driverId);
  }

  @Post(':driverId/documents')
  @ApiOperation({ summary: 'Create driver document' })
  @ApiParam({ name: 'driverId', description: 'Driver ID' })
  async createDriverDocument(
    @Param('driverId') driverId: string,
    @Body() dto: UpsertDriverDocumentDto,
  ): Promise<UpsertDriverDocumentResponse> {
    return this.driverService.upsertDriverDocument(driverId, undefined, dto);
  }

  @Patch(':driverId/documents/:documentId')
  @ApiOperation({ summary: 'Update driver document' })
  @ApiParam({ name: 'driverId', description: 'Driver ID' })
  @ApiParam({ name: 'documentId', description: 'Document ID' })
  async updateDriverDocument(
    @Param('driverId') driverId: string,
    @Param('documentId') documentId: string,
    @Body() dto: UpsertDriverDocumentDto,
  ): Promise<UpsertDriverDocumentResponse> {
    return this.driverService.upsertDriverDocument(driverId, documentId, dto);
  }

  @Get('vehicle-types')
  @ApiOperation({ summary: 'List vehicle types' })
  async listVehicleTypes(
    @Query() query: ListVehicleTypesQueryDto,
  ): Promise<ListVehicleTypesResponse> {
    return this.driverService.listVehicleTypes(query);
  }

  @Post('vehicle-types')
  @ApiOperation({ summary: 'Create vehicle type' })
  async createVehicleType(
    @Body() dto: UpsertVehicleTypeDto,
  ): Promise<UpsertVehicleTypeResponse> {
    return this.driverService.upsertVehicleType(undefined, dto);
  }

  @Patch('vehicle-types/:vehicleTypeId')
  @ApiOperation({ summary: 'Update vehicle type' })
  @ApiParam({ name: 'vehicleTypeId', description: 'Vehicle type ID' })
  async updateVehicleType(
    @Param('vehicleTypeId') vehicleTypeId: string,
    @Body() dto: UpsertVehicleTypeDto,
  ): Promise<UpsertVehicleTypeResponse> {
    return this.driverService.upsertVehicleType(vehicleTypeId, dto);
  }

  @Get('vehicles')
  @ApiOperation({ summary: 'List vehicles' })
  async listVehicles(
    @Query() query: ListVehiclesQueryDto,
  ): Promise<ListVehiclesResponse> {
    return this.driverService.listVehicles(query);
  }

  @Post('vehicles')
  @ApiOperation({ summary: 'Create vehicle' })
  async createVehicle(
    @Body() dto: UpsertVehicleDto,
  ): Promise<UpsertVehicleResponse> {
    return this.driverService.upsertVehicle(undefined, dto);
  }

  @Patch('vehicles/:vehicleId')
  @ApiOperation({ summary: 'Update vehicle' })
  @ApiParam({ name: 'vehicleId', description: 'Vehicle ID' })
  async updateVehicle(
    @Param('vehicleId') vehicleId: string,
    @Body() dto: UpsertVehicleDto,
  ): Promise<UpsertVehicleResponse> {
    return this.driverService.upsertVehicle(vehicleId, dto);
  }

  @Post(':driverId/assign-vehicle')
  @ApiOperation({ summary: 'Assign a vehicle to a driver' })
  @ApiParam({ name: 'driverId', description: 'Driver ID' })
  async assignVehicle(
    @Param('driverId') driverId: string,
    @Body() dto: AssignVehicleDto,
  ): Promise<AssignVehicleResponse> {
    return this.driverService.assignVehicle(driverId, dto);
  }

  @Post(':driverId/unassign-vehicle')
  @ApiOperation({ summary: 'Unassign a vehicle from a driver' })
  @ApiParam({ name: 'driverId', description: 'Driver ID' })
  async unassignVehicle(
    @Param('driverId') driverId: string,
    @Body() dto: UnassignVehicleDto,
  ): Promise<UnassignVehicleResponse> {
    return this.driverService.unassignVehicle(driverId, dto);
  }
}
