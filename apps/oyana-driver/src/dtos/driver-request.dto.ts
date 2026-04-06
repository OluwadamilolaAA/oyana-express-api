import type {
  AssignVehicleRequest,
  CreateDriverRequest,
  DriverDocument,
  DriverProfile,
  DriverStatus,
  GetDriverProfileRequest,
  GetDriverRequest,
  GetDriverStatusRequest,
  ListDriverDocumentsRequest,
  ListDriversRequest,
  ListVehiclesRequest,
  ListVehicleTypesRequest,
  ReviewDriverRequest,
  UnassignVehicleRequest,
  UpdateDriverProfileRequest,
  UpdateDriverRequest,
  UpsertDriverDocumentRequest,
  UpsertDriverStatusRequest,
  UpsertVehicleRequest,
  UpsertVehicleTypeRequest,
  Vehicle,
  VehicleType,
} from '@package/packages/generated/driver';

export class CreateDriverRequestDto implements CreateDriverRequest {
  userId!: string;
  vehicleType!: string;
  licenseNumber!: string;
}

export class GetDriverRequestDto implements GetDriverRequest {
  userId!: string;
}

export class UpdateDriverRequestDto implements UpdateDriverRequest {
  userId!: string;
  vehicleType!: string;
  licenseNumber!: string;
  isAvailable!: boolean;
}

export class ListDriversRequestDto implements ListDriversRequest {
  onlyAvailable!: boolean;
}

export class GetDriverProfileRequestDto implements GetDriverProfileRequest {
  driverId?: string;
  userId?: string;
}

export class UpdateDriverProfileRequestDto implements UpdateDriverProfileRequest {
  profile!: DriverProfile;
}

export class ReviewDriverRequestDto implements ReviewDriverRequest {
  driverId!: string;
  approvalStatus!: string;
  reason?: string;
  reviewedBy!: string;
}

export class GetDriverStatusRequestDto implements GetDriverStatusRequest {
  driverId!: string;
}

export class UpsertDriverStatusRequestDto implements UpsertDriverStatusRequest {
  driverStatus!: DriverStatus;
}

export class ListDriverDocumentsRequestDto implements ListDriverDocumentsRequest {
  driverId!: string;
}

export class UpsertDriverDocumentRequestDto implements UpsertDriverDocumentRequest {
  document!: DriverDocument;
}

export class ListVehicleTypesRequestDto implements ListVehicleTypesRequest {
  includeInactive!: boolean;
}

export class UpsertVehicleTypeRequestDto implements UpsertVehicleTypeRequest {
  vehicleType!: VehicleType;
}

export class ListVehiclesRequestDto implements ListVehiclesRequest {
  ownerDriverId?: string;
  vehicleTypeId?: string;
  includeInactive!: boolean;
}

export class UpsertVehicleRequestDto implements UpsertVehicleRequest {
  vehicle!: Vehicle;
}

export class AssignVehicleRequestDto implements AssignVehicleRequest {
  driverId!: string;
  vehicleId!: string;
}

export class UnassignVehicleRequestDto implements UnassignVehicleRequest {
  assignmentId!: string;
  driverId!: string;
}
