# 🚀 CHECKLIST RÁPIDO - Build APK Mañana

## ✅ PASO 1: Abrir Terminal
```bash
# En VS Code, presiona Ctrl + `
# O abre PowerShell
```

## ✅ PASO 2: Ir a la carpeta src
```bash
cd C:\Users\Branel\Documents\Proyectos\APP\src
```

## ✅ PASO 3: Ejecutar Build
```bash
eas build --profile preview --platform android
```

## ⏱️ PASO 4: Esperar 10-15 minutos
- EAS compilará tu app en la nube
- Verás el progreso en la terminal
- Al final te dará un link para descargar

## 📥 PASO 5: Descargar APK
- Haz clic en el link que te dará EAS
- O ve a: https://expo.dev/accounts/branelio/projects/latacunga-clean
- Descarga el APK (~50-100 MB)

## 💾 PASO 6: Guardar APK
```bash
# Mover a carpeta de builds
Move-Item ~/Downloads/latacunga-clean*.apk builds/android/preview/

# Renombrar
cd builds/android/preview
Rename-Item latacunga-clean*.apk latacunga-clean-1.0.0-preview-2025-10-21.apk
```

## 📱 PASO 7: Probar en Android
1. Conecta tu celular por USB o envía el APK por email/Drive
2. En el celular: Ajustes → Seguridad → Fuentes desconocidas (Activar)
3. Abre el APK y haz clic en "Instalar"
4. ¡Prueba la app!

---

## ⚠️ Si algo sale mal

**Error de dependencias:**
```bash
cd C:\Users\Branel\Documents\Proyectos\APP\src
npm install --legacy-peer-deps
```

**Error de assets:**
```bash
# Verificar que existan
ls assets
# Deberías ver: icon.png, splash.png, adaptive-icon.png, favicon.png
```

**Error de EAS:**
```bash
# Actualizar EAS CLI
npm install -g eas-cli

# Re-autenticar
eas login
```

---

## 📊 TODO ESTÁ LISTO ✅

- ✅ Dependencias correctas
- ✅ Assets en su lugar
- ✅ Configuración de EAS lista
- ✅ Backend en Railway funcionando
- ✅ OpenStreetMap configurado
- ✅ Estructura de carpetas creada

**Solo ejecuta el comando y espera.** 🎉

---

**Para más detalles, lee:** `RESUMEN-BUILD-READY.md`
