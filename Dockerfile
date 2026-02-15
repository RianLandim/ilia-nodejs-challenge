# Build stage: install deps and build all apps
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps ./apps

RUN pnpm install --frozen-lockfile

# Generate Prisma clients (from app dir so prisma CLI is found) and proto
RUN cd apps/ms-wallet && pnpm exec prisma generate
RUN cd apps/ms-users && pnpm exec prisma generate
RUN pnpm run proto:generate || true

# Build grpc with tsconfig.build.json (output to packages/grpc/dist), expose in node_modules, then build apps
RUN cd /app/packages/grpc && pnpm exec tsc -p tsconfig.build.json \
  && mkdir -p /app/node_modules/@ilia \
  && cp -r /app/packages/grpc/dist /app/node_modules/@ilia/grpc \
  && echo '{"name":"@ilia/grpc","main":"index.js","types":"index.d.ts"}' > /app/node_modules/@ilia/grpc/package.json \
  && cd /app \
  && pnpm --filter @ilia/ms-wallet run build \
  && pnpm --filter @ilia/ms-users run build \
  && pnpm --filter @ilia/web run build

# Runtime image: same tree so each service can run from its app dir
FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps ./apps

# Default (overridden by compose)
CMD ["node", "--version"]
