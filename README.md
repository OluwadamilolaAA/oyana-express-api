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

- `MONGODB_URI`
- `AUTH_MONGODB_URI`
- `USER_MONGODB_URI`
- `DRIVER_MONGODB_URI`
- `AUTH_GRPC_URL`
- `USER_GRPC_URL`
- `DRIVER_GRPC_URL`
- `AUTH_GRPC_BIND_URL`
- `USER_GRPC_BIND_URL`
- `DRIVER_GRPC_BIND_URL`
- `PORT`
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
- `MONGODB_URI` is supported globally, with per-service overrides via `AUTH_MONGODB_URI`, `USER_MONGODB_URI`, and `DRIVER_MONGODB_URI`.
- If a service-specific HTTP port is not set, each app falls back to Render's `PORT` environment variable.
- The gateway exposes Swagger UI at `/docs` and the OpenAPI JSON document at `/docs/openapi.json`.
- The gateway currently exposes overview and health endpoints only.
- See `PROJECT_PROFESSIONALIZATION_REVIEW.md` for the audit and remaining improvement plan.

## Cloud Run

This repo now has a Cloud Run path for the full stack.

- `oyana-express-api` is deployed as the public HTTP gateway.
- `oyana-auth`, `oyana-user`, and `oyana-driver` are deployed as private Cloud Run services that terminate gRPC on Cloud Run's ingress `PORT`.
- Gateway-to-service and service-to-service gRPC calls use Cloud Run service URLs over TLS and attach Google-signed identity tokens when running on Cloud Run.

How it works:

- Local, Docker, and VM deployments still use the existing hybrid HTTP + gRPC model for the internal services.
- On Cloud Run, the internal services switch into a gRPC-only bootstrap mode and listen on `PORT`.
- The deployment workflow deploys `oyana-user` first, then `oyana-auth`, then `oyana-driver`, and finally the public gateway after collecting the private service URLs.

Important deployment note:

- The workflow configures private service invocation for a shared Cloud Run runtime service account.
- `AUTH_GRPC_URL`, `USER_GRPC_URL`, and `DRIVER_GRPC_URL` should be full Cloud Run HTTPS service URLs when deployed on Cloud Run.

## Render Deployment

This repo can be deployed manually from the Render dashboard without using a Blueprint.

Recommended topology:

- `oyana-express-api`: web service
- `oyana-auth`: private service
- `oyana-user`: private service
- `oyana-driver`: private service

Manual setup for each service:

1. Create a new Render service from this repo.
2. Choose `Docker` as the runtime.
3. Point Render at the repo root so it uses the existing `Dockerfile`.
4. Set the `SERVICE` environment variable to one of `oyana-express-api`, `oyana-auth`, `oyana-user`, or `oyana-driver`.
5. Configure the service-specific environment variables shown in `.env.example`.

Health endpoints:

- Gateway: `/health`
- Auth: `/health`
- User: `/health`
- Driver: `/health`

Render free-plan limitation:

- Free instances are only available for web services.
- Free web services cannot receive private network traffic.
- Because this repo uses separate gRPC ports for auth, user, and driver, the full microservice topology still requires paid private services on Render or an architectural change.

If you stay on the free plan, deploy only the gateway on Render or move the internal services to a platform that supports private service-to-service networking.

## GitHub Actions CI/CD

This repo now includes two GitHub Actions workflows:

- `.github/workflows/ci.yml`: lint, unit tests, build validation, and Docker image build checks for all four services.
- `.github/workflows/deploy-gateway-cloud-run.yml`: builds and deploys the full Cloud Run stack, including the three internal gRPC services and the public gateway.

The CI workflow intentionally skips e2e tests under `apps/*/test` because those tests require runtime infrastructure that is not available in a default GitHub runner.

Required GitHub secrets for Cloud Run deployment:

- `GCP_PROJECT_ID`
- `GCP_REGION`
- `GCP_ARTIFACT_REPOSITORY`
- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_SERVICE_ACCOUNT`
- `GCP_CLOUD_RUN_RUNTIME_SERVICE_ACCOUNT`
- `MONGODB_URI`
- `JWT_SECRET`

Recommended one-time Google Cloud setup:

1. Create an Artifact Registry Docker repository in the same region as Cloud Run.
2. Create a deployer service account for GitHub Actions.
3. Create a Cloud Run runtime service account to attach to all four deployed services.
4. Grant the deployer service account at least `roles/run.admin` and `roles/artifactregistry.writer`.
5. Grant the deployer service account `roles/iam.serviceAccountUser` on the runtime service account used by the Cloud Run services.
6. Configure Workload Identity Federation and store the provider resource name and service account email in the GitHub secrets above.

The deployment workflow deploys the services in dependency order and updates the gateway with the resolved Cloud Run service URLs automatically.
