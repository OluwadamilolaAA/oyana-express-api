import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  DEFAULT_PORTS,
  DriverServiceClient,
  GetDriverResponse,
  getCloudRunGrpcMetadata,
  getGrpcClientAudience,
  ListDriversResponse,
  UpdateDriverResponse,
} from '@package/packages';
import { firstValueFrom } from 'rxjs';
import {
  AssignVehicleDto,
  ListVehiclesQueryDto,
  ListVehicleTypesQueryDto,
  ReviewDriverDto,
  UnassignVehicleDto,
  UpdateDriverDto,
  UpdateDriverProfileDto,
  UpsertDriverDocumentDto,
  UpsertDriverStatusDto,
  UpsertVehicleDto,
  UpsertVehicleTypeDto,
} from './dtos/driver.dto';
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

  async getDriver(userId: string): Promise<GetDriverResponse> {
    return firstValueFrom(
      this.driverService.getDriver({ userId }, await this.getRequestMetadata()),
    );
  }

  async updateDriver(
    userId: string,
    dto: UpdateDriverDto,
  ): Promise<UpdateDriverResponse> {
    return firstValueFrom(
      this.driverService.updateDriver(
        {
          userId,
          vehicleType: dto.vehicleType,
          licenseNumber: dto.licenseNumber,
          isAvailable: dto.isAvailable,
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

  async getDriverProfileByUserId(
    userId: string,
  ): Promise<GetDriverProfileResponse> {
    return firstValueFrom(
      this.driverService.getDriverProfile(
        { userId },
        await this.getRequestMetadata(),
      ),
    );
  }

  async getDriverProfileByDriverId(
    driverId: string,
  ): Promise<GetDriverProfileResponse> {
    return firstValueFrom(
      this.driverService.getDriverProfile(
        { driverId },
        await this.getRequestMetadata(),
      ),
    );
  }

  async updateDriverProfile(
    profileId: string,
    userId: string,
    dto: UpdateDriverProfileDto,
  ): Promise<UpdateDriverProfileResponse> {
    return firstValueFrom(
      this.driverService.updateDriverProfile(
        {
          profile: {
            id: profileId,
            userId,
            vehicleType: dto.vehicleType ?? '',
            licenseNumber: dto.licenseNumber ?? '',
            onboardingStatus: dto.onboardingStatus ?? '',
            approvalStatus: dto.approvalStatus ?? '',
            currentStatus: dto.currentStatus ?? '',
            activeVehicleAssignmentId: dto.activeVehicleAssignmentId,
            isAvailable: dto.isAvailable ?? false,
          },
        },
        await this.getRequestMetadata(),
      ),
    );
  }

  async reviewDriver(
    driverId: string,
    dto: ReviewDriverDto,
  ): Promise<ReviewDriverResponse> {
    return firstValueFrom(
      this.driverService.reviewDriver(
        {
          driverId,
          approvalStatus: dto.approvalStatus,
          reason: dto.reason,
          reviewedBy: dto.reviewedBy,
        },
        await this.getRequestMetadata(),
      ),
    );
  }

  async getDriverStatus(driverId: string): Promise<GetDriverStatusResponse> {
    return firstValueFrom(
      this.driverService.getDriverStatus(
        { driverId },
        await this.getRequestMetadata(),
      ),
    );
  }

  async upsertDriverStatus(
    driverId: string,
    statusId: string | undefined,
    dto: UpsertDriverStatusDto,
  ): Promise<UpsertDriverStatusResponse> {
    return firstValueFrom(
      this.driverService.upsertDriverStatus(
        {
          driverStatus: {
            id: statusId ?? '',
            driverId,
            status: dto.status,
            isAvailable: dto.isAvailable,
            reason: dto.reason,
          },
        },
        await this.getRequestMetadata(),
      ),
    );
  }

  async listDriverDocuments(
    driverId: string,
  ): Promise<ListDriverDocumentsResponse> {
    return firstValueFrom(
      this.driverService.listDriverDocuments(
        { driverId },
        await this.getRequestMetadata(),
      ),
    );
  }

  async upsertDriverDocument(
    driverId: string,
    documentId: string | undefined,
    dto: UpsertDriverDocumentDto,
  ): Promise<UpsertDriverDocumentResponse> {
    return firstValueFrom(
      this.driverService.upsertDriverDocument(
        {
          document: {
            id: documentId ?? '',
            driverId,
            documentType: dto.documentType,
            documentNumber: dto.documentNumber,
            fileUrl: dto.fileUrl,
            verificationStatus: dto.verificationStatus ?? 'PENDING',
          },
        },
        await this.getRequestMetadata(),
      ),
    );
  }

  async listVehicleTypes(
    query: ListVehicleTypesQueryDto,
  ): Promise<ListVehicleTypesResponse> {
    return firstValueFrom(
      this.driverService.listVehicleTypes(
        {
          includeInactive: query.includeInactive ?? false,
        },
        await this.getRequestMetadata(),
      ),
    );
  }

  async upsertVehicleType(
    vehicleTypeId: string | undefined,
    dto: UpsertVehicleTypeDto,
  ): Promise<UpsertVehicleTypeResponse> {
    return firstValueFrom(
      this.driverService.upsertVehicleType(
        {
          vehicleType: {
            id: vehicleTypeId ?? '',
            code: dto.code,
            name: dto.name,
            category: dto.category,
            maxPassengers: dto.maxPassengers ?? 4,
            maxLoadKg: dto.maxLoadKg,
            isActive: dto.isActive ?? true,
          },
        },
        await this.getRequestMetadata(),
      ),
    );
  }

  async listVehicles(
    query: ListVehiclesQueryDto,
  ): Promise<ListVehiclesResponse> {
    return firstValueFrom(
      this.driverService.listVehicles(
        {
          ownerDriverId: query.ownerDriverId,
          vehicleTypeId: query.vehicleTypeId,
          includeInactive: query.includeInactive ?? false,
        },
        await this.getRequestMetadata(),
      ),
    );
  }

  async upsertVehicle(
    vehicleId: string | undefined,
    dto: UpsertVehicleDto,
  ): Promise<UpsertVehicleResponse> {
    return firstValueFrom(
      this.driverService.upsertVehicle(
        {
          vehicle: {
            id: vehicleId ?? '',
            plateNumber: dto.plateNumber,
            vin: dto.vin,
            make: dto.make,
            model: dto.model,
            color: dto.color,
            year: dto.year,
            vehicleTypeId: dto.vehicleTypeId,
            ownerDriverId: dto.ownerDriverId,
            status: dto.status ?? 'ACTIVE',
          },
        },
        await this.getRequestMetadata(),
      ),
    );
  }

  async assignVehicle(
    driverId: string,
    dto: AssignVehicleDto,
  ): Promise<AssignVehicleResponse> {
    return firstValueFrom(
      this.driverService.assignVehicle(
        {
          driverId,
          vehicleId: dto.vehicleId,
        },
        await this.getRequestMetadata(),
      ),
    );
  }

  async unassignVehicle(
    driverId: string,
    dto: UnassignVehicleDto,
  ): Promise<UnassignVehicleResponse> {
    return firstValueFrom(
      this.driverService.unassignVehicle(
        {
          assignmentId: dto.assignmentId,
          driverId,
        },
        await this.getRequestMetadata(),
      ),
    );
  }
}
