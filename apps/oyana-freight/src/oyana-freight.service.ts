import { Injectable } from '@nestjs/common';

@Injectable()
export class OyanaFreightService {
  getOverview() {
    return {
      service: 'oyana-freight',
      domain: 'freight-logistics',
      collections: [
        'freight_requests',
        'freight_items',
        'freight_quotes',
        'freight_bookings',
        'freight_assignments',
        'freight_status_history',
      ],
      capabilities: [
        'freight booking requests',
        'quotation workflows',
        'truck and van assignment',
        'scheduled freight lifecycle',
        'large-goods shipment tracking',
      ],
    };
  }
}
