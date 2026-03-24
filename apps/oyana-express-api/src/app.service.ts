import { Injectable } from '@nestjs/common';
import {
  DEFAULT_PORTS,
  getGrpcClientUrl,
  getHttpPort,
} from '@package/packages';

@Injectable()
export class AppService {
  getOverview() {
    return {
      name: 'oyana-express-api-gateway',
      status: 'ok',
      httpPort: getHttpPort('GATEWAY_HTTP_PORT', DEFAULT_PORTS.gatewayHttp),
      services: {
        auth: getGrpcClientUrl('AUTH_GRPC_URL', DEFAULT_PORTS.authGrpc),
        user: getGrpcClientUrl('USER_GRPC_URL', DEFAULT_PORTS.userGrpc),
        driver: getGrpcClientUrl('DRIVER_GRPC_URL', DEFAULT_PORTS.driverGrpc),
      },
    };
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
