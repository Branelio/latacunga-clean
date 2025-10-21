# 🚀 GUÍA VISUAL: Desplegar Backend en Railway (Interfaz Web)

## ✅ PASO 1: Ya Hiciste - Cuenta Creada y CLI Instalado

Tu proyecto ya está en: https://railway.com/project/5df85080-ee17-4545-983b-ff5532b16f14

---

## 🎯 PASO 2: Agregar Servicios desde la Web

### A. Agregar PostgreSQL (Base de datos geoespacial)

1. En tu proyecto Railway, haz click en **"+ New"**
2. Selecciona **"Database"**
3. Click en **"Add PostgreSQL"**
4. Espera 30 segundos ⏳
5. ✅ PostgreSQL creado

### B. Agregar MongoDB (Usuarios y reportes)

1. Click en **"+ New"** otra vez
2. Selecciona **"Database"**
3. Click en **"Add MongoDB"**
4. Espera 30 segundos ⏳
5. ✅ MongoDB creado

### C. Agregar Redis (Caché)

1. Click en **"+ New"** otra vez
2. Selecciona **"Database"**
3. Click en **"Add Redis"**
4. Espera 30 segundos ⏳
5. ✅ Redis creado

---

## 🎯 PASO 3: Desplegar el Backend (Node.js)

### Opción A: Desde GitHub (MÁS FÁCIL - RECOMENDADO)

1. **Sube tu código a GitHub primero:**
   ```bash
   cd C:\Users\Branel\Documents\Proyectos\APP
   git add .
   git commit -m "Preparar backend para Railway"
   git push origin master
   ```

2. **En Railway:**
   - Click en **"+ New"**
   - Selecciona **"GitHub Repo"**
   - Selecciona tu repositorio: **"Branelio/latacunga-clean"**
   - En "Root Directory" escribe: **backend**
   - Click en **"Deploy"**
   - ⏳ Espera 5 minutos mientras compila

3. **Railway automáticamente:**
   - Detecta que es Node.js
   - Ejecuta `npm install`
   - Inicia con `node server.js`
   - Asigna una URL pública

### Opción B: Desde CLI (Más rápido para testing)

```bash
# Desde la carpeta backend
cd C:\Users\Branel\Documents\Proyectos\APP\backend

# Desplegar directamente
railway up

# Railway preguntará qué servicio crear, selecciona "Create new service"
```

---

## 🎯 PASO 4: Configurar Variables de Entorno

Una vez desplegado el backend, necesitas conectarlo a las bases de datos:

1. **Click en tu servicio de Backend** (el que acabas de crear)

2. **Ve a la pestaña "Variables"**

3. **Agrega estas variables manualmente:**

```bash
# Configuración General
PORT=3000
NODE_ENV=production
JWT_SECRET=latacunga_clean_super_secret_key_2024_production

# Estas se generan automáticamente cuando vinculas las bases de datos
# Pero si no, cópialas de cada servicio:
```

4. **Vincular PostgreSQL:**
   - Click en tu servicio Backend
   - Ve a "Settings" → "Service Variables"
   - Click en **"+ Reference"**
   - Selecciona el servicio **"PostgreSQL"**
   - Agrega estas referencias:
     - `POSTGRES_HOST` → `${{Postgres.PGHOST}}`
     - `POSTGRES_PORT` → `${{Postgres.PGPORT}}`
     - `POSTGRES_USER` → `${{Postgres.PGUSER}}`
     - `POSTGRES_PASSWORD` → `${{Postgres.PGPASSWORD}}`
     - `POSTGRES_DB` → `${{Postgres.PGDATABASE}}`

5. **Vincular MongoDB:**
   - Mismo proceso, agrega referencia:
     - `MONGODB_URI` → `${{MongoDB.MONGO_URL}}`

6. **Vincular Redis:**
   - Mismo proceso, agrega referencia:
     - `REDIS_URL` → `${{Redis.REDIS_URL}}`

