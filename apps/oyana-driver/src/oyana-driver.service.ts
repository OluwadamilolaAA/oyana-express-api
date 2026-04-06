import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import {
  AssignVehicleRequest,
  AssignVehicleResponse,
  CreateDriverRequest,
  CreateDriverResponse,
  Driver,
  DriverDocument,
  DriverProfile,
  DriverStatus,
  DriverVehicleAssignment,
  GetDriverProfileRequest,
  GetDriverProfileResponse,
  GetDriverRequest,
  GetDriverResponse,
  GetDriverStatusRequest,
  GetDriverStatusResponse,
  ListDriverDocumentsRequest,
  ListDriverDocumentsResponse,
  ListDriversRequest,
  ListDriversResponse,
  ListVehiclesRequest,
  ListVehiclesResponse,
  ListVehicleTypesRequest,
  ListVehicleTypesResponse,
  ReviewDriverRequest,
  ReviewDriverResponse,
  UnassignVehicleRequest,
  UnassignVehicleResponse,
  UpdateDriverProfileRequest,
  UpdateDriverProfileResponse,
  UpdateDriverRequest,
  UpdateDriverResponse,
  UpsertDriverDocumentRequest,
  UpsertDriverDocumentResponse,
  UpsertDriverStatusRequest,
  UpsertDriverStatusResponse,
  UpsertVehicleRequest,
  UpsertVehicleResponse,
  UpsertVehicleTypeRequest,
  UpsertVehicleTypeResponse,
  Vehicle,
  VehicleType,
} from '@package/packages/generated/driver';
import type { Timestamp } from '@package/packages/generated/google/protobuf/timestamp';
import { requireNonEmptyString } from '@package/packages';
import {
  DRIVER_DOCUMENT_REPOSITORY,
  DRIVER_REPOSITORY,
  DRIVER_STATUS_REPOSITORY,
  DRIVER_VEHICLE_ASSIGNMENT_REPOSITORY,
  VEHICLE_REPOSITORY,
  VEHICLE_TYPE_REPOSITORY,
} from './provider/driver.providers';
import {
  DriverDocumentEntity,
  DriverProfileEntity,
  DriverStatusEntity,
  DriverVehicleAssignmentEntity,
  VehicleEntity,
  VehicleTypeEntity,
} from './entity/driver.entity';

@Injectable()
export class OyanaDriverService {
  constructor(
    @Inject(DRIVER_REPOSITORY)
    private readonly driverRepository: MongoRepository<DriverProfileEntity>,
    @Inject(DRIVER_DOCUMENT_REPOSITORY)
    private readonly driverDocumentRepository: MongoRepository<DriverDocumentEntity>,
    @Inject(DRIVER_STATUS_REPOSITORY)
    private readonly driverStatusRepository: MongoRepository<DriverStatusEntity>,
    @Inject(VEHICLE_TYPE_REPOSITORY)
    private readonly vehicleTypeRepository: MongoRepository<VehicleTypeEntity>,
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepository: MongoRepository<VehicleEntity>,
    @Inject(DRIVER_VEHICLE_ASSIGNMENT_REPOSITORY)
    private readonly driverVehicleAssignmentRepository: MongoRepository<DriverVehicleAssignmentEntity>,
  ) {}

  async createDriver(
    request: CreateDriverRequest,
  ): Promise<CreateDriverResponse> {
    const userId = requireNonEmptyString(request.userId, 'User id');
    const vehicleType = requireNonEmptyString(
      request.vehicleType,
      'Vehicle type',
    );
    const licenseNumber = requireNonEmptyString(
      request.licenseNumber,
      'License number',
    );

    const existingDriver = await this.driverRepository.findOne({
      where: [{ userId }, { licenseNumber }],
    });

    if (existingDriver) {
      throw new ConflictException('Driver profile already exists');
    }

    const driver = this.driverRepository.create({
      userId,
      vehicleType,
      licenseNumber,
      isAvailable: true,
    });

    const savedDriver = await this.driverRepository.save(driver);

    return { driver: this.toGrpcDriver(savedDriver) };
  }

