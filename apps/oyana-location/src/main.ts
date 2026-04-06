import { DEFAULT_PORTS, bootstrapHybridService } from '@package/packages';
import { OyanaLocationModule } from './oyana-location.module';

async function bootstrap() {
  await bootstrapHybridService({
    module: OyanaLocationModule,
    servicePrefix: 'LOCATION',
    serviceName: 'oyana-location',
    grpcPackage: 'location',
    protoFileName: 'location.proto',
    grpcBindEnvName: 'LOCATION_GRPC_BIND_URL',
    grpcDefaultPort: DEFAULT_PORTS.locationGrpc,
    httpEnvName: 'LOCATION_HTTP_PORT',
    httpDefaultPort: DEFAULT_PORTS.locationHttp,
  });
}
void bootstrap();
