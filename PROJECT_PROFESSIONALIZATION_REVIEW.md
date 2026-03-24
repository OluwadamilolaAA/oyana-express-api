# Oyana Express API Professionalization Review

Date: 2026-03-24

## Scope

This review is based on a scan of the `oyana-express-api` microservice workspace, including:

- `apps/oyana-auth`
- `apps/oyana-user`
- `apps/oyana-driver`
- `apps/oyana-express-api`
- `libs/packages`

The goal is to identify what makes the project feel unfinished or risky in its current state, and to suggest concrete changes that would make it more professional, production-ready, and easier to maintain.

## Executive Summary

The project has the beginnings of a sensible service split, but it still looks like a partially scaffolded prototype rather than a production microservice system.

The main problems are not cosmetic. They are architectural and operational:

- insecure defaults are present
- service wiring is inconsistent
- ports and proto paths are misconfigured
- there is very little real test coverage
- several modules still contain starter code or placeholder implementations
- configuration and database access patterns are not production-safe

At a high level, this project should be treated as a foundation that needs hardening, not as a finished service platform.

## What Is Good

There are a few positive directions already in place:

- the repo is split into separate apps for auth, user, driver, and gateway concerns
- gRPC contracts are centralized in `libs/packages/src/proto`
- auth-related entities such as sessions, credentials, audit logs, and OTPs are already modeled
- password hashing is being used instead of storing plaintext passwords
- session persistence and audit logging show the right intent for a real auth service

Those are good foundations. The issue is that the current implementation is uneven and not yet disciplined.

## Critical Issues

### 1. Insecure JWT secret fallback

File:

- `apps/oyana-auth/src/oyana-auth.module.ts`

Problem:

```ts
secret: process.env.JWT_SECRET || 'supersecret'
```

Why this is bad:

- a hardcoded fallback secret is a production security failure
- if the environment variable is missing, the app still starts with a known secret
- tokens become forgeable by anyone who knows the codebase

What to do:

- remove the fallback completely
- fail fast at startup if `JWT_SECRET` is missing
- move all config loading behind a proper configuration module

### 2. All microservices are configured to use the same gRPC port

Files:

- `apps/oyana-auth/src/main.ts`
- `apps/oyana-user/src/main.ts`
- `apps/oyana-driver/src/main.ts`

Problem:

- each service binds gRPC to `0.0.0.0:50051`

Why this is bad:

- only one service can own that port on the same host
- the current microservice design cannot run correctly as a full local stack
- this is a basic environment and deployment mistake

What to do:

- give each service its own port via environment variables
- define explicit defaults such as auth `50051`, user `50052`, driver `50053`
- document the service map in the README

### 3. Hardcoded database configuration and unsafe schema sync

Files:

- `apps/oyana-auth/src/database.providers.ts`
- `apps/oyana-user/src/database.providers.ts`

Problems:

- MongoDB host and port are hardcoded to `localhost:27017`
- database names are hardcoded
- `synchronize: true` is enabled

Why this is bad:

- the code is tied to one local development setup
- deployments become brittle and environment-specific
- `synchronize: true` is dangerous outside quick local experimentation
- there is no migration discipline or schema control

What to do:

- move all database settings into environment-based configuration
- disable `synchronize` outside local development
- introduce a migration strategy or a controlled schema evolution process
- standardize a `ConfigModule`-based setup across every app

### 4. Dependency injection in auth is incomplete and likely to fail at runtime

Files:

- `apps/oyana-auth/src/oyana-auth.module.ts`
- `apps/oyana-auth/src/Services/oyana-auth.service.ts`
- `apps/oyana-auth/src/Services/audit-log.service.ts`
- `apps/oyana-auth/src/Services/oyana-session.service.ts`
- `apps/oyana-auth/src/Services/generate-otp.service.ts`
- `apps/oyana-auth/src/Services/credential.service.ts`

Problems:

- `OyanaAuthService` depends on `AuditLogService` and `SessionService`
- the module only registers `OyanaAuthService`
- auth support services use `@InjectRepository(...)`, but the module does not import a matching `TypeOrmModule.forFeature(...)`

Why this is bad:

- the service structure implies repository-backed services, but the module setup does not fully support that pattern
- this is the kind of wiring problem that causes runtime injection failures and unstable startup behavior
- it also signals inconsistent database access strategy inside the same app

What to do:

- choose one data-access style and apply it consistently
- if using TypeORM repositories, use `TypeOrmModule.forRoot(...)` and `TypeOrmModule.forFeature(...)`
- if using custom providers, stop mixing them with `@InjectRepository`
- register all auth services explicitly in the module

### 5. The gateway is still mostly a starter template

Files:

- `apps/oyana-express-api/src/app.controller.ts`
- `apps/oyana-express-api/src/app.service.ts`
- `apps/oyana-express-api/src/app.module.ts`

Problems:

- the gateway exposes a `getHello()` endpoint
- the service still returns `Hello World!`
- the app imports gRPC clients but does not yet provide meaningful orchestration logic

Why this is bad:

- the public-facing entrypoint of the system is effectively placeholder code
- this makes the project look unfinished immediately
- it weakens confidence in the actual system boundary and service composition

What to do:

- define the purpose of the gateway clearly
- either make it a real HTTP API facade over gRPC services or remove it until it is ready
- replace scaffold leftovers with actual controllers, DTOs, and use cases

## High-Priority Quality Problems

### 6. Test files are still scaffold-level and in some cases invalid

Files:

- `apps/oyana-auth/src/oyana-auth.controller.spec.ts`
- `apps/oyana-user/src/oyana-user.controller.spec.ts`

Problems:

- the auth controller test expects `getHello()` even though the controller exposes `login`, `register`, and `validateToken`
- the user controller spec is basically empty

Why this is bad:

- the presence of tests gives a false sense of quality
- these tests do not verify real behavior
- they suggest the code was scaffolded and not finished

What to do:

- remove starter tests immediately
- replace them with meaningful unit and integration tests
- test actual use cases: registration, login, token validation, user creation, password verification, duplicate email handling, and failure paths

### 7. Driver service is a placeholder, not a real microservice

Files:

- `apps/oyana-driver/src/oyana-driver.service.ts`
- `apps/oyana-driver/src/oyana-driver.module.ts`

Problem:

- the driver service still only returns `Hello World!`

Why this is bad:

- it does not justify being a separate service yet
- it increases operational and cognitive overhead without delivering real capability

What to do:

- either implement actual driver-domain functionality
- or remove/defer the service until there is a stable driver domain model and contract

### 8. Proto path usage is inconsistent

Files:

- `apps/oyana-auth/src/oyana-auth.module.ts`
- `apps/oyana-auth/src/main.ts`
- `apps/oyana-express-api/src/app.module.ts`

Problems:

- some files use `/libs/packages/proto/...`
- others use `/libs/packages/src/proto/...`

Why this is bad:

- file path inconsistency is a classic build and deployment footgun
- it increases the chance of environment-specific failure

What to do:

- define one canonical proto location
- centralize proto path construction in a shared helper
- avoid hardcoding repeated path expressions in multiple apps

### 9. Configuration management is too primitive

Files:

- multiple bootstrap and module files

Problems:

- ports, URLs, JWT secret, and DB settings are read ad hoc
- there is no centralized validation of required configuration
- the apps can start in partially broken states

Why this is bad:

- operational issues are discovered too late
- debugging environment issues becomes harder than it should be

What to do:

- use `@nestjs/config`
- define a validated config schema
- fail startup if required values are missing or malformed

### 10. Input validation is missing

Files:

- service and controller layers across the repo

Problems:

- request objects are passed through directly
- there are no DTO validation rules
- there are no global validation pipes

Why this is bad:

- invalid input flows too deep into the system
- business rules become scattered and inconsistent
- error messages become less predictable

What to do:

