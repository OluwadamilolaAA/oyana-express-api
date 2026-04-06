import { DEFAULT_PORTS, bootstrapHybridService } from '@package/packages';
import { OyanaAdminModule } from './oyana-admin.module';

async function bootstrap() {
  await bootstrapHybridService({
    module: OyanaAdminModule,
    servicePrefix: 'ADMIN',
    serviceName: 'oyana-admin',
    grpcPackage: 'admin',
    protoFileName: 'admin.proto',
    grpcBindEnvName: 'ADMIN_GRPC_BIND_URL',
    grpcDefaultPort: DEFAULT_PORTS.adminGrpc,
    httpEnvName: 'ADMIN_HTTP_PORT',
    httpDefaultPort: DEFAULT_PORTS.adminHttp,
  });
}
void bootstrap();
