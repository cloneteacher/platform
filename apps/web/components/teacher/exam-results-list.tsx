"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { User, Calendar, Award, FileText } from "lucide-react";
import { Id } from "@workspace/backend/_generated/dataModel";

type ExamResultEntry = {
  exam: {
    _id: Id<"exams">;
    createdAt: number;
    subjectId: Id<"subjects">;
    topicId: Id<"topics">;
  };
  subject: {
    _id: Id<"subjects">;
    name: string;
  } | null;
  topic: {
    _id: Id<"topics">;
    name: string;
  } | null;
  result: {
    _id: Id<"examResults">;
    score: number;
    totalQuestions: number;
    percentage: number;
    correctAnswers: number;
    completedAt: number;
  };
  questions: Array<{
    questionIndex: number;
    question: string;
    options: string[];
    correctAnswer: string | boolean | Record<string, unknown>;
    studentAnswer: string | boolean | string[] | null;
    isCorrect: boolean;
  }>;
  student?: {
    _id: Id<"users">;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
};

interface ExamResultsListProps {
  results: ExamResultEntry[];
}

export function ExamResultsList({ results }: ExamResultsListProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80)
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (percentage >= 60)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  };

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            No hay resultados de exámenes todavía
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Los resultados aparecerán aquí cuando los estudiantes completen los
            exámenes
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados de Exámenes</CardTitle>
        <CardDescription>
          Revisa los resultados de los exámenes completados por tus estudiantes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-center">Puntuación</TableHead>
                <TableHead className="text-center">Correctas</TableHead>
                <TableHead className="text-center">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((entry) => (
                <TableRow key={entry.result._id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {entry.student
                            ? `${entry.student.firstName} ${entry.student.lastName}`
                            : "Estudiante desconocido"}
                        </div>
                        {entry.student && (
                          <div className="text-xs text-muted-foreground">
                            {entry.student.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(entry.result.completedAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getScoreColor(entry.result.percentage)}>
                      <Award className="mr-1 h-3 w-3" />
                      {entry.result.percentage}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">
                      {entry.result.correctAnswers} /{" "}
                      {entry.result.totalQuestions}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm text-muted-foreground">
                      {entry.result.totalQuestions} preguntas
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
