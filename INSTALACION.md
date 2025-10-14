# 📋 Guía de Instalación - Sistema de Geolocalización de Residuos Latacunga

## 🎯 Objetivo
Esta guía te permitirá instalar y ejecutar el sistema completo de geolocalización de puntos de recolección de residuos sólidos en Latacunga, Ecuador.

## 📋 Prerrequisitos del Sistema

### 1. Software Requerido
- **Node.js** versión 18 o superior → [Descargar aquí](https://nodejs.org/)
- **Docker Desktop** → [Descargar aquí](https://www.docker.com/products/docker-desktop/)
- **Git** → [Descargar aquí](https://git-scm.com/)
- **Expo CLI** (se instalará globalmente)

### 2. Verificar Instalaciones
Abre una terminal/PowerShell y ejecuta:
```bash
node --version    # Debe mostrar v18.x.x o superior
npm --version     # Debe mostrar una versión
docker --version  # Debe mostrar la versión de Docker
git --version     # Debe mostrar la versión de Git
```

## 🚀 Instalación Paso a Paso

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/Branelio/latacunga-clean.git
cd latacunga-clean
```

### Paso 2: Instalar Expo CLI Globalmente
```bash
npm install -g expo-cli
```

### Paso 3: Configurar Variables de Entorno
Crea un archivo `.env` en la carpeta raíz del proyecto:
```env
# Base de datos PostgreSQL
POSTGRES_DB=latacunga_geo
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Base de datos MongoDB
MONGODB_URI=mongodb://localhost:27017/latacunga_users
MONGODB_DATABASE=latacunga_users

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_2024

# Puerto del servidor
PORT=3000

# URLs de API
API_BASE_URL=http://localhost:3000
```

### Paso 4: Configurar el Backend

#### 4.1 Navegar a la carpeta del backend
```bash
cd backend
```

#### 4.2 Instalar dependencias del backend
```bash
npm install
```

#### 4.3 Crear archivo de configuración del backend
Crear archivo `.env` en la carpeta `backend/`:
```env
PORT=3000
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=latacunga_geo
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
MONGODB_URI=mongodb://localhost:27017/latacunga_users
REDIS_URL=redis://localhost:6379
JWT_SECRET=tu_clave_secreta_muy_segura_2024
```

### Paso 5: Configurar el Frontend (React Native)

#### 5.1 Volver a la carpeta raíz
```bash
cd ..
```

#### 5.2 Instalar dependencias del frontend
```bash
npm install
```

## 🐳 Configuración con Docker

### Paso 6: Inicializar las Bases de Datos

#### 6.1 Iniciar servicios con Docker Compose
```bash
docker-compose up -d
```

#### 6.2 Verificar que los contenedores estén ejecutándose
```bash
docker ps
```
Debes ver estos contenedores:
- `latacunga-postgis` (PostgreSQL + PostGIS)
- `latacunga-mongodb` (MongoDB)
- `latacunga-redis` (Redis)
- `adminer` (Administrador PostgreSQL)
- `mongo-express` (Administrador MongoDB)

### Paso 7: Poblar las Bases de Datos

#### 7.1 Ejecutar las migraciones y seeders del backend
```bash
cd backend
npm run migrate
npm run seed
```

#### 7.2 Verificar datos en PostgreSQL
- Abrir http://localhost:8080 (Adminer)
- Sistema: PostgreSQL
- Servidor: db
- Usuario: postgres
- Contraseña: postgres123
- Base de datos: latacunga_geo

#### 7.3 Verificar datos en MongoDB
- Abrir http://localhost:8081 (Mongo Express)
- Verificar la base de datos `latacunga_users`

## ▶️ Ejecución del Sistema

### Paso 8: Ejecutar el Backend
En una terminal, desde la carpeta `backend/`:
```bash
npm run dev
```
✅ El servidor estará disponible en: http://localhost:3000

### Paso 9: Ejecutar el Frontend
En **otra terminal nueva**, desde la carpeta raíz:
```bash
npx expo start
```
✅ Se abrirá Expo Dev Tools con opciones para:
- Ejecutar en simulador iOS/Android
- Escanear código QR con la app Expo Go
- Ejecutar en navegador web

## 📱 Opciones de Ejecución del Frontend

### Opción 1: Dispositivo Físico
1. Instalar "Expo Go" desde Play Store/App Store
2. Escanear el código QR que aparece en la terminal
3. La app se cargará automáticamente

### Opción 2: Simulador Android
```bash
npx expo start --android
```
(Requiere Android Studio instalado)

### Opción 3: Simulador iOS
```bash
npx expo start --ios
```
(Solo en macOS con Xcode)

### Opción 4: Navegador Web
```bash
npx expo start --web
```

## 🔍 Verificación del Sistema

### Endpoints de API disponibles:
- GET http://localhost:3000/api/collection-points - Ver puntos de recolección
- GET http://localhost:3000/api/health - Estado del servidor
- POST http://localhost:3000/api/users/register - Registro de usuarios
- POST http://localhost:3000/api/users/login - Inicio de sesión

### Funcionalidades principales:
1. **Mapa interactivo** con geolocalización
2. **10 puntos de recolección** reales de Latacunga
3. **Cálculo de distancia** con PostGIS ST_Distance
4. **Autenticación** con JWT
5. **Reportes de residuos** georeferenciados

## 🛠️ Solución de Problemas Comunes

### Error: "Puerto 3000 ocupado"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Error: "Docker no está ejecutándose"
1. Abrir Docker Desktop
2. Esperar que aparezca el ícono en la bandeja del sistema
3. Ejecutar `docker-compose up -d` nuevamente

### Error: "Expo CLI no encontrado"
```bash
npm install -g @expo/cli
```

### Error: "No se conecta a la base de datos"
1. Verificar que Docker esté ejecutándose
2. Revisar que los contenedores estén activos: `docker ps`
3. Reiniciar contenedores: `docker-compose restart`

## 📞 Contacto y Soporte

Si encuentras problemas durante la instalación:
1. Verificar que todos los prerrequisitos estén instalados
2. Revisar que Docker Desktop esté ejecutándose
3. Verificar que los puertos 3000, 5432, 27017, 6379, 8080, 8081 estén disponibles
4. Contactar al equipo de desarrollo para soporte adicional

---

## 📚 Información Adicional

### Estructura del proyecto:
```
latacunga-clean/
├── backend/           # API Node.js + Express
├── src/              # Frontend React Native
├── docker-compose.yml # Configuración Docker
├── package.json      # Dependencias principales
└── README.md         # Documentación académica
```

### Tecnologías utilizadas:
- **Frontend**: React Native 0.74 + Expo 54
- **Backend**: Node.js + Express + JWT
- **Bases de datos**: PostgreSQL + PostGIS, MongoDB, Redis
- **Contenedores**: Docker + Docker Compose
- **Geolocalización**: PostGIS ST_Distance algorithm

¡Listo para usar el sistema de geolocalización de residuos de Latacunga! 🎉