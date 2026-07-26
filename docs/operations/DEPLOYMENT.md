# Deployment and Build Guide

This document outlines the production compilation pipeline, environment configurations, containerization steps, and hosting recommendations for the Wealth Management Advisor Console.

---

## 1. Environment Configurations

All application settings, endpoints, and flags are externalized using standard environment configurations. 

Create a `.env.production` file in `apps/advisor-console/` to customize the production values:

```env
# API Gateway Endpoints
VITE_API_BASE_URL=https://api.wealth-advisor.firm.com/api
VITE_WS_STREAM_URL=wss://api.wealth-advisor.firm.com/ws

# Feature Flags
VITE_ENABLE_STRETCH_GOALS=true
VITE_MAINTENANCE_MODE=false

# Session Configurations
VITE_SESSION_TIMEOUT_MS=900000
VITE_WARNING_COUNTDOWN_MS=60000
```

---

## 2. Production Build Execution

Compile the packages in order and bundle the React console application:

```bash
# 1. Clean previous build directories
npm run clean

# 2. Build shared dependencies and core app
npm run build
```

This runs `vite build` within `apps/advisor-console`, producing output in `apps/advisor-console/dist/`.

---

## 3. Web Server Configurations (e.g. Nginx)

For security and routing, the static assets must be served behind an Nginx or similar web proxy.

### SPA Routing & Cache Control
Since the application uses client-side routing (`react-router-dom`), Nginx must fallback to `index.html` for unknown paths.

```nginx
server {
    listen 443 ssl http2;
    server_name advisor-console.firm.com;

    root /usr/share/nginx/html;
    index index.html;

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;

    # SPA Routing Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets caching (Cache-Control: immutable)
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, no-transform, immutable";
    }

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Content-Security-Policy "default-src 'self'; connect-src 'self' wss://api.wealth-advisor.firm.com; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self';" always;
}
```

---

## 4. Containerization (Docker)

To host the console app and the mock API server as microservices, use the following `Dockerfile` guidelines.

### Frontend App Dockerfile (`apps/advisor-console/Dockerfile`)
```dockerfile
# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY packages/ ./packages/
COPY apps/advisor-console/ ./apps/advisor-console/

RUN npm ci
RUN npm run build --workspace=apps/advisor-console

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/apps/advisor-console/dist /usr/share/nginx/html
COPY apps/advisor-console/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Mock API Server Dockerfile (`packages/mock-server/Dockerfile`)
```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
COPY packages/mock-server/ ./packages/mock-server/

RUN npm ci --workspace=packages/mock-server
EXPOSE 3001
CMD ["npm", "start", "--workspace=packages/mock-server"]
```
