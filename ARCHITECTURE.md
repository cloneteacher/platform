# Arquitectura de CloneTeacher

Documentación técnica detallada de la arquitectura del proyecto.

## 📐 Visión General

CloneTeacher es una aplicación monorepo construida con:

- **Frontend**: Next.js 15 (App Router)
- **Backend**: Convex (BaaS)
- **Auth**: Clerk
- **UI**: Tailwind + Radix UI + shadcn/ui

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │   Admin    │  │  Teacher   │  │  Student   │       │
│  │   Pages    │  │   Pages    │  │   Pages    │       │
│  └────────────┘  └────────────┘  └────────────┘       │
│         │               │               │               │
│         └───────────────┴───────────────┘               │
│                         │                               │
│              ┌──────────▼──────────┐                   │
│              │   Convex Client     │                   │
│              │   + Clerk Auth      │                   │
│              └──────────┬──────────┘                   │
└─────────────────────────┼───────────────────────────────┘
                          │
                          │ HTTPS
                          │
┌─────────────────────────▼───────────────────────────────┐
│                Backend (Convex)                         │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Mutations  │  │   Queries    │  │   Storage    │  │
│  └─────────────┘  └──────────────┘  └──────────────┘  │
│         │                │                  │           │
│         └────────────────┴──────────────────┘           │
│                         │                               │
│              ┌──────────▼──────────┐                   │
│              │   Database Tables   │                   │
│              └─────────────────────┘                   │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Webhook
                          │
┌─────────────────────────▼───────────────────────────────┐
│                  Clerk (Auth)                           │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Sign Up   │  │   Sign In    │  │  User Mgmt   │  │
│  └─────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🏗️ Estructura del Monorepo

```
cloneteacher/
├── apps/
│   └── web/                      # Aplicación Next.js
│       ├── app/                  # App Router
│       │   ├── (auth)/          # Grupo de rutas públicas
│       │   ├── (dashboard)/     # Grupo de rutas protegidas
│       │   ├── api/             # API routes
│       │   └── layout.tsx       # Root layout
│       ├── components/          # Componentes React
│       ├── hooks/               # Custom hooks
│       ├── lib/                 # Utilidades
│       └── middleware.ts        # Middleware de Clerk
│
├── packages/
│   ├── backend/                 # Backend Convex
│   │   └── convex/
│   │       ├── _generated/      # Tipos generados
│   │       ├── schema.ts        # Schema DB
│   │       ├── users.ts         # Users queries/mutations
│   │       ├── subjects.ts      # Subjects CRUD
│   │       ├── topics.ts        # Topics CRUD
│   │       ├── files.ts         # File management
│   │       ├── enrollments.ts   # Student enrollments
│   │       ├── admin.ts         # Admin functions
│   │       ├── clerk.ts         # Clerk webhook
│   │       └── utils.ts         # Helpers
│   │
│   └── ui/                      # Componentes UI compartidos
│       └── src/
│           ├── components/      # shadcn/ui components
│           ├── styles/          # CSS global
│           └── lib/             # Utilidades UI
│
├── turbo.json                   # Configuración Turbo
├── package.json                 # Root package.json
└── pnpm-workspace.yaml         # Workspace config
```

---

## 🔐 Autenticación y Autorización

### Flujo de Autenticación

```
1. Usuario → Sign In/Up (Clerk)
2. Clerk → Crea sesión JWT
3. Clerk → Dispara webhook a Convex
4. Convex → Sincroniza usuario a tabla users
5. Usuario → Accede a app con JWT
6. Middleware → Verifica rol y redirige
```

### Sistema de Roles

```typescript
type Role = "admin" | "teacher" | "student"

// Jerarquía de permisos:
admin > teacher > student

// Acceso a rutas:
/admin/*       → solo admin
/teacher/*     → admin + teacher
/student/*     → solo student
/dashboard     → todos los roles
```

### Protección de Rutas (Middleware)

```typescript
// apps/web/middleware.ts
export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  // Lógica de protección por rol
  if (isAdminRoute(request) && role !== "admin") {
    return redirect("/dashboard");
  }
  // ...
});
```

### Protección de Mutations (Convex)

```typescript
// packages/backend/convex/utils.ts
export async function requireTeacher(ctx: QueryCtx | MutationCtx) {
  const user = await ctx.auth.getUserIdentity();
  if (!user) throw new Error("Not authenticated");

  const userData = await getUserByClerkId(ctx, user.subject);
  if (!userData || (userData.role !== "teacher" && userData.role !== "admin")) {
    throw new Error("Not authorized");
  }

  return userData;
}
```

---

## 💾 Base de Datos (Convex)

### Schema

