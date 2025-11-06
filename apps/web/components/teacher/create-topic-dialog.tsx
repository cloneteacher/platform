"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Id } from "@workspace/backend/_generated/dataModel";

interface CreateTopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectId: Id<"subjects">;
}

export function CreateTopicDialog({
  open,
  onOpenChange,
  subjectId,
}: CreateTopicDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const { user } = useCurrentUser();
  const createTopic = useMutation(api.topics.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?._id) {
      toast.error("Usuario no encontrado");
      return;
    }

    setIsLoading(true);

    try {
      await createTopic({
        subjectId,
        name: formData.name,
        description: formData.description || undefined,
        teacherId: user._id,
      });

      toast.success("Tema creado exitosamente");

      // Reset form
      setFormData({
        name: "",
        description: "",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error creating topic:", error);
      toast.error("Error al crear el tema");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Tema</DialogTitle>
          <DialogDescription>
            Completa los datos del nuevo tema. Podrás añadir archivos después.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Tema</Label>
              <Input
                id="name"
                placeholder="Ej: Tema 1: Introducción"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción (Opcional)</Label>
              <Textarea
                id="description"
                placeholder="Describe brevemente el contenido del tema"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={isLoading}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Tema"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
