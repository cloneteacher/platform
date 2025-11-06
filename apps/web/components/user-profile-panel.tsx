"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useUser } from "@clerk/nextjs";
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
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@workspace/ui/components/avatar";
import { Loader2, Camera, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCurrentUser } from "@/hooks/use-current-user";

interface UserProfilePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfilePanel({
  open,
  onOpenChange,
}: UserProfilePanelProps) {
  const { user } = useCurrentUser();
  const { user: clerkUser } = useUser();
  const updateProfile = useMutation(api.users.updateProfile);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
    if (clerkUser?.imageUrl) {
      setImagePreview(clerkUser.imageUrl);
    } else {
      setImagePreview(null);
    }
  }, [user, clerkUser, open]);

  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !clerkUser) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen válida");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen debe ser menor a 5MB");
      return;
    }

    setIsUploadingImage(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Clerk
      await clerkUser.setProfileImage({ file });
      toast.success("Imagen de perfil actualizada exitosamente");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error al actualizar la imagen de perfil");
      setImagePreview(clerkUser.imageUrl || null);
    } finally {
      setIsUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async () => {
    if (!clerkUser) return;

    setIsUploadingImage(true);

    try {
      await clerkUser.setProfileImage({ file: null });
      setImagePreview(null);
      toast.success("Imagen de perfil eliminada");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Error al eliminar la imagen de perfil");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("No se pudo cargar la información del usuario");
      return;
    }

    setIsLoading(true);

    try {
      await updateProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      });

      toast.success("Perfil actualizado exitosamente");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Personalizar Perfil</DialogTitle>
          <DialogDescription>
            Actualiza tu información personal. Los cambios se reflejarán en tu
            cuenta.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 px-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-4">
              <Label>Imagen de Perfil</Label>
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {imagePreview ? (
                    <AvatarImage src={imagePreview} alt="Profile" />
                  ) : null}
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                {isUploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage || isLoading}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {imagePreview ? "Cambiar" : "Subir"}
                </Button>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                    disabled={isUploadingImage || isLoading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isUploadingImage || isLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Formatos: JPG, PNG, GIF. Máximo 5MB
              </p>
            </div>

            {/* Name Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  placeholder="Juan"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                  disabled={isLoading || isUploadingImage}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Apellidos</Label>
                <Input
                  id="lastName"
                  placeholder="García Pérez"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                  disabled={isLoading || isUploadingImage}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading || isUploadingImage}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || isUploadingImage}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
