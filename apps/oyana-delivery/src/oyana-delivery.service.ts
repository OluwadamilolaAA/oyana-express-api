import { Injectable } from '@nestjs/common';

@Injectable()
export class OyanaDeliveryService {
  getOverview() {
    return {
      service: 'oyana-delivery',
      domain: 'parcel-delivery',
      collections: [
        'deliveries',
        'delivery_items',
        'receivers',
        'delivery_status_history',
        'delivery_assignments',
        'proof_of_delivery',
      ],
      capabilities: [
        'parcel booking',
        'pickup and dropoff tracking',
        'receiver management',
        'proof of delivery',
        'delivery lifecycle tracking',
      ],
    };
  }
}
