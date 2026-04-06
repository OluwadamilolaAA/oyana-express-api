import { DEFAULT_PORTS, bootstrapHybridService } from '@package/packages';
import { OyanaChatModule } from './oyana-chat.module';

async function bootstrap() {
  await bootstrapHybridService({
    module: OyanaChatModule,
    servicePrefix: 'CHAT',
    serviceName: 'oyana-chat',
    grpcPackage: 'chat',
    protoFileName: 'chat.proto',
    grpcBindEnvName: 'CHAT_GRPC_BIND_URL',
    grpcDefaultPort: DEFAULT_PORTS.chatGrpc,
    httpEnvName: 'CHAT_HTTP_PORT',
    httpDefaultPort: DEFAULT_PORTS.chatHttp,
  });
}
void bootstrap();
