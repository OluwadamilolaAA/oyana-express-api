# ─── Build stage ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

# Which NestJS app to build (e.g. oyana-auth, oyana-user, oyana-driver, oyana-express-api)
ARG SERVICE
ENV SERVICE=${SERVICE}

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx nest build ${SERVICE}

# ─── Production stage ────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

ARG SERVICE
ENV SERVICE=${SERVICE} \
    NODE_ENV=production

WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output
COPY --from=builder /app/dist ./dist

# Proto files must be reachable at process.cwd()/libs/packages/src/proto at runtime
COPY libs/packages/src/proto ./libs/packages/src/proto

CMD node dist/apps/${SERVICE}/main.js