  async getDriver(request: GetDriverRequest): Promise<GetDriverResponse> {
    const userId = requireNonEmptyString(request.userId, 'User id');
    const driver = await this.driverRepository.findOne({ where: { userId } });

    if (!driver) {
      throw new NotFoundException('Driver profile not found');
    }

    return { driver: this.toGrpcDriver(driver) };
  }

  async updateDriver(
    request: UpdateDriverRequest,
  ): Promise<UpdateDriverResponse> {
    const userId = requireNonEmptyString(request.userId, 'User id');
    const vehicleType = requireNonEmptyString(
      request.vehicleType,
      'Vehicle type',
    );
    const licenseNumber = requireNonEmptyString(
      request.licenseNumber,
      'License number',
    );

    if (typeof request.isAvailable !== 'boolean') {
      throw new BadRequestException('Availability flag is required');
    }

    const driver = await this.driverRepository.findOne({ where: { userId } });

    if (!driver) {
      throw new NotFoundException('Driver profile not found');
    }

    driver.vehicleType = vehicleType;
    driver.licenseNumber = licenseNumber;
    driver.isAvailable = request.isAvailable;

    const updatedDriver = await this.driverRepository.save(driver);

    return { driver: this.toGrpcDriver(updatedDriver) };
  }

  async listDrivers(request: ListDriversRequest): Promise<ListDriversResponse> {
    const drivers = await this.driverRepository.find({
      where: request.onlyAvailable ? { isAvailable: true } : {},
    });

    return {
      drivers: drivers.map((driver) => this.toGrpcDriver(driver)),
    };
  }

  async getDriverProfile(
    request: GetDriverProfileRequest,
  ): Promise<GetDriverProfileResponse> {
    const driver = await this.resolveDriverProfile(request);

    return {
      profile: this.toGrpcDriverProfile(driver),
    };
  }

  async updateDriverProfile(
    request: UpdateDriverProfileRequest,
  ): Promise<UpdateDriverProfileResponse> {
    const profile = request.profile;

    if (!profile) {
      throw new BadRequestException('Driver profile is required');
    }

    const userId = requireNonEmptyString(profile.userId, 'User id');
    const vehicleType = requireNonEmptyString(
      profile.vehicleType,
      'Vehicle type',
    );
    const licenseNumber = requireNonEmptyString(
      profile.licenseNumber,
      'License number',
    );

    const existingProfile =
      (await this.findById(this.driverRepository, profile.id)) ??
      (await this.driverRepository.findOne({ where: { userId } }));

    if (!existingProfile) {
      const duplicateProfile = await this.driverRepository.findOne({
        where: [{ userId }, { licenseNumber }],
      });

      if (duplicateProfile) {
        throw new ConflictException('Driver profile already exists');
      }
    }

    const nextProfile = existingProfile ?? this.driverRepository.create();
    nextProfile.userId = userId;
    nextProfile.vehicleType = vehicleType;
    nextProfile.licenseNumber = licenseNumber;
    nextProfile.onboardingStatus =
      this.normalizeOptionalString(profile.onboardingStatus) ??
      nextProfile.onboardingStatus ??
      'PENDING';
    nextProfile.approvalStatus =
      this.normalizeOptionalString(profile.approvalStatus) ??
      nextProfile.approvalStatus ??
      'PENDING';
    nextProfile.currentStatus =
      this.normalizeOptionalString(profile.currentStatus) ??
      nextProfile.currentStatus ??
      'OFFLINE';
    nextProfile.activeVehicleAssignmentId = this.normalizeOptionalString(
      profile.activeVehicleAssignmentId,
    );
    nextProfile.isAvailable =
      typeof profile.isAvailable === 'boolean'
        ? profile.isAvailable
        : (nextProfile.isAvailable ?? false);

    const savedProfile = await this.driverRepository.save(nextProfile);

    return {
      profile: this.toGrpcDriverProfile(savedProfile),
    };
  }

  async reviewDriver(
    request: ReviewDriverRequest,
  ): Promise<ReviewDriverResponse> {
    const driverId = requireNonEmptyString(request.driverId, 'Driver id');
    requireNonEmptyString(request.approvalStatus, 'Approval status');
    requireNonEmptyString(request.reviewedBy, 'Reviewed by');

    const profile = await this.requireById(
      this.driverRepository,
      driverId,
      'Driver profile not found',
    );

    profile.approvalStatus = request.approvalStatus.trim();

    const savedProfile = await this.driverRepository.save(profile);

    return {
      profile: this.toGrpcDriverProfile(savedProfile),
    };
  }

