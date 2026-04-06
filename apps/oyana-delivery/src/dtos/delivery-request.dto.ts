import type {
  AssignDeliveryRequest,
  CaptureProofOfDeliveryRequest,
  CreateDeliveryRequest,
  DeliveryItem,
  GetDeliveryOverviewRequest,
  GetDeliveryRequest,
  ListDeliveriesRequest,
  ProofOfDelivery,
  Receiver,
  UpdateDeliveryStatusRequest,
} from '@package/packages/generated/delivery';
import type { Timestamp } from '@package/packages/generated/google/protobuf/timestamp';

export class GetDeliveryOverviewRequestDto implements GetDeliveryOverviewRequest {}

export class CreateDeliveryRequestDto implements CreateDeliveryRequest {
  requesterId!: string;
  senderName!: string;
  senderPhone!: string;
  pickupAddress!: string;
  dropoffAddress!: string;
  pickupLatitude!: number;
  pickupLongitude!: number;
  dropoffLatitude!: number;
  dropoffLongitude!: number;
  serviceLevel?: string;
  scheduledFor?: Timestamp;
  items: DeliveryItem[] = [];
  receiver!: Receiver;
}

export class GetDeliveryRequestDto implements GetDeliveryRequest {
  deliveryId!: string;
}

export class ListDeliveriesRequestDto implements ListDeliveriesRequest {
  requesterId?: string;
  driverId?: string;
  status?: string;
}

export class UpdateDeliveryStatusRequestDto implements UpdateDeliveryStatusRequest {
  deliveryId!: string;
  status!: string;
  note?: string;
  actorId?: string;
}

export class AssignDeliveryRequestDto implements AssignDeliveryRequest {
  deliveryId!: string;
  driverId!: string;
  status?: string;
}

export class CaptureProofOfDeliveryRequestDto implements CaptureProofOfDeliveryRequest {
  proofOfDelivery!: ProofOfDelivery;
}
