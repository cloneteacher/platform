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
import { Users, UserPlus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { AssignStudentsDialog } from "@/components/teacher/assign-students-dialog";

export default function StudentsPage() {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const students = useQuery(api.admin.getAllStudents);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestión de Alumnos
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualiza y asigna estudiantes a tus asignaturas
          </p>
        </div>
        <Button onClick={() => setIsAssignDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Asignar a Asignatura
        </Button>
      </div>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Estudiantes Registrados
          </CardTitle>
          <CardDescription>
            Total de estudiantes en el sistema: {students?.length || 0}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudiantes</CardTitle>
          <CardDescription>
            Todos los estudiantes registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students === undefined ? (
            <div className="text-center py-8 text-muted-foreground">
              Cargando estudiantes...
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No hay estudiantes registrados todavía
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="font-medium">
                      {student.firstName} {student.lastName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {student.email}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        Estudiante
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAssignDialogOpen(true)}
                      >
                        Asignar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Assign Students Dialog */}
      <AssignStudentsDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
      />
    </div>
  );
}
