import { DEFAULT_PORTS, bootstrapHybridService } from '@package/packages';
import { OyanaPricingModule } from './oyana-pricing.module';

async function bootstrap() {
  await bootstrapHybridService({
    module: OyanaPricingModule,
    servicePrefix: 'PRICING',
    serviceName: 'oyana-pricing',
    grpcPackage: 'pricing',
    protoFileName: 'pricing.proto',
    grpcBindEnvName: 'PRICING_GRPC_BIND_URL',
    grpcDefaultPort: DEFAULT_PORTS.pricingGrpc,
    httpEnvName: 'PRICING_HTTP_PORT',
    httpDefaultPort: DEFAULT_PORTS.pricingHttp,
  });
}
void bootstrap();
