# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# 1. Copy package files from frontend folder
COPY frontend/package*.json ./
RUN npm install

# 2. Copy frontend source code
COPY frontend/ .

# 3. Capture the Render environment variable at build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Nginx config for React Router
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]