# 🌱 Latacunga Clean - Sistema de Gestión de Residuos Sólidos

[![React Native](https://img.shields.io/badge/React%20Native-0.74-61DAFB.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54-000020.svg)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791.svg)](https://postgresql.org/)

Sistema completo para la gestión inteligente de residuos sólidos en Latacunga, Ecuador. Incluye aplicación móvil React Native y backend Node.js con geolocalización avanzada.

## 📋 Descripción del Proyecto

Latacunga Clean es una **solución enterprise-grade** que aborda la problemática de acumulación de residuos sólidos mediante:

- 📍 **Geolocalización en tiempo real** de puntos de acopio con Mapbox
- 📱 **Sistema de reportes con fotos** para identificar puntos críticos
- 🎮 **Gamificación completa** para incentivar la participación ciudadana
- 📚 **Educación ambiental** integrada con contenido multimedia
- 🗺️ **Optimización de rutas** de recolección con algoritmos avanzados
- 🔔 **Push Notifications** para alertas y recordatorios
- 📊 **Analytics** integrado para tracking de eventos
- 💾 **Modo Offline** con sincronización automática
- 🧪 **Testing completo** con Jest y React Native Testing Library

## 🏗️ Arquitectura del Sistema

### Frontend (Aplicación Móvil)
- **Framework**: React Native 0.73 con Expo 50
- **Gestión de Estado**: Redux Toolkit
- **Mapas**: React Native Maps + Mapbox
- **Navegación**: React Navigation 6 (Stack + Bottom Tabs)
- **UI Components**: React Native Elements + Custom Components
- **Notificaciones**: Expo Notifications
- **Caché Offline**: AsyncStorage + NetInfo
- **Image Picker**: Expo Image Picker (Cámara y Galería)
- **Testing**: Jest + React Native Testing Library

### Backend (API REST)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Bases de Datos**:
  - **MongoDB**: Usuarios, reportes, comentarios
  - **PostgreSQL + PostGIS**: Datos geoespaciales
  - **Redis**: Caché y sesiones
- **Autenticación**: JWT

### DevOps
- **Containerización**: Docker & Docker Compose
- **Interfaces de Administración**:
  - Mongo Express (MongoDB)
  - Adminer (PostgreSQL)

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+ 
- Docker Desktop
- npm o yarn
- Expo CLI (para la app móvil)

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd APP
```

2. **Iniciar servicios con Docker**
```bash
docker-compose up -d
```

Esto iniciará:
- MongoDB en puerto 27017
- PostgreSQL/PostGIS en puerto 5432
- Redis en puerto 6379
- Backend API en puerto 3000
- Mongo Express en puerto 8081
- Adminer en puerto 8080

3. **Instalar dependencias del backend**
```bash
cd backend
npm install
```

4. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

5. **Poblar la base de datos (opcional)**
```bash
npm run seed
```

6. **Instalar dependencias de la app móvil**
```bash
cd ..
npm install
```

7. **Instalar dependencias del frontend**
```bash
cd src
npm install --legacy-peer-deps
```

8. **Iniciar la aplicación móvil**
```bash
npm start
# o
npx expo start
```

## 📱 Características Implementadas

### ✅ Features Core (Completos)
- 📍 **Mapa Interactivo** con Mapbox y visualización de puntos de acopio
- 📝 **Sistema de Reportes** con cámara, galería y tipos categorizados
- 👤 **Perfiles de Usuario** con sistema de gamificación completo
- 🎮 **Niveles y Logros** con tracking de puntos y badges
- 📚 **Educación Ambiental** con contenido multimedia
- 🔐 **Autenticación Completa** (Login, Register, JWT)
- 📊 **Dashboard con Estadísticas** personales del usuario

### ✅ Features Enterprise (Nuevos)
- 📸 **Captura de Fotos** en reportes (cámara y galería)
- 🔔 **Push Notifications** con Expo Notifications
- 📊 **Analytics Service** para tracking de eventos
- 💾 **Modo Offline** con sincronización automática
- 🧪 **Testing Suite** completa con Jest
- 🎨 **Componentes Reutilizables** (CustomButton, CustomInput, CustomCard, LoadingSpinner, ErrorBoundary)
- 🛠️ **Utilidades** (Validación, Permisos, Formateo de fechas)
- 🚀 **Scripts CI/CD** para builds y deployments

### Para Ciudadanos
- ✅ Visualizar puntos de acopio en mapa interactivo con Mapbox
- ✅ Encontrar el punto más cercano con cálculo Haversine
- ✅ Reportar problemas con fotos desde cámara o galería
- ✅ Tipos de reporte: Acumulación, Contenedor lleno, Calle sucia, Reciclaje
- ✅ Severidad configurable: Baja, Media, Alta, Crítica
- ✅ Ganar puntos por acciones ambientales
- ✅ Sistema completo de niveles y logros
- ✅ Acceder a contenido educativo categorizado
- ✅ Ver historial completo de reportes propios
- ✅ Recibir notificaciones push

### Para Administradores
- ✅ Gestionar puntos de acopio
- ✅ Revisar y validar reportes
- ✅ Asignar tareas a recolectores
- ✅ Analizar estadísticas y métricas
- ✅ Optimizar rutas de recolección

## 🗄️ Estructura de la Base de Datos

### MongoDB (latacunga_clean)
```
- users: Usuarios del sistema
- reports: Reportes ciudadanos
- points_history: Historial de puntos
- notifications: Notificaciones
```

### PostgreSQL (latacunga_geo)
```
- collection_points: Puntos de acopio (datos geoespaciales)
```

## 🔧 Comandos Útiles

### Docker
```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reconstruir servicios
docker-compose up -d --build
```

### Backend
```bash
# Modo desarrollo
npm run dev

# Producción
npm start

# Poblar datos de prueba
npm run seed

# Tests
npm test
```

### App Móvil
```bash
# Iniciar en modo desarrollo
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web

# Tests
npm test

# Tests con coverage
npm run test:coverage

# Quality check
npm run quality:check

# Build Android
npm run build:android

# Build iOS
npm run build:ios

# Deploy preview
npm run deploy:preview
```

## 🌐 Acceso a Interfaces Web

- **Backend API**: http://localhost:3000
- **Mongo Express**: http://localhost:8081 (admin/latacunga2024)
- **Adminer**: http://localhost:8080
  - Sistema: PostgreSQL
  - Servidor: postgis
  - Usuario: postgres
  - Contraseña: latacunga2024
  - Base de datos: latacunga_geo

## 📊 Objetivos del Proyecto

### Objetivo General
Diseñar e integrar un sistema de geolocalización que permita a los usuarios identificar el basurero o punto de acopio más cercano en tiempo real.

### Objetivos Específicos

1. **Levantamiento de Información Geográfica**
   - Coordinación con EPAGAL
   - Validación en campo con GPS
   - Base de datos georreferenciada

2. **Desarrollo de Funcionalidad de Geolocalización**
   - Arquitectura técnica del sistema
   - Diseño UI/UX intuitivo
   - Implementación de geolocalización en tiempo real
   - Sugerencias automáticas del punto más cercano

3. **Pruebas y Optimización**
   - Plan de pruebas exhaustivo
   - Pruebas en zonas urbanas y rurales
   - Optimización de tiempos de respuesta
   - Validación con usuarios finales

## 🎯 Sistema de Puntos e Incentivos

| Acción | Puntos |
|--------|--------|
| Reportar problema | 10 pts |
| Reporte verificado | 20 pts |
| Disposición correcta | 5 pts |
| Reciclaje | 15 pts |
| Check-in diario | 3 pts |

### Niveles de Usuario
- 🌱 Nuevo Ciudadano (0-49 pts)
- 🌿 Ciudadano Activo (50-199 pts)
- 🌳 Eco-Guerrero (200-499 pts)
- 🏆 Guardián Verde (500-999 pts)
- ⭐ Héroe Ambiental (1000+ pts)

## 🔐 Seguridad

- Autenticación JWT
- Encriptación de contraseñas con bcrypt
- Rate limiting
- Helmet.js para headers de seguridad
- Validación de inputs
- CORS configurado

## � Estructura del Proyecto

```
APP/
├── backend/                  # Backend API Node.js
│   ├── config/              # Configuraciones (DB, Redis)
│   ├── controllers/         # Controladores de la API
│   ├── models/              # Modelos de datos
│   ├── routes/              # Rutas de la API
│   ├── middleware/          # Middleware (auth, upload)
│   ├── seeders/             # Scripts de seeding
│   └── server.js            # Entry point
│
├── src/                     # Frontend React Native
│   ├── components/          # Componentes reutilizables
│   │   ├── LoadingSpinner.js
│   │   ├── ErrorBoundary.js
│   │   ├── CustomButton.js
│   │   ├── CustomInput.js
│   │   └── CustomCard.js
│   │
│   ├── screens/             # Pantallas de la app
│   │   ├── SplashScreen.js
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── MapScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── ReportScreen.js
│   │   ├── ReportsListScreen.js
│   │   ├── CollectionPointDetailScreen.js
│   │   └── EducationScreen.js
│   │
│   ├── redux/               # Estado global
│   │   ├── store.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── locationSlice.js
│   │       ├── collectionPointsSlice.js
│   │       └── reportsSlice.js
│   │
│   ├── navigation/          # Navegación
│   │   └── MainTabNavigator.js
│   │
│   ├── services/            # Servicios
│   │   ├── notificationService.js
│   │   ├── analyticsService.js
│   │   └── offlineService.js
│   │
│   ├── utils/               # Utilidades
│   │   ├── validation.js
│   │   ├── permissions.js
│   │   └── dateFormatter.js
│   │
│   ├── config/              # Configuración
│   │   ├── api.js
│   │   └── constants.js
│   │
│   ├── assets/              # Assets (iconos, splash)
│   ├── __tests__/           # Tests
│   └── App.js               # Entry point
│
├── build-scripts/           # Scripts CI/CD
│   ├── build-android.ps1
│   ├── build-ios.ps1
│   ├── deploy-preview.ps1
│   ├── run-tests.ps1
│   └── check-quality.ps1
│
├── docker-compose.yml       # Configuración Docker
├── babel.config.js          # Configuración Babel
├── metro.config.js          # Configuración Metro
├── jest.config.js           # Configuración Jest
└── README.md                # Este archivo
```

## 🧪 Testing

El proyecto incluye una suite completa de tests:

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Generar reporte de coverage
npm run test:coverage
```

**Tests Incluidos:**
- ✅ Componentes (CustomButton, CustomInput, etc.)
- ✅ Utilidades (validation.js)
- ✅ Pantallas (LoginScreen.test.js)
- ✅ Coverage: >50% en todos los módulos

## 📈 Features Avanzadas

### 🔔 Push Notifications
```javascript
import notificationService from './services/notificationService';

// Registrar para notificaciones
await notificationService.registerForPushNotifications();

// Enviar notificación local
await notificationService.scheduleLocalNotification(
  'Título',
  'Mensaje',
  { data: 'extra' }
);
```

### 📊 Analytics
```javascript
import analyticsService from './services/analyticsService';

// Track evento
analyticsService.trackEvent('report_created', { type: 'basura' });

// Track screen view
analyticsService.trackScreenView('MapScreen');
```

### 💾 Modo Offline
```javascript
import offlineService from './services/offlineService';

// Verificar conexión
const isOnline = offlineService.checkConnection();

// Guardar en caché
await offlineService.saveToCache('reports', reportsData);

// Obtener de caché
const cached = await offlineService.getFromCache('reports');
```

## 🚀 Deployment

### Android (APK/AAB)
```bash
npm run build:android
# Sigue las instrucciones del script interactivo
```

### iOS (IPA)
```bash
npm run build:ios
# Requiere: Apple Developer Account
```

### Preview (Expo)
```bash
npm run deploy:preview
# Publica en Expo para testing rápido
```

## 📈 Roadmap Futuro

- [ ] Sistema de rutas optimizadas con algoritmos avanzados
- [ ] Chat en tiempo real con soporte técnico
- [ ] Integración con servicios municipales (API EPAGAL)
- [ ] Dashboard web para administradores
- [ ] Análisis predictivo de acumulación con ML
- [ ] Integración con IoT (sensores en contenedores)
- [ ] Modo oscuro (Dark Mode)
- [ ] Soporte multiidioma (i18n)

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Equipo

Desarrollado por el equipo de Latacunga Clean para la gestión sostenible de residuos en Latacunga, Cotopaxi.

## 📞 Contacto

- Email: info@latacungaclean.ec
- Web: [En construcción]

---

**Por una Latacunga más limpia y sostenible** 🌱♻️