---

## 🎯 PASO 5: Obtener la URL Pública

1. **Click en tu servicio Backend**
2. **Ve a "Settings"**
3. **Busca "Networking"**
4. **Click en "Generate Domain"**
5. Railway te dará algo como: `latacunga-clean-production.up.railway.app`

---

## 🎯 PASO 6: Poblar las Bases de Datos

Una vez desplegado, necesitas agregar los 10 puntos de recolección:

### Método 1: Desde Railway CLI (Más fácil)

```bash
# Conectarte al backend en Railway y ejecutar seeder
railway run node seeders/seed-collection-points.js
```

### Método 2: Crear un endpoint temporal

Agrega esto en `server.js` temporalmente:

```javascript
// SOLO PARA DESARROLLO - ELIMINAR EN PRODUCCIÓN
app.get('/api/admin/seed-points', async (req, res) => {
  try {
    // Ejecutar el seeder
    require('./seeders/seed-collection-points');
    res.json({ success: true, message: 'Datos poblados' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

Luego visita: `https://tu-url.railway.app/api/admin/seed-points`

---

## 🎯 PASO 7: Verificar que Funciona

### Prueba estos endpoints:

```bash
# 1. Health check
curl https://tu-url.railway.app/api/health

# 2. Ver puntos de recolección
curl https://tu-url.railway.app/api/collection-points

# 3. Buscar puntos cercanos
curl "https://tu-url.railway.app/api/collection-points/sorted-by-distance?lat=-0.9329&lng=-78.6150"
```

Si los 3 funcionan → ✅ Backend listo en producción!

---

## 🎯 PASO 8: Actualizar la App Móvil

Ahora actualiza tu `src/config/constants.js`:

```javascript
export const API_URL = __DEV__ 
  ? 'http://192.168.0.147:3000/api' 
  : 'https://TU-URL-RAILWAY.up.railway.app/api'; // ⬅️ Cambia esto
```

---

## 💰 Costos

**Plan Gratuito de Railway:**
- $5 de crédito gratis al mes
- Suficiente para desarrollo y testing
- ~500 horas de ejecución

**Si necesitas más:**
- Plan Pro: $20/mes
- Incluye $20 de crédito (ilimitado para apps pequeñas)

---

## 🆘 Solución de Problemas

### Error: "Application failed to respond"
```bash
# Verifica que el puerto sea correcto
# Railway usa la variable de entorno PORT automáticamente
# Tu server.js ya tiene: const PORT = process.env.PORT || 3000;
```

### Error: "Cannot connect to database"
```bash
# Verifica que las variables de entorno estén configuradas
railway variables

# Deberías ver POSTGRES_HOST, MONGODB_URI, etc.
```

### Error: "Build failed"
```bash
# Verifica que package.json esté en la carpeta correcta
# Y que tenga el script de start:
"scripts": {
  "start": "node server.js"
}
```

---

## ✅ CHECKLIST FINAL

- [ ] PostgreSQL desplegado en Railway
- [ ] MongoDB desplegado en Railway
- [ ] Redis desplegado en Railway
- [ ] Backend desplegado y conectado a las BDs
- [ ] Variables de entorno configuradas
- [ ] URL pública generada
- [ ] Seeder ejecutado (10 puntos creados)
- [ ] Endpoints de API funcionando
- [ ] constants.js actualizado en la app móvil

---

## 🎓 Para tu Tesis

Documenta esto en el capítulo de "Despliegue en Producción":

1. **Arquitectura en la nube:** Diagrama mostrando Railway + 3 bases de datos
2. **Proceso de CI/CD:** Cómo cada push a GitHub despliega automáticamente
3. **Escalabilidad:** Railway escala automáticamente según el tráfico
4. **Monitoreo:** Dashboard de Railway muestra logs en tiempo real
5. **Costos:** Análisis de costos mensuales vs alternativas

---

¿Listo? Ahora sí, vamos a desplegarlo! 🚀
