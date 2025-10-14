# 🌱 Latacunga Clean - Sistema de Gestión de Residuos Sólidos

[![React Native](https://img.shields.io/badge/React%20Native-0.74-61DAFB.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54-000020.svg)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791.svg)](https://postgresql.org/)

Sistema completo para la gestión inteligente de residuos sólidos en Latacunga, Ecuador. Incluye aplicación móvil React Native y backend Node.js con geolocalización avanzada.

## ✨ Características Principales

### 📱 Aplicación Móvil
- 🗺️ **Mapa interactivo** con React Native Maps y puntos de acopio diferenciados por colores
- 📍 **Lista ordenada por distancia** - encuentra el punto más cercano usando GPS
- 🧭 **Navegación integrada** con Waze, Google Maps y Apple Maps
- 📊 **Sistema de reportes** completo con fotos y geolocalización
- 🎮 **Gamificación** - puntos, niveles y logros por acciones ambientales
- 🔐 **Autenticación JWT** segura (login/register)
- 📚 **Educación ambiental** con contenido categorizado por tipos de residuos
- 🔔 **Push Notifications** configuradas con Expo
- 💾 **Modo offline** con AsyncStorage
- 📊 **Analytics** integrados para tracking

### 🖥️ Backend API
- 🚀 **API REST** completa con Node.js y Express
- 🗄️ **PostgreSQL + PostGIS** para datos geográficos y cálculos de distancia
- 🔍 **Consultas de proximidad** usando ST_Distance para ordenar por distancia
- 🔐 **Middleware de autenticación** JWT y validación
- 📦 **Configuración para MongoDB y Redis** (archivos listos, no implementado)
- 🌱 **Base de datos con 10 puntos reales** de Latacunga verificados

### 🎨 Marcadores Diferenciados
- 🟢 **Verde**: Centros de Acopio
- 🔵 **Azul**: Contenedores de Basura  
- 🟠 **Naranja**: Centros de Reciclaje

## 🏗️ Arquitectura del Sistema

```
├── src/                    # Aplicación móvil React Native
│   ├── components/        # Componentes reutilizables
│   ├── screens/          # Pantallas principales
│   ├── navigation/       # Configuración de navegación
│   ├── redux/           # Estado global con Redux Toolkit
│   ├── services/        # Servicios (analytics, offline, notifications)
│   └── utils/           # Utilidades y validaciones
├── backend/               # Servidor Node.js
│   ├── controllers/     # Lógica de negocio
│   ├── routes/         # Rutas de API
│   ├── models/         # Modelos de datos (MongoDB)
│   ├── config/         # Configuraciones (PostgreSQL, MongoDB, Redis)
│   └── seeders/        # Datos de prueba para Latacunga
└── assets/               # Recursos estáticos (iconos, splash)
```

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+
- PostgreSQL 14+ con extensión PostGIS
- Expo CLI (`npm install -g @expo/cli`)
- Git

### 1️⃣ Clonar repositorio
```bash
git clone https://github.com/Branelio/latacunga-clean.git
cd latacunga-clean
```

### 2️⃣ Instalar dependencias
```bash
# App móvil
npm install --legacy-peer-deps

# Backend
cd backend
npm install
```

### 3️⃣ Configurar PostgreSQL
```bash
# Crear base de datos
createdb latacunga_clean

# Habilitar PostGIS
psql -d latacunga_clean -c "CREATE EXTENSION postgis;"

# Poblar con datos de Latacunga
node seeders/seed-collection-points.js
```

### 4️⃣ Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp backend/.env.example backend/.env

# Editar con tus configuraciones de BD
# DATABASE_URL=postgresql://usuario:password@localhost:5432/latacunga_clean
```

### 5️⃣ Ejecutar aplicación
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: App móvil  
npm start
# Escanear QR con Expo Go
```

## 📡 API Endpoints

### Puntos de Acopio
```
GET    /api/collection-points                              # Todos los puntos
GET    /api/collection-points/sorted-by-distance?lat=X&lng=Y  # Ordenados por distancia
GET    /api/collection-points/:id                         # Punto específico
```

### Autenticación
```
POST   /api/auth/login       # Iniciar sesión
POST   /api/auth/register    # Registrar usuario  
GET    /api/auth/profile     # Obtener perfil
```

### Reportes
```
POST   /api/reports          # Crear reporte
GET    /api/reports          # Obtener reportes
PUT    /api/reports/:id      # Actualizar reporte
```

## 🗄️ Base de Datos

### PostgreSQL (Geoespacial)
```sql
collection_points (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  address VARCHAR(255),
  type VARCHAR(100), -- 'Centro de Acopio', 'Contenedor', 'Centro de Reciclaje'
  location GEOGRAPHY(POINT, 4326), -- PostGIS
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
)
```

### MongoDB (Configurado, no implementado)
```javascript
// Modelos disponibles pero no conectados
- users: Información de usuarios
- reports: Reportes ciudadanos  
- notifications: Sistema de notificaciones
```

## 🎯 Funcionalidades Implementadas

### ✅ Completamente Funcional
- [x] **Mapa interactivo** con React Native Maps
- [x] **Marcadores por colores** según tipo de punto
- [x] **Lista ordenada por distancia** con GPS
- [x] **API PostgreSQL + PostGIS** funcionando
- [x] **Sistema de autenticación** JWT
- [x] **Reportes con fotos** y categorización
- [x] **Gamificación completa** (puntos, niveles, logros)
- [x] **Educación ambiental** con contenido
- [x] **Navegación externa** (Waze, Google Maps)
- [x] **10 puntos reales** de Latacunga
- [x] **Push notifications** configuradas
- [x] **Modo offline** básico
- [x] **Testing con Jest** configurado

### 🔧 Configurado pero no implementado
- [ ] Conexión activa a MongoDB
- [ ] Sistema de caché con Redis
- [ ] Docker containerización
- [ ] Dashboard administrativo web

### 🚧 Por implementar
- [ ] Optimización de rutas avanzadas
- [ ] Chat en tiempo real
- [ ] Integración con servicios municipales
- [ ] Dashboard web administrativo
- [ ] Análisis predictivo con ML

## 🌍 Datos Reales de Latacunga

El sistema incluye 10 puntos verificados:
- **Coordenadas base**: -0.9329, -78.615 (Parque Vicente León)
- **4 Contenedores**: Ubicaciones urbanas principales
- **4 Centros de Acopio**: Puntos municipales y comunitarios
- **2 Centros de Reciclaje**: Especializados en materiales reciclables

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage report
npm run test:coverage
```

**Tests incluidos:**
- ✅ Componentes UI (CustomButton, CustomInput)
- ✅ Utilidades (validation.js)
- ✅ Pantallas (LoginScreen)

## 🎮 Sistema de Gamificación

### Puntos por Acción
- 📝 Crear reporte: **10 puntos**
- ✅ Reporte verificado: **20 puntos**  
- ♻️ Reciclaje: **15 puntos**
- 📍 Check-in: **5 puntos**

### Niveles de Usuario
- 🌱 **Nuevo Ciudadano** (0-49 pts)
- 🌿 **Ciudadano Activo** (50-199 pts)  
- 🌳 **Eco-Guerrero** (200-499 pts)
- 🏆 **Guardián Verde** (500-999 pts)
- ⭐ **Héroe Ambiental** (1000+ pts)

## 📱 Pantallas Implementadas

1. **SplashScreen** - Pantalla de carga
2. **LoginScreen** - Autenticación
3. **RegisterScreen** - Registro de usuarios
4. **MapScreen** - Mapa principal con puntos
5. **ProfileScreen** - Perfil con gamificación
6. **ReportScreen** - Crear reportes con foto
7. **ReportsListScreen** - Historial de reportes
8. **EducationScreen** - Contenido educativo
9. **CollectionPointDetailScreen** - Detalles de puntos

## 🔐 Seguridad

- ✅ Autenticación JWT
- ✅ Encriptación bcrypt 
- ✅ Validación de inputs
- ✅ CORS configurado
- ✅ Rate limiting preparado

## 🤝 Contribuir

1. Fork el proyecto
2. Crea rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a rama (`git push origin feature/nueva-funcionalidad`)  
5. Abrir Pull Request

## 📊 Tecnologías Principales

**Frontend:**
- React Native 0.74 + Expo 54
- Redux Toolkit para estado global
- React Native Maps para geolocalización
- Expo Location, Camera, Notifications

**Backend:**
- Node.js + Express.js
- PostgreSQL + PostGIS (activo)
- MongoDB configurado (no conectado)
- Redis configurado (no conectado)
- JWT para autenticación

## 📄 Licencia

MIT License - Ver archivo LICENSE

## 👥 Desarrollado por

**Branel** - Proyecto Latacunga Clean  
📧 Contacto: [GitHub Issues](https://github.com/Branelio/latacunga-clean/issues)

---

<div align="center">
  <b>🌱 Por una Latacunga más limpia y sostenible 🌱</b>
  
  *Sistema funcional con mapas, gamificación, reportes y datos reales de Latacunga*
</div>