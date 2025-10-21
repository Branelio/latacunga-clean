# 📦 Builds de Latacunga Clean

Esta carpeta contiene todos los APKs generados para la aplicación móvil, organizados por tipo de build y versión.

## 📁 Estructura de Carpetas

```
builds/
└── android/
    ├── development/    # APKs de desarrollo (debug)
    ├── preview/        # APKs de prueba (preview)
    └── production/     # APKs de producción (release)
```

## 📝 Convención de Nombres

Cada APK debe nombrarse siguiendo este formato:

```
latacunga-clean-{version}-{build-type}-{date}.apk
```

**Ejemplos:**
- `latacunga-clean-1.0.0-preview-2025-10-20.apk`
- `latacunga-clean-1.0.1-development-2025-10-21.apk`
- `latacunga-clean-1.0.0-production-2025-11-01.apk`

## 📋 Registro de Builds

### Version 1.0.0

#### Preview Build - 2025-10-20
- **Archivo:** `latacunga-clean-1.0.0-preview-2025-10-20.apk`
- **Rama:** `feature/apk-build`
- **Backend:** Railway (https://thriving-patience-production.up.railway.app)
- **Mapas:** OpenStreetMap (100% gratuito)
- **Características:**
  - ✅ Geolocalización
  - ✅ 10 puntos de recolección en Latacunga
  - ✅ Sistema de reportes
  - ✅ Autenticación con JWT
  - ✅ Conexión a PostgreSQL/PostGIS
  - ✅ Caché con Redis
- **Pruebas:**
  - [ ] Instalación en dispositivo
  - [ ] Permisos de ubicación
  - [ ] Carga de mapa
  - [ ] Visualización de puntos
  - [ ] Creación de reportes
  - [ ] Conexión a backend
- **Notas:** Primera versión de prueba para validación de funcionalidad

---

## 🔧 Tipos de Build

### Development (Desarrollo)
- **Uso:** Pruebas internas durante desarrollo
- **Características:**
  - Debug mode habilitado
  - Logs detallados
  - Hot reload
  - No optimizado
- **Comando:** `eas build --profile development --platform android`

### Preview (Vista Previa)
- **Uso:** Pruebas con usuarios beta, demos de tesis
- **Características:**
  - Optimizado
  - Sin debug
  - Firmas de desarrollo
  - Instalable en cualquier dispositivo
- **Comando:** `eas build --profile preview --platform android`

### Production (Producción)
- **Uso:** Publicación en Google Play Store
- **Características:**
  - Totalmente optimizado
  - Firmado con certificado de producción
  - Formato AAB (Android App Bundle)
  - Sin logs de debug
- **Comando:** `eas build --profile production --platform android`

## 📊 Información de Builds

| Versión | Tipo | Fecha | Tamaño | Estado | Notas |
|---------|------|-------|--------|--------|-------|
| 1.0.0 | Preview | 2025-10-20 | - | ⏳ En proceso | Build inicial |

## 🚀 Proceso de Build

1. **Preparación**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/apk-build
   ```

2. **Configuración**
   - Verificar `app.json` (versión, permisos)
   - Verificar `eas.json` (perfiles de build)
   - Actualizar `src/config/constants.js` (URL backend)

3. **Build**
   ```bash
   eas build --profile preview --platform android
   ```

4. **Descarga**
   - Esperar ~10-15 minutos
   - Descargar APK desde link de EAS
   - Guardar en carpeta correspondiente
   - Renombrar con convención establecida

5. **Documentación**
   - Actualizar esta tabla
   - Documentar cambios en la versión
   - Registrar resultados de pruebas

## 📱 Instalación de APK

### En dispositivo físico:
1. Habilitar "Fuentes desconocidas" en ajustes
2. Transferir APK al dispositivo (USB, email, Drive)
3. Abrir archivo APK
4. Permitir instalación
5. Abrir app y probar

### En emulador:
```bash
adb install latacunga-clean-1.0.0-preview-2025-10-20.apk
```

## ⚠️ Notas Importantes

- **NO subir APKs a Git** - Archivos muy pesados (se ignoran en `.gitignore`)
- **Guardar en Drive/OneDrive** - Para respaldo en la nube
- **Documentar cada build** - Importante para la tesis
- **Probar antes de distribuir** - Validar funcionalidad básica
- **Versionar correctamente** - Seguir Semantic Versioning

## 🎓 Para la Tesis

Esta carpeta te permitirá:
- ✅ Documentar el proceso de desarrollo iterativo
- ✅ Mostrar evolución de la aplicación
- ✅ Evidenciar pruebas realizadas
- ✅ Comparar versiones (tamaño, rendimiento)
- ✅ Demostrar control de versiones profesional

## 📞 Distribución

Para compartir APKs con evaluadores de tesis:

1. **Google Drive**
   - Subir APK a carpeta compartida
   - Compartir link con permisos de descarga

2. **Email**
   - Comprimir APK en .zip
   - Adjuntar a email (límite ~25MB)

3. **Link directo**
   - Usar EAS Build URL directamente
   - Válido por 30 días

---

**Última actualización:** 20 de octubre, 2025  
**Total de builds:** 0  
**Versión actual:** 1.0.0 (en desarrollo)
