# Dockerfile para el Backend de Latacunga Clean
FROM node:18-alpine

# Información del mantenedor
LABEL maintainer="Latacunga Clean Team"
LABEL description="Backend API para sistema de gestión de residuos sólidos"

# Crear directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache postgresql-client curl

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de Node.js
RUN npm ci --only=production && npm cache clean --force

# Copiar código fuente
COPY . .

# Crear directorio para uploads
RUN mkdir -p uploads

# Configurar permisos
RUN chown -R node:node /app
USER node

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD curl -f http://localhost:3000/api/health || exit 1

# Comando por defecto
CMD ["npm", "start"]
