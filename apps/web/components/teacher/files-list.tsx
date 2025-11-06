"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { FileText, Download, Trash2, Upload } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../packages/backend/convex/_generated/api";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Id } from "../../../packages/backend/convex/_generated/dataModel";

interface FilesListProps {
  files: Array<{
    _id: Id<"topicFiles">;
    fileName: string;
    fileType: string;
    uploadedAt: number;
    url: string | null;
  }>;
  topicId: Id<"topics">;
}

export function FilesList({ files, topicId }: FilesListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<Id<"topicFiles"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const removeFile = useMutation(api.files.remove);

  const handleDeleteClick = (fileId: Id<"topicFiles">) => {
    setFileToDelete(fileId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;

    setIsDeleting(true);
    try {
      await removeFile({ fileId: fileToDelete });
      toast.success("Archivo eliminado exitosamente");
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Error al eliminar el archivo");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = (url: string | null, fileName: string) => {
    if (!url) {
      toast.error("URL del archivo no disponible");
      return;
    }
    
    // Open in new tab for download
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          No hay archivos subidos en este tema
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Usa el botón "Subir Archivos" para añadir documentos
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Archivo</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Fecha de Subida</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file._id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {getFileIcon(file.fileType)}
                  <span className="font-medium">{file.fileName}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                  {file.fileType.split("/")[1]?.toUpperCase() || "FILE"}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(file.uploadedAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(file.url, file.fileName)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(file._id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar archivo?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El archivo será eliminado permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