  async getDriverStatus(
    request: GetDriverStatusRequest,
  ): Promise<GetDriverStatusResponse> {
    const driverId = requireNonEmptyString(request.driverId, 'Driver id');
    const driverStatus = await this.driverStatusRepository.findOne({
      where: { driverId },
    });

    if (driverStatus) {
      return { driverStatus: this.toGrpcDriverStatus(driverStatus) };
    }

    const profile = await this.requireById(
      this.driverRepository,
      driverId,
      'Driver profile not found',
    );

    return {
      driverStatus: {
        id: '',
        driverId: profile.id,
        status: profile.currentStatus,
        isAvailable: profile.isAvailable,
      },
    };
  }

  async upsertDriverStatus(
    request: UpsertDriverStatusRequest,
  ): Promise<UpsertDriverStatusResponse> {
    const driverStatus = request.driverStatus;

    if (!driverStatus) {
      throw new BadRequestException('Driver status is required');
    }

    const driverId = requireNonEmptyString(driverStatus.driverId, 'Driver id');
    const status = requireNonEmptyString(driverStatus.status, 'Status');
    const profile = await this.requireById(
      this.driverRepository,
      driverId,
      'Driver profile not found',
    );

    const existingStatus =
      (await this.findById(this.driverStatusRepository, driverStatus.id)) ??
      (await this.driverStatusRepository.findOne({ where: { driverId } }));

    const nextStatus = existingStatus ?? this.driverStatusRepository.create();
    nextStatus.driverId = driverId;
    nextStatus.status = status;
    nextStatus.isAvailable =
      typeof driverStatus.isAvailable === 'boolean'
        ? driverStatus.isAvailable
        : false;
    nextStatus.reason = this.normalizeOptionalString(driverStatus.reason);
    nextStatus.changedAt = driverStatus.changedAt ?? this.nowTimestamp();

    const savedStatus = await this.driverStatusRepository.save(nextStatus);

    profile.currentStatus = savedStatus.status;
    profile.isAvailable = savedStatus.isAvailable;
    await this.driverRepository.save(profile);

    return {
      driverStatus: this.toGrpcDriverStatus(savedStatus),
    };
  }

  async listDriverDocuments(
    request: ListDriverDocumentsRequest,
  ): Promise<ListDriverDocumentsResponse> {
    const driverId = requireNonEmptyString(request.driverId, 'Driver id');
    const documents = await this.driverDocumentRepository.find({
      where: { driverId },
    });

    return {
      documents: documents.map((document) =>
        this.toGrpcDriverDocument(document),
      ),
    };
  }

  async upsertDriverDocument(
    request: UpsertDriverDocumentRequest,
  ): Promise<UpsertDriverDocumentResponse> {
    const document = request.document;

    if (!document) {
      throw new BadRequestException('Driver document is required');
    }

    const driverId = requireNonEmptyString(document.driverId, 'Driver id');
    requireNonEmptyString(document.documentType, 'Document type');
    requireNonEmptyString(document.fileUrl, 'File URL');

    const existingDocument =
      (await this.findById(this.driverDocumentRepository, document.id)) ??
      (await this.driverDocumentRepository.findOne({
        where: {
          driverId,
          documentType: document.documentType.trim(),
        },
      }));

    const nextDocument =
      existingDocument ?? this.driverDocumentRepository.create();
    nextDocument.driverId = driverId;
    nextDocument.documentType = document.documentType.trim();
    nextDocument.documentNumber = this.normalizeOptionalString(
      document.documentNumber,
    );
    nextDocument.fileUrl = document.fileUrl.trim();
    nextDocument.verificationStatus =
      this.normalizeOptionalString(document.verificationStatus) ??
      nextDocument.verificationStatus ??
      'PENDING';
    nextDocument.expiresAt = document.expiresAt;
    nextDocument.uploadedAt = document.uploadedAt ?? nextDocument.uploadedAt;
    nextDocument.updatedAt = this.nowTimestamp();

    const savedDocument =
      await this.driverDocumentRepository.save(nextDocument);

    return {
      document: this.toGrpcDriverDocument(savedDocument),
    };
  }

