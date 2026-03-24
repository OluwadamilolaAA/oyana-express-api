# Oyana Express API

NestJS-based microservice workspace for Oyana's auth, user, driver, and gateway services.

## Services

- `oyana-auth`: authentication, sessions, OTP, audit logging
- `oyana-user`: user creation and credential validation
- `oyana-driver`: driver profile management
- `oyana-express-api`: lightweight HTTP gateway and service overview endpoints

## Architecture

- gRPC contracts live in `libs/packages/src/proto`
- generated TypeScript contract types live in `libs/packages/src/generated`
- shared runtime helpers live in `libs/packages/src`
- each service has its own HTTP port and gRPC bind port
- MongoDB is used for auth, user, and driver persistence

## Environment

Create an `.env` file from `.env.example` and set the required values.

Required:

- `JWT_SECRET`

Optional:

- `AUTH_GRPC_URL`
- `USER_GRPC_URL`
- `DRIVER_GRPC_URL`
- `AUTH_GRPC_BIND_URL`
- `USER_GRPC_BIND_URL`
- `DRIVER_GRPC_BIND_URL`
- `GATEWAY_HTTP_PORT`
- `AUTH_HTTP_PORT`
- `USER_HTTP_PORT`
- `DRIVER_HTTP_PORT`
- `MONGODB_HOST`
- `MONGODB_PORT`
- `DB_SYNC`
- service-specific Mongo overrides like `AUTH_MONGODB_DB`

## Local Setup

```bash
npm install
npm run proto:gen
```

Start services in separate terminals:

```bash
npm run start:user
npm run start:auth
npm run start:driver
npm run start:gateway
```

## Default Ports

| Service | HTTP |  gRPC |
| ------- | ---: | ----: |
| Gateway | 3000 |   n/a |
| Auth    | 3001 | 50051 |
| User    | 3002 | 50052 |
| Driver  | 3003 | 50053 |

## Useful Commands

```bash
npm run build
npm run test
npm run test:e2e
npm run format
npm run lint
```

## Notes

- `DB_SYNC` defaults to `false` and should remain disabled outside local development.
- The gateway currently exposes overview and health endpoints only.
- See `PROJECT_PROFESSIONALIZATION_REVIEW.md` for the audit and remaining improvement plan.
