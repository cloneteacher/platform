"use client";

import { useQuery } from "convex/react";
import { api } from "../../../packages/backend/convex/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { FileText, Download, FolderOpen } from "lucide-react";
import { Id } from "../../../packages/backend/convex/_generated/dataModel";
import { toast } from "react-hot-toast";

interface TopicMaterialsProps {
  topicId: Id<"topics">;
}

export function TopicMaterials({ topicId }: TopicMaterialsProps) {
  const files = useQuery(api.files.getByTopic, { topicId });

  const handleDownload = (url: string | null, fileName: string) => {
    if (!url) {
      toast.error("URL del archivo no disponible");
      return;
    }
    
    window.open(url, "_blank");
  };

  const getFileIcon = (fileType: string) => {
    return <FileText className="h-5 w-5 text-primary" />;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (files === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">
          Cargando materiales...
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No hay materiales disponibles
        </h3>
        <p className="text-sm text-muted-foreground">
          Tu profesor aún no ha subido archivos para este tema
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Archivos Disponibles</h3>
        <p className="text-sm text-muted-foreground">
          {files.length} archivo(s) para estudiar
        </p>
      </div>

      <div className="space-y-3">
        {files.map((file) => (
          <div
            key={file._id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {getFileIcon(file.fileType)}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.fileName}</p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5">
                    {file.fileType.split("/")[1]?.toUpperCase() || "FILE"}
                  </span>
                  <span>•</span>
                  <span>{formatDate(file.uploadedAt)}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(file.url, file.fileName)}
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

