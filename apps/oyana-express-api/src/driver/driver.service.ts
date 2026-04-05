import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  CreateDriverResponse,
  DEFAULT_PORTS,
  DriverServiceClient,
  GetDriverResponse,
  getCloudRunGrpcMetadata,
  getGrpcClientAudience,
  ListDriversResponse,
  UpdateDriverResponse,
} from '@package/packages';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DriverService implements OnModuleInit {
  private driverService!: DriverServiceClient;
  private readonly driverServiceAudience = getGrpcClientAudience(
    'DRIVER_GRPC_URL',
    DEFAULT_PORTS.driverGrpc,
  );

  constructor(
    @Inject('DRIVER_SERVICE') private readonly driverClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.driverService =
      this.driverClient.getService<DriverServiceClient>('DriverService');
  }

  private async getRequestMetadata() {
    return getCloudRunGrpcMetadata(this.driverServiceAudience);
  }

  async createDriver(
    userId: string,
    vehicleType: string,
    licenseNumber: string,
  ): Promise<CreateDriverResponse> {
    return firstValueFrom(
      this.driverService.createDriver(
        { userId, vehicleType, licenseNumber },
        await this.getRequestMetadata(),
      ),
    );
  }

  async getDriver(userId: string): Promise<GetDriverResponse> {
    return firstValueFrom(
      this.driverService.getDriver({ userId }, await this.getRequestMetadata()),
    );
  }

  async updateDriver(
    userId: string,
    vehicleType: string,
    licenseNumber: string,
    isAvailable: boolean,
  ): Promise<UpdateDriverResponse> {
    return firstValueFrom(
      this.driverService.updateDriver(
        {
          userId,
          vehicleType,
          licenseNumber,
          isAvailable,
        },
        await this.getRequestMetadata(),
      ),
    );
  }

  async listDrivers(onlyAvailable?: boolean): Promise<ListDriversResponse> {
    return firstValueFrom(
      this.driverService.listDrivers(
        {
          onlyAvailable: onlyAvailable ?? false,
        },
        await this.getRequestMetadata(),
      ),
    );
  }
}
