FROM node:22-alpine AS base

WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN corepack enable

FROM base AS deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM base AS builder

ARG ADMIN_API_PROXY_URL=http://localhost:8080
ENV ADMIN_API_PROXY_URL=${ADMIN_API_PROXY_URL}
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ARG ADMIN_API_PROXY_URL=http://localhost:8080
ENV ADMIN_API_PROXY_URL=${ADMIN_API_PROXY_URL}

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
