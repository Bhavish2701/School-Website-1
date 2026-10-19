# ==============================================================================
# Multi-stage Production Dockerfile for Sri Vidya School Backend API
# Architecture: Node.js 20 Alpine (Distroless/Minimal, Non-root User, dumb-init)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Dependencies Builder
# ------------------------------------------------------------------------------
FROM node:20-alpine AS dependencies

WORKDIR /usr/src/app

# Install build dependencies if needed
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# ------------------------------------------------------------------------------
# Stage 2: Production Runtime
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner

# Install dumb-init for proper signal handling and zombie process reaping
RUN apk add --no-cache dumb-init

ENV NODE_ENV=production
ENV PORT=5000

WORKDIR /usr/src/app

# Copy production node_modules from builder
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Copy application source code
COPY --chown=node:node package*.json ./
COPY --chown=node:node src/ ./src/

# Switch to non-privileged system user 'node'
USER node

# Health check probe against local Express endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:5000/api/v1/health/live', (r) => { if (r.statusCode !== 200) process.exit(1); })"

# Expose internal port
EXPOSE 5000

# Use dumb-init as PID 1 to gracefully forward SIGINT/SIGTERM to Node
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Launch production server
CMD ["node", "src/server.js"]
