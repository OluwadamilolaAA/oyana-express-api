import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  CreateDriverResponse,
  DriverServiceClient,
  GetDriverResponse,
  ListDriversResponse,
  UpdateDriverResponse,
} from '@package/packages';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DriverService implements OnModuleInit {
  private driverService: DriverServiceClient;

  constructor(
    @Inject('DRIVER_SERVICE') private readonly driverClient: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.driverService =
      this.driverClient.getService<DriverServiceClient>('DriverService');
  }

  async createDriver(
    userId: string,
    vehicleType: string,
    licenseNumber: string,
  ): Promise<CreateDriverResponse> {
    return firstValueFrom(
      this.driverService.createDriver({ userId, vehicleType, licenseNumber }),
    );
  }

  async getDriver(userId: string): Promise<GetDriverResponse> {
    return firstValueFrom(this.driverService.getDriver({ userId }));
  }

  async updateDriver(
    userId: string,
    vehicleType: string,
    licenseNumber: string,
    isAvailable: boolean,
  ): Promise<UpdateDriverResponse> {
    return firstValueFrom(
      this.driverService.updateDriver({
        userId,
        vehicleType,
        licenseNumber,
        isAvailable,
      }),
    );
  }

  async listDrivers(onlyAvailable?: boolean): Promise<ListDriversResponse> {
    return firstValueFrom(
      this.driverService.listDrivers({
        onlyAvailable: onlyAvailable ?? false,
      }),
    );
  }
}
