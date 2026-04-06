import { DEFAULT_PORTS, bootstrapHybridService } from '@package/packages';
import { OyanaDispatchModule } from './oyana-dispatch.module';

async function bootstrap() {
  await bootstrapHybridService({
    module: OyanaDispatchModule,
    servicePrefix: 'DISPATCH',
    serviceName: 'oyana-dispatch',
    grpcPackage: 'dispatch',
    protoFileName: 'dispatch.proto',
    grpcBindEnvName: 'DISPATCH_GRPC_BIND_URL',
    grpcDefaultPort: DEFAULT_PORTS.dispatchGrpc,
    httpEnvName: 'DISPATCH_HTTP_PORT',
    httpDefaultPort: DEFAULT_PORTS.dispatchHttp,
  });
}
void bootstrap();
