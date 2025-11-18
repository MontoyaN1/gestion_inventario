# Build stage
FROM node:18-alpine as build

WORKDIR /app

# ✅ Copiar package.json y package-lock.json primero
COPY package*.json ./

# ✅ Instalar TODAS las dependencias (incluyendo devDependencies)
RUN npm ci

# ✅ Copiar el resto del código
COPY . .

# ✅ Construir la aplicación
RUN npm run build

# Production stage
FROM nginx:alpine

# ✅ Copiar los archivos construidos
COPY --from=build /app/dist /usr/share/nginx/html

# ✅ Copiar configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]