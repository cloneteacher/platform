"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { FileQuestion, Plus } from "lucide-react";
import { Id } from "@workspace/backend/_generated/dataModel";

interface ExamInterfaceProps {
  topicId: Id<"topics">;
}

export function ExamInterface({ topicId }: ExamInterfaceProps) {
  // TODO: Integrate with exams system
  // - Fetch available exams for this topic
  // - Show exam history and results
  // - Allow taking new exams

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileQuestion className="mr-2 h-5 w-5 text-primary" />
          Exámenes de Práctica
        </CardTitle>
        <CardDescription>
          Pon a prueba tus conocimientos con exámenes generados automáticamente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="rounded-full bg-muted p-6">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Sistema de Exámenes en Desarrollo
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Pronto podrás generar y realizar exámenes personalizados basados
              en los materiales del tema, con corrección automática y
              retroalimentación.
            </p>
          </div>
          <Button disabled variant="outline" className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Generar Nuevo Examen
          </Button>
        </div>

        {/* Placeholder para futuros exámenes */}
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-foreground">Próximamente:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center">
              <span className="mr-2">📝</span>
              Exámenes generados con IA basados en los materiales
            </li>
            <li className="flex items-center">
              <span className="mr-2">⚡</span>
              Corrección automática instantánea
            </li>
            <li className="flex items-center">
              <span className="mr-2">📊</span>
              Historial de resultados y estadísticas
            </li>
            <li className="flex items-center">
              <span className="mr-2">🎯</span>
              Retroalimentación personalizada
            </li>
            <li className="flex items-center">
              <span className="mr-2">🏆</span>
              Diferentes niveles de dificultad
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