- define DTOs for external boundaries even for gRPC requests
- validate email, password, phone, role, token, and identifier shapes
- enable validation pipes at bootstrap time where applicable

## Code-Level Problems

### 11. The auth service contains useful logic, but it is too loosely structured

File:

- `apps/oyana-auth/src/Services/oyana-auth.service.ts`

Problems:

- it mixes transport-facing concerns, business logic, token generation, and session behavior in one service
- it relies on raw request payloads rather than validated command objects
- formatting and style are inconsistent in places

Examples:

- `validateToken()` catches all token errors and silently converts them into a generic invalid response
- `refreshToken()` reconstructs partial `User` objects just to sign new tokens
- the service naming and folder naming (`Services`) are inconsistent with common Nest conventions

What to do:

- split the service into clearer use-case services or domain methods
- separate token issuing, session management, and user registration/login workflows
- move folder names to lowercase and normalize naming conventions

### 12. OTP generation is not strong enough for a security-sensitive flow

File:

- `apps/oyana-auth/src/Services/generate-otp.service.ts`

Problem:

```ts
Math.floor(100000 + Math.random() * 900000)
```

Why this is bad:

- `Math.random()` is not suitable for security-sensitive token generation

What to do:

- use Node's `crypto` module for OTP generation
- add rate limiting and resend constraints
- store OTP attempts and throttle verification failures

### 13. User entity and user service need stronger domain discipline

Files:

- `apps/oyana-user/src/user.entity.ts`
- `apps/oyana-user/src/oyana-user.service.ts`

Problems:

- the user entity stores password directly on the user record instead of separating identity/account concerns clearly
- no uniqueness/index strategy is shown for email
- no validation exists for `name`, `phone`, or `role`
- service logic is simple CRUD-plus-auth logic with very little domain boundary enforcement

Why this is bad:

- user lifecycle, credentials, and profile concerns are too tightly coupled
- schema integrity depends too heavily on application behavior

What to do:

- add database indexes and uniqueness constraints where appropriate
- formalize user role handling and allowed transitions
- separate identity/auth data from user profile data if auth is its own service

### 14. Inconsistent code style reduces professionalism

Files:

- multiple files across the repo

Examples:

- `Services` is capitalized as a folder name while other folders are lowercase
- indentation and spacing vary in several files
- double quotes and single quotes are mixed in some entity files
- some files retain scaffold imports or unused imports

Why this is bad:

- inconsistency makes the repo feel uncurated
- it slows code review and onboarding

What to do:

- enforce Prettier and ESLint consistently
- add import sorting if desired
- use one folder naming convention throughout the repo
- clean scaffold leftovers aggressively

## Structural Problems

### 15. Service boundaries are not yet clearly justified

Current apps:

- auth
- user
- driver
- gateway

Problem:

- some services are meaningful, but some are still too thin or too incomplete
- the system has microservice overhead before the domain boundaries are mature

Why this matters:

- microservices add deployment, discovery, observability, and contract-management complexity
- if services are not independently meaningful, the architecture becomes expensive without real benefit

What to do:

- define clear domain ownership for each app
- document which service owns which data and workflows
- consider consolidating services temporarily if the boundaries are still evolving

### 16. Shared library structure is too light for a real platform

Files:

- `libs/packages/src/index.ts`
- `libs/packages/src/packages.module.ts`

Problem:

- the shared lib mostly re-exports generated types and a placeholder module/service
- there is no shared config library, error library, validation library, logging library, or transport helper layer

Why this is bad:

- repeated boilerplate will spread across services
- common rules will drift over time

What to do:

- turn `libs/packages` into a proper shared platform layer or split it into multiple focused libs
- good candidates are config, logging, grpc helpers, DTO contracts, and shared exception models

### 17. There is no clear observability strategy

Problem:

- there is no visible structured logging standard
- there are no health endpoints or health checks
- there is no metrics or tracing integration

Why this is bad:

- diagnosing production issues becomes difficult
- distributed systems without observability become operationally expensive very quickly

What to do:

- introduce structured logging with request and correlation IDs
- add health checks for HTTP and gRPC dependencies
- define a minimal monitoring and metrics strategy early

### 18. Documentation is not project-specific

Files:

- `README.md`

Problem:

- the root README is still the default Nest starter text

Why this is bad:

- there is no explanation of system architecture, startup order, ports, env vars, or service contracts
- new contributors have no reliable source of truth

What to do:

- replace the starter README with real project documentation
- include local setup steps, required env vars, service map, proto generation flow, and development commands

## Functions and Specific Areas That Need Improvement

### `OyanaAuthService.login`

Needs improvement because:

- it depends entirely on another service call without a clear fallback or transport error policy
- it creates tokens and sessions directly in the same method
- it should be backed by explicit request validation and clearer failure classification

### `OyanaAuthService.validateToken`

Needs improvement because:

- it collapses every error into a boolean response
- it does not differentiate expired token, malformed token, revoked session, or wrong issuer/audience
- it logs invalid token events under a login-failed event type, which is semantically noisy

### `SessionService.createSession`

Needs improvement because:

- it accepts `meta: any`
- session metadata is under-typed
- there is no clear model for device/session context

### `OTPService.generateOTP`

Needs improvement because:

- random generation is weak
- there is no anti-abuse protection
- no rate limiting, resend rules, or maximum active OTP policy is visible

### `OyanaUserService.createUser`

Needs improvement because:

- it mixes persistence, conflict checking, password hashing, and object creation in one basic service method
- user creation rules are minimal and not validated
- required fields such as `phone` and `role` are not clearly enforced in the same method

## What Would Make This Project Feel Professional

If this project were being prepared for serious team development or production use, the following changes would make the biggest difference:

### Engineering discipline

- remove all scaffold code
- standardize naming, formatting, and module layout
- enforce stricter TypeScript settings
- define real code ownership boundaries

### Security discipline

- remove insecure defaults
- validate environment variables on startup
- add auth guards and boundary validation
- use cryptographically secure OTP generation

### Architecture discipline

- assign unique ports and stable service URLs
- make the gateway real or remove it
- clarify whether auth owns credentials only or the full user lifecycle
- reduce accidental coupling between services

### Data discipline

- stop using `synchronize: true` as the default approach
- document schemas and indexes
- formalize migrations and environment-specific DB settings

### Testing discipline

- replace boilerplate tests with behavior-based tests
- add integration tests for gRPC boundaries
- test auth failure modes, not just happy paths

### Operational discipline

- add health checks
- add structured logs
- define configuration contracts
- document how to run the system locally and in deployed environments

## Recommended Improvement Plan

### Phase 1: Fix immediate blockers

1. Remove hardcoded JWT secret fallback.
2. Move service ports to environment variables and assign unique ports.
3. Standardize proto paths.
4. Fix auth module provider registration and repository wiring.
5. Replace the README with project-specific setup documentation.

### Phase 2: Make the codebase stable

1. Replace starter tests with real unit and integration tests.
2. Add configuration validation.
3. Add DTO validation and stronger input checks.
4. Clean up placeholder gateway and driver code.
5. Normalize code style and folder naming.

### Phase 3: Make the platform production-ready

1. Introduce structured logging and health checks.
2. Formalize DB migration strategy.
3. Revisit service boundaries and shared library design.
4. Add observability, error handling standards, and deployment documentation.
5. Build a real gateway orchestration layer if HTTP exposure is required.

## Final Assessment

This project has promising raw direction, but it is not yet professional in its current form.

The strongest signal is that the codebase mixes real domain intent with starter-template leftovers and incomplete service wiring. That combination is risky because it looks more complete than it actually is.

The right next step is not adding more features immediately. The right next step is hardening the foundation: configuration, ports, module wiring, validation, tests, and documentation.

Once those are cleaned up, the project will be much easier to extend without accumulating fragile behavior.