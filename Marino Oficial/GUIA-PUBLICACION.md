# 🚀 MARINO — Guía de Publicación Completa
## Web oficial + App en Play Store

---

## PASO 1 — Configurar Firebase Firestore (Reglas de seguridad)

En Firebase Console → Firestore → Reglas, pega esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cualquiera puede leer (clientes ven la carta)
    match /{document=**} {
      allow read: if true;
      // Solo escritura desde el admin (por ahora open, luego asegurar)
      allow write: if true;
    }
  }
}
```

Para Firebase Storage → Storage → Reglas:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

---

## PASO 2 — Publicar la web con Firebase Hosting

### Opción A: Desde la terminal (recomendado)

1. Instala Node.js desde https://nodejs.org (versión LTS)
2. Abre la terminal y ejecuta:

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Iniciar sesión con tu cuenta Google
firebase login

# Ir a la carpeta del proyecto
cd ruta/a/tu/carpeta/marino-final

# Publicar
firebase deploy
```

3. ¡Listo! Tu web estará en: **https://marino-chiclayo.web.app**

### Opción B: Desde Firebase Console (más fácil)

1. Ve a Firebase Console → Hosting → "Comenzar"
2. Sigue los pasos que te indica
3. Arrastra y suelta la carpeta `marino-final`

---

## PASO 3 — Dominio personalizado (opcional)

Si quieres usar **marinochiclayo.com** en lugar de marino-chiclayo.web.app:

1. Compra el dominio en https://namecheap.com o https://godaddy.com (~S/50/año)
2. En Firebase Console → Hosting → "Agregar dominio personalizado"
3. Sigue los pasos para verificar el dominio
4. Espera 24-48 horas para que se propague

---

## PASO 4 — Preparar iconos (IMPORTANTE para la app)

Crea una carpeta `icons/` dentro de `marino-final/` con estos archivos:
- icon-72.png, icon-96.png, icon-128.png, icon-144.png
- icon-152.png, icon-192.png, icon-384.png, icon-512.png

Puedes generarlos gratis en: https://www.pwabuilder.com/imageGenerator
Sube el logo de Marino (mínimo 512x512px) y descarga el pack completo.

También crea la carpeta `screenshots/` con:
- home.png, rest.png, barber.png (capturas de pantalla de la web en móvil)

---

## PASO 5 — Publicar en Play Store (Android)

### Método recomendado: PWABuilder (GRATIS)

1. Ve a **https://www.pwabuilder.com**
2. Ingresa la URL de tu web: `https://marino-chiclayo.web.app`
3. Haz clic en "Package for stores"
4. Selecciona **"Google Play"**
5. Descarga el archivo `.aab` (Android App Bundle)

### Subir a Play Store:

1. Ve a **https://play.google.com/console**
2. Paga los $25 de registro (una sola vez)
3. Crea nueva app → Nombre: "Marino Chiclayo"
4. Sube el archivo `.aab` descargado
5. Completa los datos:
   - Descripción: "Restaurante y Barbería en Chiclayo, Perú. Pide tu comida o reserva tu cita desde la app."
   - Categoría: "Comida y bebida"
   - País: Perú
6. Enviar para revisión (tarda 3-7 días)

### App en iOS (App Store) — opcional:
- Usa el mismo PWABuilder → selecciona "iOS"
- Necesitas cuenta Apple Developer ($99/año)

---

## PASO 6 — Cargar la carta inicial en Firebase

Una vez publicada la web, entra al panel admin:
- URL: https://marino-chiclayo.web.app/admin.html
- Usuario: edinson
- Contraseña: marino2025

Ve a "Editor de Página" → "Rest. Mañana" y añade todos los productos.
Cada producto que añadas se verá **inmediatamente** en la web para los clientes.

---

## RESUMEN FINAL

| Paso | Qué hacer | Costo |
|------|-----------|-------|
| 1 | Configurar Firebase Firestore (reglas) | Gratis |
| 2 | Publicar web con Firebase Hosting | Gratis |
| 3 | Dominio personalizado (opcional) | ~S/50/año |
| 4 | Generar iconos con PWABuilder | Gratis |
| 5 | Publicar en Play Store | $25 único |
| 6 | Cargar carta desde panel admin | Gratis |

**Web:** https://marino-chiclayo.web.app
**Admin:** https://marino-chiclayo.web.app/admin.html
**Play Store:** Disponible ~7 días después de publicar

---

## CREDENCIALES ADMIN
- Usuario: `edinson`
- Contraseña: `marino2025`
⚠️ Guarda esto en un lugar seguro. No lo compartas.
