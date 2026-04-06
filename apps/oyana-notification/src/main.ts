import { DEFAULT_PORTS, bootstrapHybridService } from '@package/packages';
import { OyanaNotificationModule } from './oyana-notification.module';

async function bootstrap() {
  await bootstrapHybridService({
    module: OyanaNotificationModule,
    servicePrefix: 'NOTIFICATION',
    serviceName: 'oyana-notification',
    grpcPackage: 'notification',
    protoFileName: 'notification.proto',
    grpcBindEnvName: 'NOTIFICATION_GRPC_BIND_URL',
    grpcDefaultPort: DEFAULT_PORTS.notificationGrpc,
    httpEnvName: 'NOTIFICATION_HTTP_PORT',
    httpDefaultPort: DEFAULT_PORTS.notificationHttp,
  });
}
void bootstrap();
