"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../../../../packages/backend/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, Upload, FileText } from "lucide-react";
import Link from "next/link";
import { Id } from "../../../../../../../../packages/backend/convex/_generated/dataModel";
import { FileUploadDialog } from "@/components/teacher/file-upload-dialog";
import { FilesList } from "@/components/teacher/files-list";

export default function TopicDetailPage({ 
  params 
}: { 
  params: { subjectId: Id<"subjects">; topicId: Id<"topics"> } 
}) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const topic = useQuery(api.topics.getById, { topicId: params.topicId });
  const files = useQuery(api.files.getByTopic, { topicId: params.topicId });

  if (topic === undefined || files === undefined) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Tema no encontrado</p>
            <Link href={`/teacher/subjects/${params.subjectId}`}>
              <Button variant="outline" className="mt-4">
                Volver a la Asignatura
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
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/teacher/subjects/${params.subjectId}`}>
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la Asignatura
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{topic.name}</h1>
          <p className="text-muted-foreground mt-2">
            {topic.description || "Sin descripción"}
          </p>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Subir Archivos
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archivos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{files.length}</div>
            <p className="text-xs text-muted-foreground">Documentos subidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Files Section */}
      <Card>
        <CardHeader>
          <CardTitle>Archivos del Tema</CardTitle>
          <CardDescription>
            Gestiona los archivos y documentos de este tema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FilesList files={files} topicId={params.topicId} />
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <FileUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        topicId={params.topicId}
        subjectId={params.subjectId}
      />
    </div>
  );
}