```typescript
// packages/backend/convex/schema.ts
export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("teacher"),
      v.literal("student")
    ),
  }).index("by_clerk_id", ["clerkId"]),

  subjects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    teacherId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_teacher", ["teacherId"]),

  topics: defineTable({
    subjectId: v.id("subjects"),
    name: v.string(),
    description: v.optional(v.string()),
    teacherId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_subject", ["subjectId"])
    .index("by_teacher", ["teacherId"]),

  topicFiles: defineTable({
    topicId: v.id("topics"),
    subjectId: v.id("subjects"),
    teacherId: v.id("users"),
    fileName: v.string(),
    fileType: v.string(),
    storageId: v.id("_storage"),
    uploadedAt: v.number(),
  })
    .index("by_topic", ["topicId"])
    .index("by_subject", ["subjectId"]),

  subjectEnrollments: defineTable({
    subjectId: v.id("subjects"),
    userId: v.id("users"),
    enrolledAt: v.number(),
    enrolledBy: v.id("users"),
  })
    .index("by_subject", ["subjectId"])
    .index("by_user", ["userId"])
    .index("by_subject_and_user", ["subjectId", "userId"]),

  // Preparado para futura implementación
  exams: defineTable({
    topicId: v.id("topics"),
    subjectId: v.id("subjects"),
    userId: v.id("users"),
    questions: v.array(v.any()),
    status: v.union(v.literal("draft"), v.literal("published")),
    createdAt: v.number(),
  }),

  examResults: defineTable({
    examId: v.id("exams"),
    topicId: v.id("topics"),
    userId: v.id("users"),
    answers: v.array(v.any()),
    score: v.number(),
    totalQuestions: v.number(),
    completedAt: v.number(),
  }),
});
```

### Relaciones

```
users (1) ──< subjects (N)
        └──< topics (N)
        └──< topicFiles (N)
        └──< exams (N)

subjects (1) ──< topics (N)
         └──< topicFiles (N)
         └──< subjectEnrollments (N)

topics (1) ──< topicFiles (N)
       └──< exams (N)

exams (1) ──< examResults (N)
```

---

## 🔄 Flujo de Datos

### Query Pattern

```typescript
// 1. Hook en componente
const subjects = useQuery(api.subjects.getSubjectsByTeacher);

// 2. Query en Convex
export const getSubjectsByTeacher = query({
  args: {},
  handler: async (ctx) => {
    const teacher = await requireTeacher(ctx);
    return await ctx.db
      .query("subjects")
      .withIndex("by_teacher", (q) => q.eq("teacherId", teacher._id))
      .collect();
  },
});
```

### Mutation Pattern

```typescript
// 1. Hook en componente
const createSubject = useMutation(api.subjects.createSubject);

// 2. Llamada
await createSubject({ name: "Math", description: "..." });

// 3. Mutation en Convex
export const createSubject = mutation({
  args: { name: v.string(), description: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const teacher = await requireTeacher(ctx);
    return await ctx.db.insert("subjects", {
      ...args,
      teacherId: teacher._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
```

### File Upload Pattern

```typescript
// 1. Generar URL de upload
const uploadUrl = await generateUploadUrl();

// 2. Upload a Convex Storage
const result = await fetch(uploadUrl, {
  method: "POST",
  headers: { "Content-Type": file.type },
  body: file,
});
const { storageId } = await result.json();

// 3. Guardar metadata
await addTopicFile({
  topicId,
  subjectId,
  storageId,
  fileName: file.name,
  fileType: file.type,
});
```

---

## 🎨 Sistema de Diseño

### Theming (CSS Variables)

```css
/* packages/ui/src/styles/globals.css */
:root {
  /* Palette principal */
  --primary: oklch(0.65 0.22 50); /* Naranja */
  --background: oklch(1 0 0); /* Blanco */
  --foreground: oklch(0.2 0 0); /* Gris oscuro */

  /* Componentes */
  --card: oklch(1 0 0);
  --border: oklch(0.9 0 0);
  --input: oklch(0.95 0 0);

  /* Sidebar */
  --sidebar: oklch(1 0 0);
  --sidebar-primary: oklch(0.65 0.22 50);

  /* Radius */
  --radius: 0.5rem;
}
```

### Componentes UI

Basados en shadcn/ui + Radix UI:

- Button
- Card
- Dialog / Modal
- Input / Textarea
- Select / Dropdown
- Table
- Tabs
- Avatar
- Separator
- Label
- Toast (react-hot-toast)

### Tipografía

```typescript
// apps/web/app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});
```

---

## 🚀 Patrones de Desarrollo

### Custom Hooks

```typescript
// apps/web/hooks/use-current-user.ts
export function useCurrentUser() {
  const { userId, isLoading: isClerkLoading } = useAuth();
  const user = useQuery(api.users.getCurrentUser, userId ? {} : "skip");

  return {
    user,
    isLoading: isClerkLoading || user === undefined,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isTeacher: user?.role === "teacher",
    isStudent: user?.role === "student",
  };
}
```

### Estado Global (Jotai)

```typescript
// apps/web/lib/store/auth-atoms.ts
export const authStatusAtom = atom<
  "loading" | "authenticated" | "unauthenticated"
>("loading");
```

### Loading States

