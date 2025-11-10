"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Separator } from "@workspace/ui/components/separator";
import { BarChart3, BookOpenCheck, Filter, Loader2 } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Id } from "@workspace/backend/_generated/dataModel";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRoleGuard } from "@/hooks/use-role-guard";
import { LoadingScreen } from "@/components/loading";

type SubjectOption = {
  id: Id<"subjects">;
  name: string;
};

const ALL_OPTION = "all" as const;

const formatDate = (timestamp: number) => {
  try {
    return new Intl.DateTimeFormat("es", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(timestamp));
  } catch (error) {
    console.error("Error formatting date", error);
    return "Fecha desconocida";
  }
};

const formatAnswer = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "Sin respuesta";
  }

  if (typeof value === "boolean") {
    return value ? "Verdadero" : "Falso";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch (error) {
      return "Respuesta no disponible";
    }
  }

  try {
    return String(value);
  } catch (error) {
    return "Respuesta no disponible";
  }
};

export default function StudentExamHistoryPage() {
  const { user } = useCurrentUser();
  const { isLoading: isCheckingRole, hasAccess } = useRoleGuard({
    allowedRoles: ["student"],
  });

  const [selectedSubjectId, setSelectedSubjectId] =
    useState<string>(ALL_OPTION);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(ALL_OPTION);
  const [expandedExamId, setExpandedExamId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedTopicId(ALL_OPTION);
  }, [selectedSubjectId]);

  const enrollments = useQuery(
    api.enrollments.getByStudent,
    user?._id ? { userId: user._id } : "skip"
  );

  const subjects = useMemo<SubjectOption[]>(() => {
    if (!enrollments) {
      return [];
    }

    const subjectOptions: SubjectOption[] = [];
    for (const enrollment of enrollments) {
      const subject = enrollment.subject;
      if (!subject) {
        continue;
      }

      subjectOptions.push({
        id: subject._id,
        name: subject.name,
      });
    }

    return subjectOptions;
  }, [enrollments]);

  const topics = useQuery(
    api.topics.getBySubject,
    selectedSubjectId !== ALL_OPTION
      ? { subjectId: selectedSubjectId as Id<"subjects"> }
      : "skip"
  );

  useEffect(() => {
    if (selectedTopicId === ALL_OPTION) {
      return;
    }

    if (!topics) {
      return;
    }

    const targetTopicId = selectedTopicId as Id<"topics">;
    const exists = topics.some((topic) => topic._id === targetTopicId);
    if (!exists) {
      setSelectedTopicId(ALL_OPTION);
    }
  }, [selectedTopicId, topics]);

  const examHistory = useQuery(
    api.examActions.getStudentExamHistory,
    user?._id
      ? {
          userId: user._id,
          subjectId:
            selectedSubjectId !== ALL_OPTION
              ? (selectedSubjectId as Id<"subjects">)
              : undefined,
          topicId:
            selectedTopicId !== ALL_OPTION
              ? (selectedTopicId as Id<"topics">)
              : undefined,
        }
      : "skip"
  );

  const isLoadingData =
    examHistory === undefined ||
    enrollments === undefined ||
    (selectedSubjectId !== ALL_OPTION && topics === undefined);

  if (isCheckingRole || !hasAccess) {
    return <LoadingScreen message="Verificando permisos..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">
          Revisión de Exámenes
        </h1>
        <p className="text-muted-foreground">
          Consulta tus resultados, analiza tus respuestas y repasa los temas
          donde necesitas reforzar.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </CardTitle>
            <CardDescription>
              Filtra por asignatura y tema para revisar tus exámenes
              completados.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Asignatura
            </p>
            <Select
              value={selectedSubjectId}
              onValueChange={(value) => setSelectedSubjectId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una asignatura" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_OPTION}>
                  Todas las asignaturas
                </SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Tema</p>
            <Select
              value={selectedTopicId}
              onValueChange={(value) => setSelectedTopicId(value)}
              disabled={
                selectedSubjectId === ALL_OPTION || topics === undefined
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_OPTION}>Todos los temas</SelectItem>
                {topics?.map((topic) => (
                  <SelectItem key={topic._id} value={topic._id}>
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Resumen</p>
            <div className="flex h-10 items-center gap-2 rounded-md border border-dashed border-border px-3 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              {examHistory && examHistory.length > 0
                ? `${examHistory.length} examen${
                    examHistory.length === 1 ? "" : "es"
                  } encontrado${examHistory.length === 1 ? "" : "s"}`
                : "Sin resultados"}
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoadingData ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Cargando historial de exámenes...
            </div>
          </CardContent>
        </Card>
      ) : examHistory && examHistory.length > 0 ? (
        <div className="space-y-4">
          {examHistory.map((entry) => {
            const examId = entry.result._id;
            const isExpanded = expandedExamId === examId;
            const passed = entry.result.percentage >= 70;

            return (
              <Card key={examId} className="border border-border/80">
                <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold">
                      {entry.subject?.name || "Asignatura desconocida"}
                    </CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-2 text-sm">
                      <span>
                        Tema: {entry.topic?.name || "Tema desconocido"}
                      </span>
                      <Separator
                        orientation="vertical"
                        className="hidden h-4 lg:block"
                      />
                      <span>{formatDate(entry.result.completedAt)}</span>
                      <Separator
                        orientation="vertical"
                        className="hidden h-4 lg:block"
                      />
                      <span>
                        {entry.result.correctAnswers} de{" "}
                        {entry.result.totalQuestions} correctas
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        "text-xs",
                        passed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      {entry.result.percentage}%
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {passed ? "Aprobado" : "En revisión"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <BookOpenCheck className="h-4 w-4" />
                    Examen generado el {formatDate(entry.exam.createdAt)}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setExpandedExamId(isExpanded ? null : examId)
                    }
                  >
                    {isExpanded
                      ? "Ocultar detalles"
                      : "Ver detalles del examen"}
                  </Button>

                  {isExpanded && (
                    <div className="space-y-3">
                      {entry.questions.map((question) => {
                        const isCorrect = question.isCorrect;
                        return (
                          <div
                            key={`${examId}-${question.questionIndex}`}
                            className={cn(
                              "rounded-lg border p-4",
                              isCorrect
                                ? "border-emerald-200 bg-emerald-50"
                                : "border-red-200 bg-red-50"
                            )}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-medium text-sm text-foreground">
                                {question.questionIndex + 1}.{" "}
                                {question.question}
                              </h3>
                              <Badge
                                className={cn(
                                  "text-xs",
                                  isCorrect
                                    ? "bg-emerald-500 text-emerald-50"
                                    : "bg-red-500 text-red-50"
                                )}
                              >
                                {isCorrect ? "Correcta" : "Incorrecta"}
                              </Badge>
                            </div>
                            {question.options.length > 0 && (
                              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                {question.options.map((option, index) => (
                                  <li key={index}>
                                    {String.fromCharCode(65 + index)}) {option}
                                  </li>
                                ))}
                              </ul>
                            )}
                            <div className="mt-3 space-y-1 text-sm">
                              <p>
                                <span className="font-medium">
                                  Tu respuesta:
                                </span>{" "}
                                {formatAnswer(question.studentAnswer)}
                              </p>
                              {!question.isCorrect && (
                                <p>
                                  <span className="font-medium">
                                    Respuesta correcta:
                                  </span>{" "}
                                  {formatAnswer(question.correctAnswer)}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground" />
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">
                AÃºn no tienes exámenes registrados
              </h2>
              <p className="text-sm text-muted-foreground">
                Completa un examen en alguno de tus temas para comenzar a ver tu
                historial y repasar tus respuestas.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
