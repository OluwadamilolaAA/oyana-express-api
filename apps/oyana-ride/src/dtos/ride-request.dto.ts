import {
  GetRideOverviewRequest,
  GetRideRequest,
  ListRidesRequest,
  RideLocation,
  UpdateRideStatusRequest,
  CreateRideRequest,
  EstimateRideFareRequest,
  AssignRideRequest,
  AddRideLocationRequest,
  CancelRideRequest,
  CompleteRideRequest,
} from '@package/packages/generated/ride';

export class CreateRideRequestDto implements CreateRideRequest {
  riderId!: string;
  pickupAddress!: string;
  dropoffAddress!: string;
  pickupLatitude!: number;
  pickupLongitude!: number;
  dropoffLatitude!: number;
  dropoffLongitude!: number;
  serviceLevel?: string;
  scheduledFor?: import('@package/packages/generated/google/protobuf/timestamp').Timestamp;
}

export class GetRideRequestDto implements GetRideRequest {
  rideId!: string;
}

export class ListRidesRequestDto implements ListRidesRequest {
  riderId?: string;
  driverId?: string;
  status?: string;
}

export class EstimateRideFareRequestDto implements EstimateRideFareRequest {
  rideId!: string;
  estimatedDistanceKm?: number;
  estimatedDurationMinutes?: number;
}

export class AssignRideRequestDto implements AssignRideRequest {
  rideId!: string;
  driverId!: string;
  status?: string;
}

export class UpdateRideStatusRequestDto implements UpdateRideStatusRequest {
  rideId!: string;
  status!: string;
  note?: string;
  actorId?: string;
}

export class AddRideLocationRequestDto implements AddRideLocationRequest {
  location!: RideLocation;
}

export class CancelRideRequestDto implements CancelRideRequest {
  rideId!: string;
  cancelledBy!: string;
  reason!: string;
  feeAmount?: number;
}

export class CompleteRideRequestDto implements CompleteRideRequest {
  rideId!: string;
  completedAt!: import('@package/packages/generated/google/protobuf/timestamp').Timestamp;
}
