# 🌳 Estrategia de Ramas - Latacunga Clean

## 📋 Estructura de Ramas

### **master** (Producción)
- ✅ Código estable y probado
- ✅ Conectado a Railway (auto-deploy)
- ✅ Solo se actualiza mediante Pull Requests desde `develop`
- 🚫 **NUNCA hacer commits directos aquí**

### **develop** (Desarrollo)
- 🔧 Rama principal de desarrollo
- 🔧 Integración de todas las features
- 🔧 Se mergea a `master` cuando está listo para producción
- ✅ Código funcional pero en pruebas

### **feature/*** (Features)
- 🆕 Nuevas funcionalidades
- 🆕 Se crean desde `develop`
- 🆕 Se mergean a `develop` cuando están completas

Ejemplos:
- `feature/google-maps-config` - Configuración de Google Maps
- `feature/notificaciones-push` - Sistema de notificaciones
- `feature/gamificacion` - Sistema de puntos y badges

### **bugfix/*** (Correcciones)
- 🐛 Corrección de bugs no críticos
- 🐛 Se crean desde `develop`
- 🐛 Se mergean a `develop`

Ejemplos:
- `bugfix/login-error` - Error en el login
- `bugfix/mapa-no-carga` - Error al cargar el mapa

### **hotfix/*** (Emergencias)
- 🚨 Correcciones urgentes en producción
- 🚨 Se crean desde `master`
- 🚨 Se mergean a `master` Y `develop`

Ejemplos:
- `hotfix/api-caida` - API caída
- `hotfix/crash-android` - App crashea en Android

## 🔄 Flujo de Trabajo

### 1️⃣ Trabajar en una Nueva Feature

```bash
# Asegúrate de estar actualizado
git checkout develop
git pull origin develop

# Crea una nueva rama desde develop
git checkout -b feature/nombre-feature

# Trabaja en tu feature...
git add .
git commit -m "feat: descripción del cambio"

# Sube tu rama
git push -u origin feature/nombre-feature

# Cuando termines, crea un Pull Request en GitHub
# develop ← feature/nombre-feature
```

### 2️⃣ Mergear Feature a Develop

```bash
# Después de aprobar el PR en GitHub
git checkout develop
git pull origin develop

# La feature ya está integrada
```

### 3️⃣ Liberar a Producción

```bash
# Cuando develop está estable y listo
git checkout master
git pull origin master

# Mergear develop a master
git merge develop
git push origin master

# Railway auto-desplegará los cambios
```

### 4️⃣ Hotfix de Emergencia

```bash
# Se detecta un bug crítico en producción
git checkout master
git checkout -b hotfix/nombre-bug

# Corrige el bug
git add .
git commit -m "hotfix: corrección urgente"

# Mergea a master
git checkout master
git merge hotfix/nombre-bug
git push origin master

# IMPORTANTE: También mergear a develop
git checkout develop
git merge hotfix/nombre-bug
git push origin develop

# Elimina la rama de hotfix
git branch -d hotfix/nombre-bug
```

## 📝 Convención de Commits

Usa [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Nuevas features
git commit -m "feat: agregar sistema de notificaciones"

# Corrección de bugs
git commit -m "fix: corregir error en login"

# Cambios en documentación
git commit -m "docs: actualizar README con instrucciones de deployment"

# Cambios de estilo (formato, punto y coma, etc)
git commit -m "style: formatear código con prettier"

# Refactoring (ni bug fix ni feature)
git commit -m "refactor: reorganizar estructura de carpetas"

# Tests
git commit -m "test: agregar tests para AuthService"

# Cambios en build o dependencias
git commit -m "chore: actualizar dependencias de Expo"

# Mejoras de rendimiento
git commit -m "perf: optimizar consultas a PostgreSQL"
```

## 🎯 Estado Actual del Proyecto

### Ramas Existentes:
```
master (producción)
  └── develop (desarrollo)
      └── feature/google-maps-config (actual)
```

### Próximas Features Planificadas:
- `feature/google-maps-config` - Configurar Google Maps API ⏳
- `feature/apk-build` - Generar APK con EAS Build
- `feature/pruebas-campo` - Documentar pruebas en Latacunga
- `feature/documentacion-tesis` - Completar documentación académica

## ⚠️ Reglas Importantes

1. **NUNCA** hacer `git push --force` en `master` o `develop`
2. **SIEMPRE** crear Pull Requests para mergear a `master`
3. **SIEMPRE** probar el código antes de mergear
4. **SIEMPRE** mantener `develop` sincronizado con `master` después de hotfixes
5. **ELIMINAR** las ramas de feature después de mergear

## 🔍 Comandos Útiles

```bash
# Ver todas las ramas
git branch -a

# Ver en qué rama estás
git branch

# Cambiar de rama
git checkout nombre-rama

# Actualizar rama actual
git pull origin nombre-rama

# Ver diferencias entre ramas
git diff develop..master

# Ver historial de commits
git log --oneline --graph --all

# Eliminar rama local
git branch -d nombre-rama

# Eliminar rama remota
git push origin --delete nombre-rama
```

## 📊 Protección de Ramas (Configurar en GitHub)

Para tu tesis, es recomendable proteger las ramas principales:

### En GitHub > Settings > Branches > Branch protection rules:

**Para `master`:**
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass
- ✅ Include administrators

**Para `develop`:**
- ✅ Require pull request reviews before merging (opcional si trabajas solo)

## 🎓 Para tu Tesis

Esta estrategia de ramas demuestra:
- ✅ Conocimiento de control de versiones profesional
- ✅ Metodología de desarrollo organizada
- ✅ Capacidad para trabajar en equipo (aunque sea solo)
- ✅ Preparación para entornos de producción reales

---

**Última actualización:** 20 de octubre, 2025  
**Versión actual en producción:** 1.0.0 (master)  
**Versión en desarrollo:** 1.1.0 (develop)
