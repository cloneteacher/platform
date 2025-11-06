# Guía de Setup Detallada - EduTeach

Esta guía te llevará paso a paso desde cero hasta tener la aplicación funcionando localmente.

## 📋 Tabla de Contenidos

1. [Prerrequisitos](#prerrequisitos)
2. [Clonar e Instalar](#clonar-e-instalar)
3. [Configurar Clerk](#configurar-clerk)
4. [Configurar Convex](#configurar-convex)
5. [Variables de Entorno](#variables-de-entorno)
6. [Iniciar Aplicación](#iniciar-aplicación)
7. [Crear Primer Admin](#crear-primer-admin)
8. [Verificación](#verificación)

---

## 1. Prerrequisitos

### Software Requerido

```bash
# Verificar Node.js (>= 20)
node --version

# Instalar pnpm si no lo tienes
npm install -g pnpm

# Verificar pnpm
pnpm --version
```

### Cuentas Necesarias

- [ ] Cuenta GitHub (para clonar)
- [ ] Cuenta Clerk (https://clerk.com - plan gratuito disponible)
- [ ] Cuenta Convex (https://convex.dev - plan gratuito disponible)

---

## 2. Clonar e Instalar

```bash
# Clonar repositorio
git clone [tu-repo-url]
cd cloneteacher

# Instalar todas las dependencias
pnpm install
```

---

## 3. Configurar Clerk

### 3.1. Crear Proyecto

1. Ve a https://dashboard.clerk.com
2. Click en "Create Application"
3. Nombre: "EduTeach" (o el que prefieras)
4. Selecciona proveedores de autenticación:
   - ✅ Email
   - ✅ Google (opcional)

### 3.2. Configurar Campos del Usuario

1. En el dashboard, ve a **"User & Authentication"** → **"Email, Phone, Username"**
2. Configura:
   - **First Name**: Required
   - **Last Name**: Required
   - **Email**: Required

### 3.3. Obtener API Keys

1. Ve a **"API Keys"** en el sidebar
2. Copia:
   - `Publishable Key` (empieza con `pk_test_`)
   - `Secret Key` (empieza con `sk_test_`)

### 3.4. Configurar Webhook (IMPORTANTE)

1. Ve a **"Webhooks"** en el sidebar
2. Click en **"Add Endpoint"**
3. Configura:
   - **Endpoint URL**: `https://[tu-deployment].convex.site/http/clerk/webhook`
     - ⚠️ Primero completa el setup de Convex (paso 4) para obtener esta URL
   - **Events**:
     - ✅ `user.created`
     - ✅ `user.updated`
4. Click en "Create"
5. Copia el **Signing Secret** (empieza con `whsec_`)

---

## 4. Configurar Convex

### 4.1. Crear Proyecto

```bash
# Navega al directorio backend
cd packages/backend

# Iniciar Convex (esto abrirá el browser)
npx convex dev
```

### 4.2. Proceso de Setup

1. Se abrirá el navegador automáticamente
2. Inicia sesión o crea cuenta en Convex
3. Crea un nuevo proyecto: "eduteach"
4. El CLI mostrará:
   - ✅ Project created
   - ✅ Deployment URL: `https://[random].convex.cloud`

### 4.3. Obtener URL de Webhook

1. Ve al dashboard de Convex (https://dashboard.convex.dev)
2. Selecciona tu proyecto "eduteach"
3. Ve a **"Settings"** → **"HTTP Actions"**
4. Copia la URL base: `https://[tu-deployment].convex.site`
5. La URL del webhook será: `https://[tu-deployment].convex.site/http/clerk/webhook`

### 4.4. Configurar Webhook en Clerk (continuación)

Ahora que tienes la URL de Convex:

1. Vuelve a Clerk Dashboard → Webhooks
2. Actualiza la URL del endpoint con tu URL de Convex
3. Guarda los cambios

---

## 5. Variables de Entorno

### 5.1. Frontend (`apps/web/.env.local`)

Crea el archivo:

```bash
cd apps/web
touch .env.local
```

Añade:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_[tu_key]
CLERK_SECRET_KEY=sk_test_[tu_key]
CLERK_WEBHOOK_SECRET=whsec_[tu_secret]

# Convex
NEXT_PUBLIC_CONVEX_URL=https://[tu-deployment].convex.cloud

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 5.2. Backend (`packages/backend/.env.local`)

Crea el archivo:

```bash
cd packages/backend
touch .env.local
```

Añade:

```env
# Clerk Webhook
CLERK_WEBHOOK_SECRET=whsec_[tu_secret]

# Convex (auto-generado por CLI)
CONVEX_DEPLOYMENT=dev:[tu-deployment-id]
```

### 5.3. Verificar Variables

```bash
# Desde el root
cat apps/web/.env.local
cat packages/backend/.env.local
```

---

## 6. Iniciar Aplicación

### Opción A: Iniciar Todo (Recomendado)

```bash
# Desde el root del proyecto
pnpm dev
```

Esto iniciará:
- ✅ Next.js en `http://localhost:3000`
- ✅ Convex en modo desarrollo

### Opción B: Iniciar por Separado

Terminal 1 (Backend):
```bash
cd packages/backend
npx convex dev
```

Terminal 2 (Frontend):
```bash
cd apps/web
pnpm dev
```

---

## 7. Crear Primer Admin

### 7.1. Registrar Usuario

1. Abre `http://localhost:3000`
2. Click en **"Crear Cuenta"**
3. Completa el formulario (se creará como estudiante por defecto):
   - Nombre
   - Apellido
   - Email
   - Contraseña

### 7.2. Promover a Admin

1. Ve a Convex Dashboard (https://dashboard.convex.dev)
2. Selecciona tu proyecto
3. Ve a **"Data"** → **"users"**
4. Busca tu usuario recién creado
5. Click en el usuario
6. Edita el campo `role`:
   - Cambia de `"student"` a `"admin"`
7. Guarda los cambios

### 7.3. Verificar Acceso Admin

1. Vuelve a `http://localhost:3000`
2. Refresca la página (F5)
3. Deberías ver el sidebar con:
   - Dashboard
   - Profesores

---

## 8. Verificación

### Checklist de Funcionalidad

- [ ] **Auth**
  - [ ] Registro de estudiantes funciona
  - [ ] Login funciona
  - [ ] Logout funciona

- [ ] **Admin**
  - [ ] Puedes ver dashboard de admin
  - [ ] Puedes crear profesores
  - [ ] Se muestran estadísticas

- [ ] **Profesor** (crear uno desde admin primero)
  - [ ] Puedes crear asignaturas
  - [ ] Puedes crear temas
  - [ ] Puedes subir archivos
  - [ ] Puedes asignar estudiantes

- [ ] **Estudiante**
  - [ ] Puedes ver asignaturas asignadas
  - [ ] Puedes acceder a temas
  - [ ] Puedes descargar archivos

### Crear Datos de Prueba

#### Como Admin:
1. Crea 2-3 profesores

#### Como Profesor:
1. Crea 2 asignaturas (ej: "Matemáticas", "Historia")
2. En cada asignatura, crea 2-3 temas
3. Sube 1-2 archivos PDF a cada tema

#### Como Profesor (asignación):
1. Ve a "Alumnos"
2. Asigna estudiantes a tus asignaturas

#### Como Estudiante:
1. Ve a "Mis Asignaturas"
2. Abre una asignatura
3. Accede a un tema
4. Prueba las 3 tabs:
   - Chat RAG (placeholder)
   - Materiales (descargar archivos)
   - Exámenes (placeholder)

---

## 🐛 Solución de Problemas

### Error: "No se puede conectar a Convex"

**Solución:**
```bash
cd packages/backend
npx convex dev
```

### Error: "Clerk webhook failed"

**Verificar:**
1. URL del webhook en Clerk apunta a tu deployment de Convex
2. Webhook secret está en `.env.local`
3. Events `user.created` y `user.updated` están activados

### Error: "User not found after signup"

**Causa:** El webhook no está funcionando

**Solución:**
1. Ve a Clerk Dashboard → Webhooks
2. Revisa los logs del webhook
3. Verifica que la URL y el secret sean correctos

### Error: "Cannot read properties of undefined (reading '_id')"

**Causa:** El usuario no se sincronizó con Convex

**Solución:**
1. Cierra sesión
2. Vuelve a iniciar sesión
3. Verifica en Convex Dashboard que el usuario existe en la tabla `users`

---

## 📚 Próximos Pasos

Una vez que todo funciona:

1. Lee el [README.md](./README.md) para entender la arquitectura
2. Explora los componentes en `apps/web/components/`
3. Revisa el schema en `packages/backend/convex/schema.ts`
4. Empieza a personalizar la UI en `packages/ui/src/styles/globals.css`

---

## 💡 Tips de Desarrollo

### Hot Reload

Ambos Next.js y Convex tienen hot reload activado. Los cambios se reflejan automáticamente.

### Ver Logs de Convex

```bash
# Terminal donde corre `npx convex dev`
# Los logs aparecen en tiempo real
```

### Ver Logs de Clerk

1. Clerk Dashboard → Webhooks
2. Click en tu webhook
3. Ve a "Logs"

### Regenerar Tipos de Convex

Si cambias el schema:

```bash
cd packages/backend
npx convex dev
# Los tipos se regeneran automáticamente
```

---

## 🎉 ¡Listo!

Si llegaste hasta aquí, tu aplicación debería estar completamente funcional.

¿Problemas? Abre un issue en el repositorio.

