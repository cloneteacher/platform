"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Plus, UserCog, Mail } from "lucide-react";
import { CreateTeacherDialog } from "@/components/admin/create-teacher-dialog";
import { useRoleGuard } from "@/hooks/use-role-guard";
import { LoadingScreen } from "@/components/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

export default function TeachersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { isLoading: isCheckingRole, hasAccess } = useRoleGuard({
    allowedRoles: ["admin"],
  });
  const teachers = useQuery(api.admin.getAllTeachers);

  // Show loading while checking role
  if (isCheckingRole || !hasAccess) {
    return <LoadingScreen message="Verificando permisos..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profesores</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona los profesores del sistema
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Profesor
        </Button>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCog className="mr-2 h-5 w-5 text-primary" />
            Profesores Registrados
          </CardTitle>
          <CardDescription>
            Total de profesores en el sistema: {teachers?.length || 0}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Profesores</CardTitle>
          <CardDescription>
            Todos los profesores registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teachers === undefined ? (
            <div className="text-center py-8 text-muted-foreground">
              Cargando profesores...
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-8">
              <UserCog className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No hay profesores registrados todavía
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Crear Primer Profesor
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher._id}>
                    <TableCell className="font-medium">
                      {teacher.firstName} {teacher.lastName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        {teacher.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        Profesor
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Teacher Dialog */}
      <CreateTeacherDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
