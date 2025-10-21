# 🚂 Despliegue en Railway - Latacunga Clean Backend

## Variables de Entorno Requeridas

Cuando despliegues en Railway, necesitas configurar estas variables de entorno:

### Base de Datos PostgreSQL (Railway lo provee automáticamente)
```
POSTGRES_HOST=containers-us-west-xxx.railway.app
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<generado-por-railway>
POSTGRES_DB=railway
```

### Base de Datos MongoDB (Railway lo provee automáticamente)
```
MONGODB_URI=mongodb://mongo.railway.internal:27017/latacunga_clean
```

### Redis (Railway lo provee automáticamente)
```
REDIS_URL=redis://default:<password>@containers-us-west-xxx.railway.app:6379
```

### Configuración de la Aplicación
```
PORT=3000
NODE_ENV=production
JWT_SECRET=tu_clave_secreta_super_segura_para_produccion_2024
```

## Comandos de Railway

### Iniciar sesión
```bash
railway login
```

### Inicializar proyecto
```bash
railway init
```

### Vincular con proyecto existente
```bash
railway link
```

### Desplegar
```bash
railway up
```

### Ver logs
```bash
railway logs
```

### Abrir en navegador
```bash
railway open
```

## Notas Importantes

1. **PostgreSQL**: Railway creará automáticamente una base de datos PostgreSQL con PostGIS
2. **MongoDB**: Necesitas agregar MongoDB como servicio separado
3. **Redis**: Necesitas agregar Redis como servicio separado
4. **Seeders**: Después del deploy, ejecuta los seeders para poblar datos:
   ```bash
   railway run node seeders/seed-collection-points.js
   ```

## URL de tu API

Después del deploy, tu API estará disponible en:
```
https://latacunga-clean-production.up.railway.app
```

Los endpoints serán:
- GET https://tu-url.railway.app/api/collection-points
- GET https://tu-url.railway.app/api/health
- POST https://tu-url.railway.app/api/auth/login
- etc.
