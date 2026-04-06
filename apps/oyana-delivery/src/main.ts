import { OyanaDeliveryModule } from './oyana-delivery.module';
import { DEFAULT_PORTS, bootstrapHybridService } from '@package/packages';

async function bootstrap() {
  await bootstrapHybridService({
    module: OyanaDeliveryModule,
    servicePrefix: 'DELIVERY',
    serviceName: 'oyana-delivery',
    grpcPackage: 'delivery',
    protoFileName: 'delivery.proto',
    grpcBindEnvName: 'DELIVERY_GRPC_BIND_URL',
    grpcDefaultPort: DEFAULT_PORTS.deliveryGrpc,
    httpEnvName: 'DELIVERY_HTTP_PORT',
    httpDefaultPort: DEFAULT_PORTS.deliveryHttp,
  });
}
void bootstrap();
