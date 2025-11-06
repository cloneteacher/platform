# CloneTeacher - Plataforma Educativa con RAG

Plataforma educativa completa con sistema de gestión de aprendizaje (LMS) y capacidades RAG (Retrieval-Augmented Generation) para asistencia inteligente en el estudio.

## 🚀 Características Principales

### Sistema Multi-Rol

- **Admin**: Gestión de profesores y estadísticas del sistema
- **Profesores**: Creación de asignaturas, temas, gestión de archivos y asignación de alumnos
- **Estudiantes**: Acceso a asignaturas, chat RAG, materiales y exámenes

### Funcionalidades Implementadas

#### Para Administradores

- ✅ Creación y gestión de profesores
- ✅ Dashboard con estadísticas globales
- ✅ Vista de todos los usuarios del sistema

#### Para Profesores

- ✅ CRUD completo de asignaturas y temas
- ✅ Gestor de archivos con Convex Storage
  - Upload múltiple (PDF, Word, Excel, PowerPoint)
  - Descarga y eliminación de archivos
- ✅ Asignación de estudiantes a asignaturas
- ✅ Vista de todos los estudiantes

#### Para Estudiantes

- ✅ Vista de asignaturas asignadas
- ✅ Navegación por temas
- ✅ Interface de estudio con 3 tabs:
  - **Chatbot**: Asistente IA para consultas (placeholder)
  - **Materiales**: Descarga de archivos del profesor
  - **Exámenes**: Sistema de evaluación (placeholder)

### Diseño UI/UX

- ✅ Diseño limpio con fondo blanco
- ✅ Acento color naranja para elementos importantes
- ✅ Tipografía Geist (estilo Google)
- ✅ Sidebar colapsible con navegación dinámica
- ✅ Componentes UI completos (shadcn/ui + Radix UI)
- ✅ Responsive design

## 📋 Stack Tecnológico

### Frontend

- **Next.js 15** - Framework React con App Router
- **Tailwind CSS** - Estilos utilitarios
- **Radix UI + shadcn/ui** - Componentes accesibles
- **TypeScript** - Tipado estático
- **Jotai** - Estado global
- **React Hot Toast** - Notificaciones

### Backend

- **Convex** - Backend as a Service con base de datos en tiempo real
- **Clerk** - Autenticación y gestión de usuarios
- **Convex Storage** - Almacenamiento de archivos

### Herramientas

- **Turbo** - Build system para monorepos
- **pnpm** - Gestor de paquetes

## 🏗️ Estructura del Proyecto

```
.
├── apps/
│   └── web/                    # Aplicación Next.js
│       ├── app/
│       │   ├── (auth)/        # Rutas de autenticación
│       │   │   ├── sign-in/   # Login con selector de rol
│       │   │   └── sign-up/   # Registro (solo estudiantes)
│       │   ├── (dashboard)/   # Rutas protegidas
│       │   │   ├── admin/     # Vistas de administrador
│       │   │   ├── teacher/   # Vistas de profesor
│       │   │   └── student/   # Vistas de estudiante
│       │   └── layout.tsx
│       ├── components/        # Componentes de la app
│       │   ├── admin/
│       │   ├── teacher/
│       │   ├── student/
│       │   └── auth/
│       └── hooks/             # Custom hooks
├── packages/
│   ├── backend/               # Backend Convex
│   │   └── convex/
│   │       ├── schema.ts      # Schema de base de datos
│   │       ├── subjects.ts    # CRUD asignaturas
│   │       ├── topics.ts      # CRUD temas
│   │       ├── files.ts       # Gestión archivos
│   │       ├── enrollments.ts # Asignación estudiantes
│   │       ├── admin.ts       # Funciones admin
│   │       ├── clerk.ts       # Sincronización Clerk
│   │       └── users.ts       # Queries usuarios
│   └── ui/                    # Componentes UI compartidos
│       └── src/components/
└── package.json
```

## 📊 Schema de Base de Datos

### Tablas Principales

#### `users`

- email, firstName, lastName, name, clerkId
- **role**: "admin" | "teacher" | "student"

#### `subjects` (Asignaturas)

- name, description, teacherId
- createdAt, updatedAt

#### `topics` (Temas)

- subjectId, name, description, teacherId
- createdAt, updatedAt

#### `topicFiles` (Archivos)

- topicId, subjectId, teacherId
- fileName, fileType, storageId
- uploadedAt

