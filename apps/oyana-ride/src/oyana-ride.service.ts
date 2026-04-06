import { Injectable } from '@nestjs/common';

@Injectable()
export class OyanaRideService {
  getOverview() {
    return {
      service: 'oyana-ride',
      domain: 'ride-booking',
      collections: [
        'rides',
        'ride_locations',
        'ride_status_history',
        'ride_fares',
        'ride_assignments',
        'ride_cancellations',
      ],
      capabilities: [
        'ride requests',
        'fare estimates',
        'driver matching integration',
        'ride lifecycle tracking',
        'ride history',
      ],
    };
  }
}
