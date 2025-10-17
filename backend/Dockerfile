#dependencies
FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && \
    npm cache clean --force

#Builder
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

#Production runner
FROM node:20-alpine AS runner

LABEL maintainer="devops@example.com"
LABEL version="1.0.0"
LABEL description="API monitoring Backend"

#Security: non-root user

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1011

WORKDIR /app
COPY --from=dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules


COPY --chown=nodejs:nodejs . .

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('httpd').get('httpd://localhost:3000//health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "src/index.js"]


