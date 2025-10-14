# 🚀 Guía Rápida - Latacunga Clean

## 📋 Inicio Rápido (5 minutos)

### 1️⃣ Instalar Dependencias Nuevas
```powershell
cd src
npm install --legacy-peer-deps
```

### 2️⃣ Reiniciar Expo
```powershell
# Si está corriendo, detener con Ctrl+C
npm start
```

### 3️⃣ Escanear QR
- Abre **Expo Go** en tu celular
- Escanea el QR code
- ¡La app se cargará con todos los nuevos features!

---

## 🎯 Probar Nuevos Features

### 📸 Captura de Fotos
1. Abre la app
2. Toca el tab **"+"** (Reportar)
3. Scroll hasta ver **"Fotos (Opcional)"**
4. Toca **"Cámara"** o **"Galería"**
5. Captura/selecciona fotos
6. ¡Verás el preview!

### 🧪 Tests
```powershell
npm test
```

### 📊 Coverage
```powershell
npm run test:coverage
```

### 🔍 Quality Check
```powershell
npm run quality:check
```

---

## 🆕 Nuevos Componentes

### CustomButton
```javascript
import { CustomButton } from '../components';

<CustomButton
  title="Click Me"
  onPress={() => alert('Pressed!')}
  variant="primary"  // primary, secondary, outline, danger
  size="medium"      // small, medium, large
  icon="check"       // Nombre de MaterialCommunityIcons
  loading={false}
  disabled={false}
/>
```

### CustomInput
```javascript
import { CustomInput } from '../components';

<CustomInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="tu@email.com"
  icon="email"
  error={emailError}
  keyboardType="email-address"
/>
```

### LoadingSpinner
```javascript
import { LoadingSpinner } from '../components';

<LoadingSpinner
  text="Cargando..."
  fullScreen={true}
/>
```

---

## 🛠️ Nuevos Servicios

### Notifications
```javascript
import { notificationService } from '../services';

// Registrar dispositivo
const token = await notificationService.registerForPushNotifications();

// Notificación local
await notificationService.scheduleLocalNotification(
  'Título',
  'Mensaje',
  { data: 'extra' }
);
```

### Analytics
```javascript
import { analyticsService } from '../services';

// Track evento
analyticsService.trackEvent('button_clicked', { screen: 'Home' });

// Track screen
analyticsService.trackScreenView('MapScreen');
```

### Offline Mode
```javascript
import { offlineService } from '../services';

// Verificar conexión
const isOnline = offlineService.checkConnection();

// Guardar en caché
await offlineService.saveToCache('reports', data);

// Leer de caché
const cached = await offlineService.getFromCache('reports', 60); // 60 min
```

---

## 🔧 Nuevos Scripts

```powershell
# Testing
npm test                    # Tests
npm run test:watch          # Watch mode
npm run test:coverage       # Con coverage

# Quality
npm run quality:check       # Quality gate

# Build
npm run build:android       # Build Android
npm run build:ios           # Build iOS
npm run deploy:preview      # Deploy preview
```

---

## 📁 Archivos Importantes Nuevos

```
src/
├── components/
│   ├── CustomButton.js        ⭐ Nuevo
│   ├── CustomInput.js         ⭐ Nuevo
│   ├── CustomCard.js          ⭐ Nuevo
│   ├── LoadingSpinner.js      ⭐ Nuevo
│   └── ErrorBoundary.js       ⭐ Nuevo
│
├── services/
│   ├── notificationService.js ⭐ Nuevo
│   ├── analyticsService.js    ⭐ Nuevo
│   └── offlineService.js      ⭐ Nuevo
│
├── utils/
│   ├── validation.js          ⭐ Nuevo
│   ├── permissions.js         ⭐ Nuevo
│   └── dateFormatter.js       ⭐ Nuevo
│
└── assets/                    ⭐ Nuevo
    ├── icon.png
    ├── splash.png
    ├── adaptive-icon.png
    └── favicon.png
```

---

## 🐛 Troubleshooting

### Error: Module not found
```powershell
cd src
rm -rf node_modules
npm install --legacy-peer-deps
```

### Expo no inicia
```powershell
npx expo start --clear
```

### Tests fallan
```powershell
npm test -- --clearCache
npm test
```

### Assets no cargan
```powershell
# Verificar que existan
ls src/assets/
```

---

## 📞 Ayuda Rápida

### Ver versión
```powershell
cat package.json | Select-String "version"
```

### Ver dependencias
```powershell
npm list --depth=0
```

### Limpiar todo
```powershell
cd src
rm -rf node_modules
rm package-lock.json
npm install --legacy-peer-deps
```

---

## ✅ Checklist de Verificación

- [ ] Dependencias instaladas (`node_modules` existe)
- [ ] Expo corriendo sin errores
- [ ] Assets en `src/assets/` (4 archivos PNG)
- [ ] Tests pasan (`npm test`)
- [ ] Backend corriendo (puerto 3000)
- [ ] Databases activas (Docker)
- [ ] QR code generado

---

## 🎉 ¡Todo Listo!

Si completaste el checklist, tu app está lista para:
- ✅ Development
- ✅ Testing
- ✅ Production

**¡Disfruta tu app enterprise-ready!** 🚀