  async listVehicleTypes(
    request: ListVehicleTypesRequest,
  ): Promise<ListVehicleTypesResponse> {
    const vehicleTypes = await this.vehicleTypeRepository.find({
      where: request.includeInactive ? {} : { isActive: true },
    });

    return {
      vehicleTypes: vehicleTypes.map((vehicleType) =>
        this.toGrpcVehicleType(vehicleType),
      ),
    };
  }

  async upsertVehicleType(
    request: UpsertVehicleTypeRequest,
  ): Promise<UpsertVehicleTypeResponse> {
    const vehicleType = request.vehicleType;

    if (!vehicleType) {
      throw new BadRequestException('Vehicle type is required');
    }

    const code = requireNonEmptyString(vehicleType.code, 'Vehicle type code');
    requireNonEmptyString(vehicleType.name, 'Vehicle type name');
    requireNonEmptyString(vehicleType.category, 'Vehicle category');

    const existingVehicleType =
      (await this.findById(this.vehicleTypeRepository, vehicleType.id)) ??
      (await this.vehicleTypeRepository.findOne({ where: { code } }));

    const nextVehicleType =
      existingVehicleType ?? this.vehicleTypeRepository.create();
    nextVehicleType.code = code;
    nextVehicleType.name = vehicleType.name.trim();
    nextVehicleType.category = vehicleType.category.trim();
    nextVehicleType.maxPassengers =
      vehicleType.maxPassengers > 0 ? vehicleType.maxPassengers : 4;
    nextVehicleType.maxLoadKg =
      typeof vehicleType.maxLoadKg === 'number'
        ? vehicleType.maxLoadKg
        : undefined;
    nextVehicleType.isActive =
      typeof vehicleType.isActive === 'boolean'
        ? vehicleType.isActive
        : (nextVehicleType.isActive ?? true);
    nextVehicleType.createdAt =
      nextVehicleType.createdAt ?? vehicleType.createdAt ?? this.nowTimestamp();
    nextVehicleType.updatedAt = this.nowTimestamp();

    const savedVehicleType =
      await this.vehicleTypeRepository.save(nextVehicleType);

    return {
      vehicleType: this.toGrpcVehicleType(savedVehicleType),
    };
  }

  async listVehicles(
    request: ListVehiclesRequest,
  ): Promise<ListVehiclesResponse> {
    const where: Partial<VehicleEntity> = {};
    const ownerDriverId = this.normalizeOptionalString(request.ownerDriverId);
    const vehicleTypeId = this.normalizeOptionalString(request.vehicleTypeId);

    if (ownerDriverId) {
      where.ownerDriverId = ownerDriverId;
    }

    if (vehicleTypeId) {
      where.vehicleTypeId = vehicleTypeId;
    }

    if (!request.includeInactive) {
      where.status = 'ACTIVE';
    }

    const vehicles = await this.vehicleRepository.find({ where });

    return {
      vehicles: vehicles.map((vehicle) => this.toGrpcVehicle(vehicle)),
    };
  }

  async upsertVehicle(
    request: UpsertVehicleRequest,
  ): Promise<UpsertVehicleResponse> {
    const vehicle = request.vehicle;

    if (!vehicle) {
      throw new BadRequestException('Vehicle is required');
    }

    const plateNumber = requireNonEmptyString(
      vehicle.plateNumber,
      'Plate number',
    );
    requireNonEmptyString(vehicle.make, 'Vehicle make');
    requireNonEmptyString(vehicle.model, 'Vehicle model');
    requireNonEmptyString(vehicle.vehicleTypeId, 'Vehicle type id');

    const existingVehicle =
      (await this.findById(this.vehicleRepository, vehicle.id)) ??
      (await this.vehicleRepository.findOne({ where: { plateNumber } }));

    const nextVehicle = existingVehicle ?? this.vehicleRepository.create();
    nextVehicle.plateNumber = plateNumber;
    nextVehicle.vin = this.normalizeOptionalString(vehicle.vin);
    nextVehicle.make = vehicle.make.trim();
    nextVehicle.model = vehicle.model.trim();
    nextVehicle.color = this.normalizeOptionalString(vehicle.color);
    nextVehicle.year =
      typeof vehicle.year === 'number' && vehicle.year > 0
        ? vehicle.year
        : undefined;
    nextVehicle.vehicleTypeId = vehicle.vehicleTypeId.trim();
    nextVehicle.ownerDriverId = this.normalizeOptionalString(
      vehicle.ownerDriverId,
    );
    nextVehicle.status =
      this.normalizeOptionalString(vehicle.status) ??
      nextVehicle.status ??
      'ACTIVE';
    nextVehicle.createdAt =
      nextVehicle.createdAt ?? vehicle.createdAt ?? this.nowTimestamp();
    nextVehicle.updatedAt = this.nowTimestamp();

    const savedVehicle = await this.vehicleRepository.save(nextVehicle);

    return {
      vehicle: this.toGrpcVehicle(savedVehicle),
    };
  }

