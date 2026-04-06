import { credentials, Metadata, type ChannelCredentials } from '@grpc/grpc-js';
import type { SASLOptions } from 'kafkajs';
import { join } from 'path';

export const DEFAULT_PORTS = {
  authGrpc: 50051,
  userGrpc: 50052,
  driverGrpc: 50053,
  rideGrpc: 50054,
  deliveryGrpc: 50055,
  freightGrpc: 50056,
  pricingGrpc: 50057,
  paymentGrpc: 50058,
  notificationGrpc: 50059,
  locationGrpc: 50060,
  dispatchGrpc: 50061,
  chatGrpc: 50062,
  adminGrpc: 50063,
  gatewayHttp: 3000,
  authHttp: 3001,
  userHttp: 3002,
  driverHttp: 3003,
  rideHttp: 3004,
  deliveryHttp: 3005,
  freightHttp: 3006,
  pricingHttp: 3007,
  paymentHttp: 3008,
  notificationHttp: 3009,
  locationHttp: 3010,
  dispatchHttp: 3011,
  chatHttp: 3012,
  adminHttp: 3013,
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

type KafkaSaslMechanism = 'plain' | 'scram-sha-256' | 'scram-sha-512';

export interface KafkaTransportOptions {
  client: {
    clientId: string;
    brokers: string[];
    ssl?: boolean;
    sasl?: SASLOptions;
  };
  consumer: {
    groupId: string;
  };
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

function getKafkaEnv(
  servicePrefix: string,
  variableName: string,
): string | undefined {
  return readEnv(`${servicePrefix}_${variableName}`) ?? readEnv(variableName);
}

function parseKafkaBrokers(rawValue: string): string[] {
  const brokers = rawValue
    .split(',')
    .map((broker) => broker.trim())
    .filter((broker) => broker.length > 0);

  if (brokers.length === 0) {
    throw new Error('KAFKA_BROKERS must contain at least one broker');
  }

  return brokers;
}

export function hasKafkaTransport(servicePrefix: string): boolean {
  return Boolean(getKafkaEnv(servicePrefix, 'KAFKA_BROKERS'));
}

export function getKafkaTransportOptions(
  servicePrefix: string,
  defaultClientId: string,
): KafkaTransportOptions {
  const rawBrokers = getKafkaEnv(servicePrefix, 'KAFKA_BROKERS');

  if (!rawBrokers) {
    throw new Error(
      `${servicePrefix}_KAFKA_BROKERS or KAFKA_BROKERS is required to enable Kafka transport`,
    );
  }

  const username = getKafkaEnv(servicePrefix, 'KAFKA_SASL_USERNAME');
  const password = getKafkaEnv(servicePrefix, 'KAFKA_SASL_PASSWORD');
  const ssl = getKafkaEnv(servicePrefix, 'KAFKA_SSL')
    ? getBooleanEnv(
        `${servicePrefix}_KAFKA_SSL`,
        getBooleanEnv('KAFKA_SSL', false),
      )
    : Boolean(username && password);

  const transportOptions: KafkaTransportOptions = {
    client: {
      clientId:
        getKafkaEnv(servicePrefix, 'KAFKA_CLIENT_ID') ?? defaultClientId,
      brokers: parseKafkaBrokers(rawBrokers),
      ssl,
    },
    consumer: {
      groupId:
        getKafkaEnv(servicePrefix, 'KAFKA_GROUP_ID') ??
        `${defaultClientId}-consumer`,
    },
  };

  if (username && password) {
    const mechanism = (getKafkaEnv(servicePrefix, 'KAFKA_SASL_MECHANISM') ??
      'plain') as KafkaSaslMechanism;

    switch (mechanism) {
      case 'scram-sha-256':
        transportOptions.client.sasl = {
          mechanism: 'scram-sha-256',
          username,
          password,
        };
        break;
      case 'scram-sha-512':
        transportOptions.client.sasl = {
          mechanism: 'scram-sha-512',
          username,
          password,
        };
        break;
      case 'plain':
      default:
        transportOptions.client.sasl = {
          mechanism: 'plain',
          username,
          password,
        };
        break;
    }
  }

  return transportOptions;
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
