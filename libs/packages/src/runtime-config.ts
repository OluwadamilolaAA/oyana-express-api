import { join } from 'path';

export const DEFAULT_PORTS = {
  authGrpc: 50051,
  userGrpc: 50052,
  driverGrpc: 50053,
  gatewayHttp: 3000,
  authHttp: 3001,
  userHttp: 3002,
  driverHttp: 3003,
} as const;

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : undefined;
}

export function getEnv(name: string, fallback: string): string {
  return readEnv(name) ?? fallback;
}

export function requireEnv(name: string): string {
  const value = readEnv(name);

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

export function getNumberEnv(name: string, fallback: number): number {
  const rawValue = readEnv(name);

  if (!rawValue) {
    return fallback;
  }

  const parsedValue = Number(rawValue);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }

  return parsedValue;
}

export function getBooleanEnv(name: string, fallback: boolean): boolean {
  const rawValue = readEnv(name)?.toLowerCase();

  if (!rawValue) {
    return fallback;
  }

  if (['true', '1', 'yes', 'on'].includes(rawValue)) {
    return true;
  }

  if (['false', '0', 'no', 'off'].includes(rawValue)) {
    return false;
  }

  throw new Error(`${name} must be a boolean value`);
}

export function getProtoPath(fileName: string): string {
  return join(process.cwd(), 'libs', 'packages', 'src', 'proto', fileName);
}

export function getGrpcClientUrl(envName: string, defaultPort: number): string {
  return getEnv(envName, `localhost:${defaultPort}`);
}

export function getGrpcServerUrl(envName: string, defaultPort: number): string {
  return getEnv(envName, `0.0.0.0:${defaultPort}`);
}

export function getHttpPort(envName: string, defaultPort: number): number {
  return getNumberEnv(envName, defaultPort);
}

export function getMongoConnectionSettings(
  servicePrefix: string,
  defaultDatabaseName: string,
) {
  return {
    host: getEnv(
      `${servicePrefix}_MONGODB_HOST`,
      getEnv('MONGODB_HOST', 'localhost'),
    ),
    port: getNumberEnv(
      `${servicePrefix}_MONGODB_PORT`,
      getNumberEnv('MONGODB_PORT', 27017),
    ),
    database: getEnv(
      `${servicePrefix}_MONGODB_DB`,
      getEnv('MONGODB_DB', defaultDatabaseName),
    ),
    synchronize: getBooleanEnv(
      `${servicePrefix}_DB_SYNC`,
      getBooleanEnv('DB_SYNC', false),
    ),
  };
}