#### `subjectEnrollments` (Inscripciones)

- subjectId, userId (estudiante)
- enrolledAt, enrolledBy

#### `exams` (Exámenes)

- topicId, subjectId, userId
- questions[], status
- createdAt

#### `examResults` (Resultados)

- examId, topicId, userId
- answers[], score, totalQuestions
- completedAt

## 🚀 Setup Inicial

### Prerrequisitos

- Node.js >= 20
- pnpm >= 8
- Cuenta en Clerk (https://clerk.com)
- Cuenta en Convex (https://convex.dev)

### 1. Instalar Dependencias

```bash
pnpm install
```

### 2. Configurar Variables de Entorno

#### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

#### Backend (`packages/backend/.env.local`)

```env
CLERK_WEBHOOK_SECRET=whsec_...
CONVEX_DEPLOYMENT=dev:...
```

### 3. Configurar Clerk

1. Crear proyecto en Clerk
2. Habilitar "Email" como método de autenticación
3. Requerir firstName y lastName en el registro
4. Configurar webhook:
   - URL: `https://your-deployment.convex.site/http/clerk/webhook`
   - Eventos: `user.created`, `user.updated`
5. Copiar el webhook secret a `.env.local`

### 4. Configurar Convex

```bash
# En packages/backend/
npx convex dev
```

Sigue las instrucciones para vincular tu proyecto de Convex.

### 5. Iniciar la Aplicación

```bash
# En el root del proyecto
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## 👥 Primeros Pasos

### Crear el Primer Administrador

1. Registrate como estudiante (sign-up)
2. En Convex Dashboard, ve a tu tabla `users`
3. Cambia el `role` de tu usuario a `"admin"`
4. Refresca la aplicación

### Flujo Típico de Uso

1. **Admin** crea profesores
2. **Profesores** crean asignaturas y temas
3. **Profesores** suben archivos a los temas
4. **Profesores** asignan estudiantes a asignaturas
5. **Estudiantes** acceden a sus asignaturas
6. **Estudiantes** estudian con el chatbot y materiales

## 🎨 Personalización de Diseño

Los colores principales se definen en `packages/ui/src/styles/globals.css`:

```css
:root {
  --primary: oklch(0.65 0.22 50); /* Naranja */
  --background: oklch(1 0 0); /* Blanco */
  --foreground: oklch(0.2 0 0); /* Gris oscuro */
  /* ... más colores */
}
```

## 🔄 Próximas Características

### En Desarrollo (Placeholders Listos)

1. **Chat RAG con IA**
   - Integrar con OpenRouter/OpenAI
   - Implementar embeddings de archivos
   - Context retrieval desde documentos

2. **Sistema de Exámenes**
   - Generación automática con IA
   - Tipos: test, verdadero/falso, corta, desarrollo
   - Corrección automática
   - Historial de resultados

3. **Dashboard de Resultados**
   - Vista para profesores
   - Estadísticas por estudiante
   - Análisis de rendimiento

## 📝 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia Next.js y Convex

# Build
pnpm build            # Build de producción

# Linting
pnpm lint             # Ejecuta ESLint
pnpm lint:fix         # Fix automático

# Type checking
pnpm typecheck        # Verifica tipos TypeScript
```

## 🔐 Seguridad

- ✅ Autenticación con Clerk
- ✅ Middleware de protección de rutas por rol
- ✅ Validación de permisos en mutations
- ✅ Sincronización segura con webhooks
- ✅ Storage seguro con Convex

## 🐛 Troubleshooting

### El login no funciona

- Verifica que las keys de Clerk estén correctas
- Asegúrate de que el webhook esté configurado

### Los archivos no se suben

- Verifica que Convex esté corriendo
- Revisa que el storageId sea válido

### Errores de tipo

- Ejecuta `pnpm typecheck`
- Regenera los tipos de Convex: `npx convex dev`

## 📚 Documentación de Dependencias

- [Next.js](https://nextjs.org/docs)
- [Convex](https://docs.convex.dev)
- [Clerk](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## 🤝 Contribuir

Este es un proyecto educativo. Las contribuciones son bienvenidas.

## 📄 Licencia

MIT

## 👨‍💻 Soporte

Para preguntas o problemas, abre un issue en el repositorio.

---

**Hecho con ❤️ usando Next.js, Convex y Clerk**
