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
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../packages/backend/convex/_generated/api";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Id } from "../../../packages/backend/convex/_generated/dataModel";

interface AssignStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignStudentsDialog({ open, onOpenChange }: AssignStudentsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<Id<"subjects"> | "">("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<Id<"users">>>(new Set());
  
  const { user } = useCurrentUser();
  const subjects = useQuery(
    api.subjects.getByTeacher,
    user?._id ? { teacherId: user._id } : "skip"
  );
  const students = useQuery(api.admin.getAllStudents);
  const enrollMultiple = useMutation(api.enrollments.enrollMultiple);

  const toggleStudent = (studentId: Id<"users">) => {
    const newSet = new Set(selectedStudentIds);
    if (newSet.has(studentId)) {
      newSet.delete(studentId);
    } else {
      newSet.add(studentId);
    }
    setSelectedStudentIds(newSet);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?._id) {
      toast.error("Usuario no encontrado");
      return;
    }

    if (!selectedSubjectId) {
      toast.error("Selecciona una asignatura");
      return;
    }

    if (selectedStudentIds.size === 0) {
      toast.error("Selecciona al menos un estudiante");
      return;
    }

    setIsLoading(true);

    try {
      const results = await enrollMultiple({
        subjectId: selectedSubjectId as Id<"subjects">,
        userIds: Array.from(selectedStudentIds),
        enrolledBy: user._id,
      });

      const enrolled = results.filter((r) => r.enrolled).length;
      const alreadyEnrolled = results.filter((r) => !r.enrolled).length;

      if (enrolled > 0) {
        toast.success(
          `${enrolled} estudiante(s) asignado(s) exitosamente${
            alreadyEnrolled > 0 ? `. ${alreadyEnrolled} ya estaban asignados` : ""
          }`
        );
      } else {
        toast.info("Todos los estudiantes ya estaban asignados");
      }
      
      // Reset
      setSelectedSubjectId("");
      setSelectedStudentIds(new Set());
      onOpenChange(false);
    } catch (error) {
      console.error("Error assigning students:", error);
      toast.error("Error al asignar estudiantes");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Asignar Estudiantes a Asignatura</DialogTitle>
          <DialogDescription>
            Selecciona una asignatura y los estudiantes que quieres asignar
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Select Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Asignatura</Label>
              <Select
                value={selectedSubjectId}
                onValueChange={(value) => setSelectedSubjectId(value as Id<"subjects">)}
                disabled={isLoading}
              >
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Selecciona una asignatura" />
                </SelectTrigger>
                <SelectContent>
                  {subjects?.map((subject) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Students */}
            <div className="space-y-2">
              <Label>Estudiantes ({selectedStudentIds.size} seleccionados)</Label>
              <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-3">
                {students === undefined ? (
                  <p className="text-sm text-muted-foreground">Cargando...</p>
                ) : students.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No hay estudiantes disponibles
                  </p>
                ) : (
                  students.map((student) => (
                    <div key={student._id} className="flex items-center space-x-3">
                      <Checkbox
                        id={student._id}
                        checked={selectedStudentIds.has(student._id)}
                        onCheckedChange={() => toggleStudent(student._id)}
                        disabled={isLoading}
                      />
                      <label
                        htmlFor={student._id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                      >
                        {student.firstName} {student.lastName}
                        <span className="text-muted-foreground ml-2">
                          ({student.email})
                        </span>
                      </label>
                    </div>
                  ))
                )}
              </div>
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
            <Button type="submit" disabled={isLoading || !selectedSubjectId || selectedStudentIds.size === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Asignando...
                </>
              ) : (
                `Asignar ${selectedStudentIds.size > 0 ? `(${selectedStudentIds.size})` : ""}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

