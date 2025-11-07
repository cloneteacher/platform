"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  Users,
  BookOpen,
  GraduationCap,
  UserCog,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

export default function DashboardPage() {
  const { user, isLoading } = useCurrentUser();
  const stats = useQuery(api.admin.getStats);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Sincronizando tu cuenta...</CardTitle>
            <CardDescription>
              Por favor espera un momento mientras configuramos tu perfil.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Si esto toma más de 10 segundos, intenta refrescar la página.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard para Admin
  if (user.role === "admin") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Dashboard de Administrador
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestiona profesores y visualiza estadísticas del sistema
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profesores</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {stats?.totalTeachers || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Registrados en el sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estudiantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {stats?.totalStudents || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Activos en el sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asignaturas</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {stats?.totalSubjects || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Creadas por profesores
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temas</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {stats?.totalTopics || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Contenido disponible
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Gestionar Profesores</CardTitle>
              <CardDescription>
                Crea nuevos profesores y gestiona sus permisos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/admin/teachers">
                <Button className="w-full">
                  <UserCog className="mr-2 h-4 w-4" />
                  Ver Profesores
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Dashboard para Profesor
  if (user.role === "teacher") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Bienvenido, {user.firstName}
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tus asignaturas, temas y alumnos
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Asignaturas
              </CardTitle>
              <CardDescription>
                Crea y gestiona tus asignaturas y temas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/teacher/subjects">
                <Button className="w-full">
                  Ver Asignaturas
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Alumnos
              </CardTitle>
              <CardDescription>
                Asigna estudiantes y revisa sus exámenes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/teacher/students">
                <Button className="w-full">
                  Ver Alumnos
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="mr-2 h-5 w-5 text-primary" />
                Nueva Asignatura
              </CardTitle>
              <CardDescription>
                Comienza creando una nueva asignatura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/teacher/subjects">
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Crear Ahora
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Dashboard para Estudiante
  if (user.role === "student") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Hola, {user.firstName}
          </h1>
          <p className="text-muted-foreground mt-2">
            Accede a tus asignaturas y continúa aprendiendo
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:shadow-md transition-shadow border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                Mis Asignaturas
              </CardTitle>
              <CardDescription>
                Accede a tus asignaturas y estudia los temas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/student/subjects">
                <Button className="w-full">
                  Ver Asignaturas
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Continuar Estudiando</CardTitle>
              <CardDescription>
                Retoma donde lo dejaste y sigue aprendiendo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/student/subjects">
                <Button variant="outline" className="w-full">
                  Ir a Asignaturas
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
