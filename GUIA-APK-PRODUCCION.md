# 📱 Guía Completa: Generar APK de Producción para Latacunga Clean

## 🎯 Objetivo
Crear una APK funcional que se pueda instalar en cualquier dispositivo Android y que se conecte a tu servidor backend en producción.

---

## 📋 PREREQUISITOS

### 1. Cuenta de Expo
```bash
# Si no tienes cuenta, créala en: https://expo.dev
npx expo login
```

### 2. Instalar EAS CLI
```bash
npm install -g eas-cli
```

### 3. Configurar EAS en el Proyecto
```bash
cd C:\Users\Branel\Documents\Proyectos\APP
eas build:configure
```

### 4. Google Maps API Key (OBLIGATORIO para React Native Maps)

**a) Obtener API Key Gratis:**
1. Ve a: https://console.cloud.google.com/
2. Crea un proyecto nuevo: "Latacunga Clean"
3. Habilita estas APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API (opcional)
4. Ve a "Credenciales" → "Crear credenciales" → "Clave de API"
5. Copia la API Key generada

**b) Restringir la API Key (Seguridad):**
- Ve a tu API Key → "Restricciones de aplicación"
- Selecciona "Aplicaciones de Android"
- Agrega el fingerprint SHA-1 de tu app (se genera automáticamente con EAS)

**IMPORTANTE:** Google te da $200 de crédito gratis al mes, suficiente para ~28,000 cargas de mapa.

---

## 🔧 PASO 1: Configurar el Backend en Producción

### Opción A: Usar un Servidor VPS/Cloud (Recomendado)

**Opciones populares:**
- **Railway.app** (Más fácil, $5/mes)
- **Render.com** (Tiene plan gratuito limitado)
- **DigitalOcean** ($6/mes, más control)
- **AWS/GCP** (Más complejo, escalable)

**Pasos para Railway (ejemplo):**

1. Ve a https://railway.app y crea cuenta
2. New Project → Deploy PostgreSQL
3. New Project → Deploy MongoDB
4. New Project → Deploy Redis
5. Deploy tu backend Node.js:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Backend para producción"
   # Conecta con Railway y despliega
   ```

6. Obten tu URL pública: `https://latacunga-clean-backend.up.railway.app`

### Opción B: Usar tu IP Pública (Desarrollo/Testing)

Si tienes IP pública estática:
```bash
# En tu router, haz port forwarding del puerto 3000
# Tu URL será: http://TU_IP_PUBLICA:3000
```

⚠️ **NO recomendado para producción real** (problemas de seguridad y disponibilidad)

---

## 🔧 PASO 2: Actualizar Configuración de la App

### a) Actualizar `app.json`:

```json
{
  "expo": {
    "name": "Latacunga Clean",
    "slug": "latacunga-clean",
    "version": "1.0.0",
    "android": {
      "package": "com.latacunga.clean",
      "versionCode": 1,
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ],
      "config": {
        "googleMaps": {
          "apiKey": "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        }
      }
    }
  }
}
```

### b) Actualizar `src/config/constants.js`:

```javascript
// URL del API - CAMBIAR A TU SERVIDOR DE PRODUCCIÓN
export const API_URL = __DEV__ 
  ? 'http://192.168.0.147:3000/api' // Desarrollo local
  : 'https://tu-backend-produccion.com/api'; // ⬅️ CAMBIAR ESTO

// O si usas IP pública:
// : 'http://TU_IP_PUBLICA:3000/api';
```

---

## 🏗️ PASO 3: Crear el Build

### Método 1: Build de Desarrollo (APK - Sin Google Play)

Este es el que necesitas para instalar en dispositivos de prueba:

```bash
cd C:\Users\Branel\Documents\Proyectos\APP

# Configurar EAS (primera vez)
eas build:configure

# Crear APK de desarrollo
eas build --profile development --platform android
```

**Proceso:**
1. EAS subirá tu código a sus servidores
2. Compilará la app con React Native Maps nativo
3. Generará una APK (~50-80 MB)
4. Te dará un link para descargar: `https://expo.dev/artifacts/xxx`

**Tiempo:** 10-15 minutos

### Método 2: Build de Producción (AAB - Para Google Play Store)

Si vas a publicar en la tienda:

```bash
eas build --profile production --platform android
```

Esto genera un `.aab` (Android App Bundle) que subes a Google Play Store.

---

## 📥 PASO 4: Instalar la APK en Dispositivos

### En tu Celular:

1. **Descarga la APK:**
   - Abre el link de EAS en el navegador del celular
   - Descarga la APK (~70 MB)

2. **Permitir instalación de fuentes desconocidas:**
   - Ve a Configuración → Seguridad → Permitir fuentes desconocidas
   - O cuando intentes instalar, Android te preguntará

3. **Instalar:**
   - Abre el archivo APK descargado
   - Toca "Instalar"
   - Acepta permisos (ubicación, cámara, almacenamiento)

4. **Primera ejecución:**
   - Abre la app "Latacunga Clean"
   - Acepta permisos de ubicación
   - ¡Listo! Debería cargar datos del backend

---

## 🔍 PASO 5: Verificar que Funcione Correctamente

### Checklist de Pruebas:

```bash
# 1. Backend debe estar online
curl https://tu-backend-produccion.com/api/collection-points
# Debe devolver: {"success":true,"count":10,...}

# 2. En la app móvil:
✅ Inicia sesión/Registro funciona
✅ El mapa carga correctamente
✅ Ve los 10 puntos de recolección
✅ "Encontrar cercanos" muestra puntos ordenados por distancia
✅ Puede crear reportes con fotos
✅ La ubicación GPS funciona
✅ Las imágenes se suben al servidor
```

---

## ⚙️ CONFIGURACIÓN PARA TU CASO ESPECÍFICO

### Archivo: `eas.json` (Crear en la raíz del proyecto)

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 🌐 OPCIONES DE BACKEND EN PRODUCCIÓN

### 1. Railway.app (Más Fácil) - $5/mes
```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Inicializar proyecto
cd backend
railway init

# 4. Agregar servicios
railway add postgresql
railway add mongodb
railway add redis

# 5. Desplegar
railway up

# 6. Tu URL será: https://latacunga-xxxxx.up.railway.app
```

### 2. Render.com (Plan Gratuito Limitado)
```bash
# 1. Crear cuenta en render.com
# 2. New → Web Service
# 3. Conectar repositorio de GitHub
# 4. Build Command: npm install
# 5. Start Command: node server.js
# 6. Variables de entorno: agregar todas las del .env
# 7. Tu URL será: https://latacunga-clean.onrender.com
```

### 3. DigitalOcean Droplet ($6/mes) - Más Control
```bash
# Requiere configuración manual:
# - Crear VPS Ubuntu
# - Instalar Node.js, PostgreSQL, MongoDB, Redis
# - Configurar Nginx como proxy reverso
# - Configurar SSL con Let's Encrypt
# - Configurar PM2 para mantener el servidor activo
```

---

## 📊 RESUMEN DE COSTOS

| Servicio | Costo | Para qué |
|----------|-------|----------|
| **Expo/EAS** | Gratis (hasta 30 builds/mes) | Compilar APK |
| **Google Maps API** | Gratis ($200 crédito/mes) | Mostrar mapas |
| **Backend Hosting** | $5-10/mes | Servidor API |
| **Base de Datos** | $0-5/mes | PostgreSQL + MongoDB |
| **Dominio** | $12/año (opcional) | latacunga-clean.com |
| **SSL/HTTPS** | Gratis (Let's Encrypt) | Seguridad |

**TOTAL MENSUAL:** ~$5-15 USD

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### Problema 1: "Network Error" en la app
```bash
# Solución: Verificar que el backend esté accesible
curl https://tu-backend.com/api/health

# Si falla, revisa:
# 1. URL correcta en constants.js
# 2. Backend está ejecutándose
# 3. CORS configurado correctamente en el backend
# 4. Firewall del servidor permite conexiones
```

### Problema 2: Mapa no carga
```bash
# Solución: Verificar Google Maps API Key
# 1. API Key correcta en app.json
# 2. Maps SDK for Android habilitada
# 3. Restricciones correctas en Google Cloud Console
# 4. Billing habilitado (requiere tarjeta, pero es gratis)
```

### Problema 3: "No se pueden cargar los puntos"
```bash
# Solución: Backend sin datos
cd backend
node seeders/seed-collection-points.js

# Verificar:
curl https://tu-backend.com/api/collection-points
# Debe devolver count: 10
```

### Problema 4: APK muy grande (>100 MB)
```bash
# Solución: Optimizar build
# En app.json, agregar:
"android": {
  "enableProguardInReleaseBuilds": true,
  "enableShrinkResourcesInReleaseBuilds": true
}
```

---

## 📝 CHECKLIST FINAL ANTES DE BUILD

```bash
✅ 1. Backend desplegado y accesible públicamente
✅ 2. Base de datos poblada con los 10 puntos
✅ 3. Google Maps API Key configurada
✅ 4. app.json actualizado con API key
✅ 5. constants.js apunta a URL de producción
✅ 6. package.json tiene todas las dependencias
✅ 7. EAS CLI instalado y configurado
✅ 8. Cuenta de Expo creada y login hecho
✅ 9. eas.json creado en la raíz
✅ 10. Permisos de Android configurados
```

---

## 🎓 PARA TU TESIS

### Documentar en el Capítulo de Implementación:

1. **Arquitectura de Despliegue:**
   - Diagrama: App móvil → Internet → Backend → Bases de datos
   - Servidor usado (Railway/Render/DO)
   - Configuración de producción

2. **Proceso de Compilación:**
   - Explicar EAS Build
   - React Native vs Expo
   - Generación de APK

3. **Distribución:**
   - Instalación directa (APK)
   - Google Play Store (si publicas)
   - Usuarios de prueba

---

## 🚀 COMANDOS RÁPIDOS

```bash
# Build APK de desarrollo (para pruebas)
eas build --profile development --platform android

# Build APK de preview (más cercano a producción)
eas build --profile preview --platform android

# Build AAB para Play Store
eas build --profile production --platform android

# Ver historial de builds
eas build:list

# Descargar última APK
eas build:download --platform android
```

---

## 📞 PRÓXIMOS PASOS

1. **Ahora mismo:** Decide dónde hospedar el backend (Railway recomendado)
2. **Obtén Google Maps API Key** (15 minutos)
3. **Actualiza app.json y constants.js** con URLs reales
4. **Ejecuta:** `eas build --profile development --platform android`
5. **Espera 15 minutos** a que compile
6. **Descarga e instala la APK** en tu celular
7. **¡Prueba!** 🎉

---

¿Quieres que te ayude con alguno de estos pasos específicamente?
