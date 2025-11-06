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
import { api } from "../../../packages/backend/convex/_generated/api";
import { useCurrentUser } from "@/hooks/use-current-user";

interface CreateSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSubjectDialog({ open, onOpenChange }: CreateSubjectDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const { user } = useCurrentUser();
  const createSubject = useMutation(api.subjects.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?._id) {
      toast.error("Usuario no encontrado");
      return;
    }

    setIsLoading(true);

    try {
      await createSubject({
        name: formData.name,
        description: formData.description || undefined,
        teacherId: user._id,
      });
      
      toast.success("Asignatura creada exitosamente");
      
      // Reset form
      setFormData({
        name: "",
        description: "",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating subject:", error);
      toast.error("Error al crear la asignatura");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Asignatura</DialogTitle>
          <DialogDescription>
            Completa los datos de la nueva asignatura. Podrás añadir temas después.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Asignatura</Label>
              <Input
                id="name"
                placeholder="Ej: Matemáticas Avanzadas"
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
                placeholder="Describe brevemente el contenido de la asignatura"
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
                "Crear Asignatura"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

