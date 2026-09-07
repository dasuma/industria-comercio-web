# Requiere `output: 'standalone'` en next.config.ts

FROM node:20-slim AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
# NPM_TOKEN es necesario para resolver @dasuma/pradma-ui desde GitHub Packages (ver .npmrc)
ARG NPM_TOKEN
ENV NPM_TOKEN=$NPM_TOKEN
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# NEXT_PUBLIC_* se inlinean en el bundle en build time: deben venir como build-args
# (el workflow los pasa desde GitHub Secrets). Los app settings de Azure NO sirven para esto.
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_BLOB_URL
ARG NEXT_PUBLIC_CITY_URL
ARG NEXT_PUBLIC_APP_VERSION
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_CITY_NAME
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL \
    NEXT_PUBLIC_BLOB_URL=$NEXT_PUBLIC_BLOB_URL \
    NEXT_PUBLIC_CITY_URL=$NEXT_PUBLIC_CITY_URL \
    NEXT_PUBLIC_APP_VERSION=$NEXT_PUBLIC_APP_VERSION \
    NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME \
    NEXT_PUBLIC_CITY_NAME=$NEXT_PUBLIC_CITY_NAME \
    NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY \
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN \
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID \
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET \
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID \
    NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID
RUN npm run build

# Stage 3: Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
