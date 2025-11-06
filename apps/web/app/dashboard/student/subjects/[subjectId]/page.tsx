"use client";

import { use } from "react";
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
import { ArrowLeft, FileText, Layers } from "lucide-react";
import Link from "next/link";
import { Id } from "@workspace/backend/_generated/dataModel";

export default function StudentSubjectDetailPage({
  params,
}: {
  params: Promise<{ subjectId: Id<"subjects"> }>;
}) {
  const { subjectId } = use(params);
  const subject = useQuery(api.subjects.getById, {
    subjectId,
  });
  const topics = useQuery(api.topics.getBySubject, {
    subjectId,
  });

  if (subject === undefined || topics === undefined) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Asignatura no encontrada</p>
            <Link href="/dashboard/student/subjects">
              <Button variant="outline" className="mt-4">
                Volver a Mis Asignaturas
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/student/subjects">
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">{subject.name}</h1>
        <p className="text-muted-foreground mt-2">
          {subject.description || "Sin descripción"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Temas Disponibles
            </CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {topics.length}
            </div>
            <p className="text-xs text-muted-foreground">Temas para estudiar</p>
          </CardContent>
        </Card>
      </div>

      {/* Topics List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Temas de la Asignatura</h2>
        {topics.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No hay temas disponibles todavía
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Tu profesor aún no ha añadido contenido a esta asignatura
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <Card
                key={topic._id}
                className="hover:shadow-md transition-shadow cursor-pointer group"
              >
                <Link
                  href={`/dashboard/student/subjects/${subjectId}/topics/${topic._id}`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center group-hover:text-primary transition-colors">
                      <FileText className="mr-2 h-5 w-5" />
                      {topic.name}
                    </CardTitle>
                    <CardDescription>
                      {topic.description || "Sin descripción"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-primary font-medium">
                        Estudiar →
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
