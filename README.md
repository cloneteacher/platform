# Monorepo Template

Template limpio para crear proyectos full-stack usando un monorepo con Turbo.

## Stack Tecnológico

### Frontend
- **Next.js 15** - Framework React con App Router
- **Tailwind CSS** - Estilos utilitarios
- **Radix UI** - Componentes accesibles (via shadcn/ui)
- **TypeScript** - Tipado estático

### Backend
- **Convex** - Backend as a Service con base de datos en tiempo real
- **Clerk** - Autenticación y gestión de usuarios
- **OpenRouter AI** - Integración con modelos de IA (configurado pero sin uso específico)

### Herramientas
- **Turbo** - Build system para monorepos
- **pnpm** - Gestor de paquetes
- **shadcn/ui** - Componentes UI reutilizables

## Estructura del Proyecto

```
.
├── apps/
│   └── web/              # Aplicación Next.js principal
│       ├── app/          # Páginas y rutas (App Router)
│       ├── components/   # Componentes específicos de la app
│       └── lib/          # Utilidades y helpers
├── packages/
│   ├── backend/          # Backend Convex
│   │   └── convex/       # Funciones, queries, mutations y schema
│   ├── ui/               # Componentes UI compartidos (shadcn/ui)
│   ├── eslint-config/    # Configuración ESLint compartida
│   └── typescript-config/# Configuración TypeScript compartida
└── package.json          # Root package.json con scripts de Turbo
```

## Setup Inicial

### Prerrequisitos

- Node.js >= 20
- pnpm >= 8

### Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp apps/web/.env.example apps/web/.env.local
cp packages/backend/.env.example packages/backend/.env.local
```

### Variables de Entorno

#### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

#### Backend (`packages/backend/.env.local`)
```env
CONVEX_DEPLOYMENT=your_deployment_url
CLERK_JWT_ISSUER_DOMAIN=your_clerk_issuer_domain
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Configurar Clerk

1. Crea una cuenta en [Clerk](https://clerk.com)
2. Crea una aplicación
3. Configura un JWT Template llamado "convex" con:
   - Token lifetime: 1 hour
   - Signing algorithm: RS256
   - Obtén el Issuer Domain del template
4. Configura un webhook apuntando a: `https://your-convex-site.com/clerk-webhook`

### Configurar Convex

1. Crea una cuenta en [Convex](https://convex.dev)
2. Crea un proyecto
3. Ejecuta `pnpm run deploy` desde `packages/backend`
4. Copia la URL del deployment a tus variables de entorno

## Scripts Disponibles

### Desarrollo

```bash
# Iniciar todos los servicios en modo desarrollo
pnpm dev

# Solo frontend
pnpm --filter web dev

# Solo backend
pnpm --filter @workspace/backend dev
```

### Build

```bash
# Build de todos los paquetes
pnpm build

# Build solo del frontend
pnpm --filter web build
```

### Linting

```bash
# Lint de todos los paquetes
pnpm lint

# Lint solo del frontend
pnpm --filter web lint
```

### Deploy

```bash
# Deploy del backend Convex
pnpm deploy
```

## Agregar Componentes UI

Este template usa [shadcn/ui](https://ui.shadcn.com). Para agregar componentes:

```bash
cd apps/web
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
# etc...
```

Los componentes se agregarán automáticamente en `packages/ui/src/components`.

## Uso de Componentes

```tsx
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"

export default function MyComponent() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  )
}
```

## Autenticación

El template incluye autenticación con Clerk configurada. Los usuarios se sincronizan automáticamente con Convex a través de webhooks.

### Rutas Protegidas

Las rutas bajo `/dashboard` requieren autenticación. El middleware redirige automáticamente a `/sign-in` si el usuario no está autenticado.

### Hooks de Autenticación

```tsx
import { useAuthNavigation } from "@/hooks/use-auth-navigation"
import { useAuthSync } from "@/hooks/use-auth-sync"

// useAuthSync sincroniza el estado de autenticación
useAuthSync()

// useAuthNavigation proporciona utilidades de navegación
const { authStatus, redirectToCorrectPage } = useAuthNavigation()
```

## Base de Datos

El schema de Convex está en `packages/backend/convex/schema.ts`. Actualmente solo incluye la tabla `users` básica. Puedes agregar tus propias tablas según necesites.

## Estructura de Rutas

- `/` - Landing page pública
- `/sign-in` - Página de inicio de sesión
- `/sign-up` - Página de registro
- `/dashboard` - Dashboard protegido (requiere autenticación)

## Próximos Pasos

1. Configura tus variables de entorno
2. Configura Clerk y Convex
3. Personaliza el schema de Convex según tus necesidades
4. Agrega componentes UI con shadcn/ui
5. Construye tu aplicación 🚀

## Licencia

MIT
