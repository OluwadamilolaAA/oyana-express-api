import { OyanaRideModule } from './oyana-ride.module';
import { DEFAULT_PORTS, bootstrapHybridService } from '@package/packages';

async function bootstrap() {
  await bootstrapHybridService({
    module: OyanaRideModule,
    servicePrefix: 'RIDE',
    serviceName: 'oyana-ride',
    grpcPackage: 'ride',
    protoFileName: 'ride.proto',
    grpcBindEnvName: 'RIDE_GRPC_BIND_URL',
    grpcDefaultPort: DEFAULT_PORTS.rideGrpc,
    httpEnvName: 'RIDE_HTTP_PORT',
    httpDefaultPort: DEFAULT_PORTS.rideHttp,
  });
}
void bootstrap();
