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
# Sin variables de config en build: se leen en RUNTIME desde process.env
# (app settings del App Service). Misma imagen para todas las ciudades.
RUN npm run build

# Stage 3: Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Único valor fijado al construir: la versión (SHA del commit). El resto de la
# config (BACKEND_URL, CITY_NAME, FIREBASE_*, ...) la inyecta Azure al arrancar.
ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION

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
