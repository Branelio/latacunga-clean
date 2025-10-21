# 🗺️ Configuración PostGIS en Railway

## Variables a configurar en el servicio PostGIS

### En el servicio PostGIS:
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=abc123
POSTGRES_DB=latacunga_clean
POSTGRES_HOST_AUTH_METHOD=md5
PGDATA=/var/lib/postgresql/data/pgdata
```

### Variables de conexión para el backend:

En el servicio **thriving-patience** (backend), actualiza estas variables:

```
POSTGRES_HOST=${{PostGIS.RAILWAY_PRIVATE_DOMAIN}}
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=abc123
POSTGRES_DB=latacunga_clean
```

## Paso 6: Verificar conexión

Una vez configuradas las variables, Railway re-desplegará automáticamente el backend.

Verifica los logs del backend para confirmar:
- ✅ MongoDB conectado
- ✅ Redis conectado  
- ✅ PostgreSQL/PostGIS conectado

## Paso 7: Poblar datos

Una vez que todo esté conectado, ejecuta el seeder:

```bash
railway run node seeders/seed-collection-points.js
```

O desde tu máquina local conectándote a la BD de Railway:

```bash
node seeders/seed-collection-points.js
```

Asegúrate de actualizar las variables de entorno locales para apuntar a Railway antes de ejecutar.

## Paso 8: Generar dominio público

1. Ve al servicio **thriving-patience** (backend)
2. Settings → Networking
3. Haz clic en **"Generate Domain"**
4. Copia el URL generado (ej: `https://thriving-patience-production.up.railway.app`)

## Paso 9: Actualizar app móvil

Actualiza `src/config/constants.js`:

```javascript
export const API_URL = __DEV__ 
  ? 'http://192.168.0.147:3000/api' 
  : 'https://thriving-patience-production.up.railway.app/api';
```
