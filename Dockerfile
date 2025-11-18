# Multi-stage build
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM python:3.10-slim as backend
WORKDIR /app/backend
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .

FROM nginx:alpine
# Copiar frontend build
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html
# Copiar backend
COPY --from=backend /app/backend /app/backend
# Copiar nginx config
COPY frontend/nginx.conf /etc/nginx/nginx.conf
# Instalar Python y dependencias para backend
RUN apk add --no-cache python3 py3-pip
RUN pip3 install --no-cache-dir gunicorn
COPY backend/requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt
# Script de inicio
COPY start.sh /start.sh
RUN chmod +x /start.sh
EXPOSE 80
CMD ["/start.sh"]