import { credentials, Metadata, type ChannelCredentials } from '@grpc/grpc-js';
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

export interface MongoConnectionSettings {
  uri?: string;
  host?: string;
  port?: number;
  database: string;
  synchronize: boolean;
}

export interface GrpcClientTransportOptions {
  url: string;
  credentials?: ChannelCredentials;
}

interface ParsedGrpcEndpoint {
  url: string;
  audience?: string;
  secure: boolean;
}

const grpcIdentityTokenCache = new Map<
  string,
  {
    token: string;
    expiresAt: number;
  }
>();

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : undefined;
}

function parseGrpcEndpoint(
  rawValue: string,
  defaultPort: number,
): ParsedGrpcEndpoint {
  try {
    const parsedUrl = new URL(rawValue);
    const isSecure = parsedUrl.protocol === 'https:';

    if (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') {
      return {
        url: `${parsedUrl.hostname}:${parsedUrl.port || (isSecure ? '443' : '80')}`,
        audience: isSecure ? parsedUrl.origin : undefined,
        secure: isSecure,
      };
    }
  } catch {
    // Fall back to host:port parsing below.
  }

  if (rawValue.includes(':')) {
    return {
      url: rawValue,
      secure: false,
    };
  }

  return {
    url: `${rawValue}:${defaultPort}`,
    secure: false,
  };
}

function getJwtExpiryTimestamp(token: string): number | undefined {
  const [, payload] = token.split('.');

  if (!payload) {
    return undefined;
  }

  try {
    const decodedPayload = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    ) as {
      exp?: number;
    };

    return typeof decodedPayload.exp === 'number'
      ? decodedPayload.exp * 1000
      : undefined;
  } catch {
    return undefined;
  }
}

async function fetchCloudRunIdentityToken(audience: string): Promise<string> {
  const cachedToken = grpcIdentityTokenCache.get(audience);

  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  const metadataUrl = new URL(
    'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity',
  );
  metadataUrl.searchParams.set('audience', audience);
  metadataUrl.searchParams.set('format', 'full');

  const response = await fetch(metadataUrl, {
    headers: {
      'Metadata-Flavor': 'Google',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Cloud Run identity token for ${audience}: ${response.status} ${response.statusText}`,
    );
  }

  const token = await response.text();

  grpcIdentityTokenCache.set(audience, {
    token,
    expiresAt: getJwtExpiryTimestamp(token) ?? Date.now() + 55 * 60_000,
  });

  return token;
}

export function getEnv(name: string, fallback: string): string {
  return readEnv(name) ?? fallback;
}

export function isCloudRunEnvironment(): boolean {
  return Boolean(readEnv('K_SERVICE') || readEnv('K_REVISION'));
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

export function getGrpcClientTransportOptions(
  envName: string,
  defaultPort: number,
): GrpcClientTransportOptions {
  const parsedEndpoint = parseGrpcEndpoint(
    getEnv(envName, `localhost:${defaultPort}`),
    defaultPort,
  );

  return {
    url: parsedEndpoint.url,
    credentials: parsedEndpoint.secure ? credentials.createSsl() : undefined,
  };
}

export function getGrpcClientAudience(
  envName: string,
  defaultPort: number,
): string | undefined {
  return parseGrpcEndpoint(
    getEnv(envName, `localhost:${defaultPort}`),
    defaultPort,
  ).audience;
}

export function getGrpcServerUrl(envName: string, defaultPort: number): string {
  return getEnv(envName, `0.0.0.0:${defaultPort}`);
}

export function getCloudRunGrpcServerUrl(defaultPort: number): string {
  return `0.0.0.0:${getNumberEnv('PORT', defaultPort)}`;
}

export function getHttpPort(envName: string, defaultPort: number): number {
  const resolvedEnvName = readEnv(envName) ? envName : 'PORT';
  const rawValue = readEnv(envName) ?? readEnv('PORT');

  if (!rawValue) {
    return defaultPort;
  }

  const parsedValue = Number(rawValue);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`${resolvedEnvName} must be a positive integer`);
  }

  return parsedValue;
}

export async function getCloudRunGrpcMetadata(
  audience?: string,
): Promise<Metadata | undefined> {
  if (!audience || !isCloudRunEnvironment()) {
    return undefined;
  }

  const token = await fetchCloudRunIdentityToken(audience);
  const metadata = new Metadata();
  metadata.add('authorization', `Bearer ${token}`);

  return metadata;
}

export function getMongoConnectionSettings(
  servicePrefix: string,
  defaultDatabaseName: string,
): MongoConnectionSettings {
  const uri = readEnv(`${servicePrefix}_MONGODB_URI`) ?? readEnv('MONGODB_URI');
  const database = getEnv(
    `${servicePrefix}_MONGODB_DB`,
    getEnv('MONGODB_DB', defaultDatabaseName),
  );
  const synchronize = getBooleanEnv(
    `${servicePrefix}_DB_SYNC`,
    getBooleanEnv('DB_SYNC', false),
  );

  if (uri) {
    return {
      uri,
      database,
      synchronize,
    };
  }

  return {
    host: getEnv(
      `${servicePrefix}_MONGODB_HOST`,
      getEnv('MONGODB_HOST', 'localhost'),
    ),
    port: getNumberEnv(
      `${servicePrefix}_MONGODB_PORT`,
      getNumberEnv('MONGODB_PORT', 27017),
    ),
    database,
    synchronize,
  };
}