  async assignVehicle(
    request: AssignVehicleRequest,
  ): Promise<AssignVehicleResponse> {
    const driverId = requireNonEmptyString(request.driverId, 'Driver id');
    const vehicleId = requireNonEmptyString(request.vehicleId, 'Vehicle id');
    const assignedAt = this.nowTimestamp();

    const profile = await this.requireById(
      this.driverRepository,
      driverId,
      'Driver profile not found',
    );
    await this.requireById(
      this.vehicleRepository,
      vehicleId,
      'Vehicle not found',
    );

    if (profile.activeVehicleAssignmentId) {
      const activeAssignment = await this.findById(
        this.driverVehicleAssignmentRepository,
        profile.activeVehicleAssignmentId,
      );

      if (activeAssignment) {
        activeAssignment.isActive = false;
        activeAssignment.unassignedAt = assignedAt;
        await this.driverVehicleAssignmentRepository.save(activeAssignment);
      }
    }

    const assignment = this.driverVehicleAssignmentRepository.create({
      driverId,
      vehicleId,
      assignedAt,
      isActive: true,
    });

    const savedAssignment =
      await this.driverVehicleAssignmentRepository.save(assignment);

    profile.activeVehicleAssignmentId = savedAssignment.id;
    await this.driverRepository.save(profile);

    return {
      assignment: this.toGrpcDriverVehicleAssignment(savedAssignment),
    };
  }

  async unassignVehicle(
    request: UnassignVehicleRequest,
  ): Promise<UnassignVehicleResponse> {
    const assignmentId = requireNonEmptyString(
      request.assignmentId,
      'Assignment id',
    );
    const driverId = requireNonEmptyString(request.driverId, 'Driver id');

    const assignment = await this.requireById(
      this.driverVehicleAssignmentRepository,
      assignmentId,
      'Driver vehicle assignment not found',
    );

    if (assignment.driverId !== driverId) {
      throw new NotFoundException('Driver vehicle assignment not found');
    }

    assignment.isActive = false;
    assignment.unassignedAt = this.nowTimestamp();

    const savedAssignment =
      await this.driverVehicleAssignmentRepository.save(assignment);

    const profile = await this.requireById(
      this.driverRepository,
      driverId,
      'Driver profile not found',
    );

    if (profile.activeVehicleAssignmentId === savedAssignment.id) {
      profile.activeVehicleAssignmentId = undefined;
      await this.driverRepository.save(profile);
    }

    return {
      assignment: this.toGrpcDriverVehicleAssignment(savedAssignment),
    };
  }

  private toGrpcDriver(driver: DriverProfileEntity): Driver {
    return {
      userId: driver.userId,
      vehicleType: driver.vehicleType,
      licenseNumber: driver.licenseNumber,
      isAvailable: driver.isAvailable,
    };
  }

  private toGrpcDriverProfile(driver: DriverProfileEntity): DriverProfile {
    return {
      id: driver.id,
      userId: driver.userId,
      vehicleType: driver.vehicleType,
      licenseNumber: driver.licenseNumber,
      onboardingStatus: driver.onboardingStatus,
      approvalStatus: driver.approvalStatus,
      currentStatus: driver.currentStatus,
      activeVehicleAssignmentId: driver.activeVehicleAssignmentId,
      isAvailable: driver.isAvailable,
    };
  }