```typescript
// Pattern 1: Undefined check
if (subjects === undefined) {
  return <LoadingScreen message="Cargando..." />;
}

// Pattern 2: Optional rendering
{subjects?.map(subject => ...)}
```

### Error Handling

```typescript
try {
  await createSubject({ name, description });
  toast.success("Asignatura creada!");
  onClose();
} catch (error: any) {
  toast.error(error.message || "Error al crear asignatura.");
}
```

---

## 📂 Convenciones de Código

### Nomenclatura

- **Componentes**: PascalCase (`CreateSubjectDialog.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useCurrentUser.ts`)
- **Utilidades**: camelCase (`requireTeacher`, `getUserByClerkId`)
- **Tipos**: PascalCase (`Role`, `SubjectWithTopics`)

### Estructura de Componentes

```typescript
"use client"; // Si usa hooks de React

import { /* dependencias */ } from "...";

interface ComponentProps {
  prop1: string;
  prop2?: number;
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState();
  const data = useQuery(...);

  // 2. Handlers
  const handleAction = async () => { ... };

  // 3. Effects
  useEffect(() => { ... }, []);

  // 4. Render
  return ( ... );
}
```

### Imports Order

1. React / Next.js
2. Librerías externas
3. Componentes UI
4. Hooks personalizados
5. Utilidades
6. Tipos
7. Estilos

---

## 🔮 Arquitectura Futura

### RAG (Retrieval-Augmented Generation)

**Propuesta:**

```typescript
// 1. Embeddings de archivos
export const generateEmbeddings = action({
  handler: async (ctx, { fileId }) => {
    const file = await ctx.db.get(fileId);
    const content = await extractTextFromFile(file.storageId);
    const embeddings = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: content,
    });
    await ctx.db.patch(fileId, { embeddings: embeddings.data });
  },
});

// 2. Búsqueda semántica
export const searchContext = action({
  handler: async (ctx, { query, topicId }) => {
    const queryEmbedding = await generateEmbedding(query);
    const files = await ctx.db
      .query("topicFiles")
      .withIndex("by_topic", (q) => q.eq("topicId", topicId))
      .collect();

    // Calcular similitud coseno
    const relevantChunks = findMostSimilar(queryEmbedding, files);
    return relevantChunks;
  },
});

// 3. Chat con contexto
export const chatWithRAG = action({
  handler: async (ctx, { message, topicId }) => {
    const context = await searchContext(ctx, { query: message, topicId });
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: `Context: ${context}` },
        { role: "user", content: message },
      ],
    });
    return response.choices[0].message.content;
  },
});
```

### Sistema de Exámenes

**Propuesta:**

```typescript
// 1. Generar examen con IA
export const generateExam = action({
  handler: async (ctx, { topicId, difficulty, count }) => {
    const files = await getTopicFiles(ctx, topicId);
    const content = await extractContent(files);

    const questions = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Generate ${count} ${difficulty} questions from: ${content}`,
        },
      ],
    });

    return await ctx.db.insert("exams", {
      topicId,
      questions: JSON.parse(questions),
      status: "published",
      createdAt: Date.now(),
    });
  },
});

// 2. Evaluar respuestas
export const gradeExam = mutation({
  handler: async (ctx, { examId, answers }) => {
    const exam = await ctx.db.get(examId);
    let score = 0;

    for (let i = 0; i < exam.questions.length; i++) {
      if (answers[i] === exam.questions[i].correctAnswer) {
        score++;
      }
    }

    return await ctx.db.insert("examResults", {
      examId,
      userId: user._id,
      answers,
      score,
      totalQuestions: exam.questions.length,
      completedAt: Date.now(),
    });
  },
});
```

---

## 🧪 Testing (Recomendado)

```typescript
// Vitest + React Testing Library
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CreateSubjectDialog } from './create-subject-dialog';

describe('CreateSubjectDialog', () => {
  it('renders form fields', () => {
    render(<CreateSubjectDialog isOpen={true} onClose={() => {}} />);
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('Descripción')).toBeInTheDocument();
  });
});
```

---

## 📊 Monitoreo y Logging

### Convex Logs

```typescript
// En cualquier mutation/query
console.log("Processing subject creation:", args);
// Visible en `npx convex dev` y en Convex Dashboard
```

### Client-side Error Tracking

```typescript
// Sentry (recomendado)
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

---

## 🔧 Optimizaciones

### React Query Optimization

```typescript
// Prefetch data
await client.prefetchQuery({
  queryKey: ["subjects"],
  queryFn: () => fetchSubjects(),
});
```

### Next.js Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/avatar.png"
  alt="Avatar"
  width={40}
  height={40}
  priority
/>
```

### Code Splitting

```typescript
// Dynamic imports
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
});
```

---

## 📚 Referencias

- [Next.js Docs](https://nextjs.org/docs)
- [Convex Docs](https://docs.convex.dev)
- [Clerk Docs](https://clerk.com/docs)
- [Radix UI Docs](https://www.radix-ui.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Última actualización**: 2025-01-06
