import type {
  AssignFreightRequest,
  BookFreightRequest,
  CreateFreightOrderRequest,
  CreateFreightQuoteRequest,
  FreightItem,
  GetFreightOverviewRequest,
  GetFreightRequestRequest,
  ListFreightRequestsRequest,
  UpdateFreightStatusRequest,
} from '@package/packages/generated/freight';
import type { Timestamp } from '@package/packages/generated/google/protobuf/timestamp';

export class GetFreightOverviewRequestDto implements GetFreightOverviewRequest {}

export class CreateFreightOrderRequestDto implements CreateFreightOrderRequest {
  requesterId!: string;
  originAddress!: string;
  destinationAddress!: string;
  cargoType!: string;
  totalWeightKg!: number;
  totalVolumeM3?: number;
  scheduledPickupAt?: Timestamp;
  notes?: string;
  items: FreightItem[] = [];
}

export class GetFreightRequestRequestDto implements GetFreightRequestRequest {
  freightRequestId!: string;
}

export class ListFreightRequestsRequestDto implements ListFreightRequestsRequest {
  requesterId?: string;
  status?: string;
}

export class CreateFreightQuoteRequestDto implements CreateFreightQuoteRequest {
  freightRequestId!: string;
  providerId?: string;
  quotedAmount!: number;
  currency!: string;
  validUntil!: Timestamp;
}

export class BookFreightRequestDto implements BookFreightRequest {
  freightRequestId!: string;
  quoteId!: string;
  bookingReference!: string;
  assignedVehicleType!: string;
  driverId?: string;
}

export class AssignFreightRequestDto implements AssignFreightRequest {
  freightBookingId!: string;
  driverId!: string;
  vehicleId!: string;
  status?: string;
}

export class UpdateFreightStatusRequestDto implements UpdateFreightStatusRequest {
  freightBookingId!: string;
  status!: string;
  note?: string;
  actorId?: string;
}