  private toGrpcDriverDocument(document: DriverDocumentEntity): DriverDocument {
    return {
      id: document.id,
      driverId: document.driverId,
      documentType: document.documentType,
      documentNumber: document.documentNumber,
      fileUrl: document.fileUrl,
      verificationStatus: document.verificationStatus,
      expiresAt: document.expiresAt,
      uploadedAt: document.uploadedAt,
      updatedAt: document.updatedAt,
    };
  }

  private toGrpcDriverStatus(driverStatus: DriverStatusEntity): DriverStatus {
    return {
      id: driverStatus.id,
      driverId: driverStatus.driverId,
      status: driverStatus.status,
      isAvailable: driverStatus.isAvailable,
      reason: driverStatus.reason,
      changedAt: driverStatus.changedAt,
    };
  }

  private toGrpcVehicleType(vehicleType: VehicleTypeEntity): VehicleType {
    return {
      id: vehicleType.id,
      code: vehicleType.code,
      name: vehicleType.name,
      category: vehicleType.category,
      maxPassengers: vehicleType.maxPassengers,
      maxLoadKg: vehicleType.maxLoadKg,
      isActive: vehicleType.isActive,
      createdAt: vehicleType.createdAt,
      updatedAt: vehicleType.updatedAt,
    };
  }

  private toGrpcVehicle(vehicle: VehicleEntity): Vehicle {
    return {
      id: vehicle.id,
      plateNumber: vehicle.plateNumber,
      vin: vehicle.vin,
      make: vehicle.make,
      model: vehicle.model,
      color: vehicle.color,
      year: vehicle.year,
      vehicleTypeId: vehicle.vehicleTypeId,
      ownerDriverId: vehicle.ownerDriverId,
      status: vehicle.status,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
    };
  }

  private toGrpcDriverVehicleAssignment(
    assignment: DriverVehicleAssignmentEntity,
  ): DriverVehicleAssignment {
    return {
      id: assignment.id,
      driverId: assignment.driverId,
      vehicleId: assignment.vehicleId,
      assignedAt: assignment.assignedAt,
      unassignedAt: assignment.unassignedAt,
      isActive: assignment.isActive,
    };
  }

  private async resolveDriverProfile(
    request: GetDriverProfileRequest,
  ): Promise<DriverProfileEntity> {
    const driverId = this.normalizeOptionalString(request.driverId);

    if (driverId) {
      return this.requireById(
        this.driverRepository,
        driverId,
        'Driver profile not found',
      );
    }

    const userId = this.normalizeOptionalString(request.userId);

    if (!userId) {
      throw new BadRequestException('Driver id or user id is required');
    }

    const driver = await this.driverRepository.findOne({ where: { userId } });

    if (!driver) {
      throw new NotFoundException('Driver profile not found');
    }

    return driver;
  }

  private async requireById<TEntity extends { id: string }>(
    repository: MongoRepository<TEntity>,
    id: string,
    notFoundMessage: string,
  ): Promise<TEntity> {
    const entity = await this.findById(repository, id);

    if (!entity) {
      throw new NotFoundException(notFoundMessage);
    }

    return entity;
  }

  private async findById<TEntity extends { id: string }>(
    repository: MongoRepository<TEntity>,
    id?: string,
  ): Promise<TEntity | null> {
    const normalizedId = this.normalizeOptionalString(id);

    if (!normalizedId) {
      return null;
    }

    if (ObjectId.isValid(normalizedId)) {
      const entity = await repository.findOne({
        where: {
          _id: new ObjectId(normalizedId),
        } as never,
      });

      if (entity) {
        return entity;
      }
    }

    const entities = await repository.find();
    return entities.find((entity) => entity.id === normalizedId) ?? null;
  }

  private normalizeOptionalString(value?: string): string | undefined {
    const normalizedValue = value?.trim();
    return normalizedValue && normalizedValue.length > 0
      ? normalizedValue
      : undefined;
  }

  private nowTimestamp(): Timestamp {
    const now = Date.now();

    return {
      seconds: Math.floor(now / 1000),
      nanos: (now % 1000) * 1_000_000,
    };
  }
}
