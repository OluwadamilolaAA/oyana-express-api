import { DEFAULT_PORTS, bootstrapHybridService } from '@package/packages';
import { OyanaPaymentModule } from './oyana-payment.module';

async function bootstrap() {
  await bootstrapHybridService({
    module: OyanaPaymentModule,
    servicePrefix: 'PAYMENT',
    serviceName: 'oyana-payment',
    grpcPackage: 'payment',
    protoFileName: 'payment.proto',
    grpcBindEnvName: 'PAYMENT_GRPC_BIND_URL',
    grpcDefaultPort: DEFAULT_PORTS.paymentGrpc,
    httpEnvName: 'PAYMENT_HTTP_PORT',
    httpDefaultPort: DEFAULT_PORTS.paymentHttp,
  });
}
void bootstrap();
