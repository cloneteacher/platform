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
import { Plus, BookOpen, FolderOpen } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { CreateSubjectDialog } from "@/components/teacher/create-subject-dialog";
import Link from "next/link";

export default function SubjectsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user } = useCurrentUser();
  const subjects = useQuery(
    api.subjects.getByTeacher,
    user?._id ? { teacherId: user._id } : "skip"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Mis Asignaturas
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tus asignaturas y temas
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Asignatura
        </Button>
      </div>

      {/* Subjects Grid */}
      {subjects === undefined ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-10 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : subjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No tienes asignaturas todavía
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
              Crea tu primera asignatura y comienza a añadir temas y contenido
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Crear Primera Asignatura
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Card
              key={subject._id}
              className="hover:shadow-md transition-shadow cursor-pointer group"
            >
              <Link href={`/teacher/subjects/${subject._id}`}>
                <CardHeader>
                  <CardTitle className="flex items-center group-hover:text-primary transition-colors">
                    <BookOpen className="mr-2 h-5 w-5" />
                    {subject.name}
                  </CardTitle>
                  <CardDescription>
                    {subject.description || "Sin descripción"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {/* Placeholder for topic count */}
                      Ver temas →
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}

      {/* Create Subject Dialog */}
      <CreateSubjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
