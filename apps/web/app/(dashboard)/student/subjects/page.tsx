"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../packages/backend/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { BookOpen, FolderOpen } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";

export default function StudentSubjectsPage() {
  const { user } = useCurrentUser();
  const enrollments = useQuery(
    api.enrollments.getByStudent,
    user?._id ? { userId: user._id } : "skip"
  );

  const subjects = enrollments?.map((e) => e.subject).filter((s) => s !== null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mis Asignaturas</h1>
        <p className="text-muted-foreground mt-2">
          Accede a tus asignaturas y explora el contenido
        </p>
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
              No tienes asignaturas asignadas
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Contacta con tu profesor para que te asigne a una asignatura
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Card
              key={subject._id}
              className="hover:shadow-md transition-shadow cursor-pointer group"
            >
              <Link href={`/student/subjects/${subject._id}`}>
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
                    <div className="text-sm text-primary font-medium">
                      Ver temas →
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

