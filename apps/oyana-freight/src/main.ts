import { OyanaFreightModule } from './oyana-freight.module';
import { DEFAULT_PORTS, bootstrapHybridService } from '@package/packages';

async function bootstrap() {
  await bootstrapHybridService({
    module: OyanaFreightModule,
    servicePrefix: 'FREIGHT',
    serviceName: 'oyana-freight',
    grpcPackage: 'freight',
    protoFileName: 'freight.proto',
    grpcBindEnvName: 'FREIGHT_GRPC_BIND_URL',
    grpcDefaultPort: DEFAULT_PORTS.freightGrpc,
    httpEnvName: 'FREIGHT_HTTP_PORT',
    httpDefaultPort: DEFAULT_PORTS.freightHttp,
  });
}
void bootstrap();
