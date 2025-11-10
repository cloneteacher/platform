"use client";

import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useAction } from "convex/react";
import { FileQuestion, Plus, RotateCcw, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

type ExamQuestionType =
  | "multiple_choice"
  | "true_false"
  | "short_answer"
  | "essay";

type ExamQuestion = {
  type: ExamQuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | boolean | Record<string, unknown>;
  points: number;
};

type Exam = {
  _id: Id<"exams">;
  questions: ExamQuestion[];
  status: "pending" | "completed";
  createdAt: number;
};

type ExamResultEntry = {
  exam: Exam;
  result: {
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    percentage: number;
    completedAt: number;
  };
};

type GenerateExamArgs = {
  topicId: Id<"topics">;
  subjectId: Id<"subjects">;
  userId: Id<"users">;
};

type GenerateExamResponse = {
  examId: Id<"exams">;
  questions: ExamQuestion[];
  hasContext: boolean;
  entriesFound: number;
};

type SubmitExamAnswersArgs = {
  examId: Id<"exams">;
  answers: { questionIndex: number; answer: string }[];
};

type SubmitExamAnswersResponse = {
  resultId: Id<"examResults">;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
};

type GetExamResultsArgs = {
  topicId: Id<"topics">;
  userId: Id<"users">;
};

type RawExamResultEntry = {
  exam: {
    _id: Id<"exams">;
    questions?: unknown;
    status: "pending" | "completed";
    createdAt: number;
  } & Record<string, unknown>;
  result: {
    score: number;
    totalQuestions: number;
    completedAt: number;
  } & Record<string, unknown>;
};

const toExamResultEntries = (
  entries: RawExamResultEntry[]
): ExamResultEntry[] =>
  entries.map((entry) => {
    const questions = Array.isArray(entry.exam.questions)
      ? (entry.exam.questions as ExamQuestion[])
      : [];

    const score = Number(entry.result.score ?? 0);
    const totalQuestions = Number(entry.result.totalQuestions ?? 0);
    const percentage = Math.round(score);
    const correctAnswers = Math.round((score / 100) * totalQuestions);

    return {
      exam: {
        _id: entry.exam._id,
        questions,
        status: entry.exam.status,
        createdAt: entry.exam.createdAt,
      },
      result: {
        score,
        correctAnswers,
        totalQuestions,
        percentage,
        completedAt: entry.result.completedAt,
      },
    };
  });

interface ExamInterfaceProps {
  topicId: Id<"topics">;
  subjectId: Id<"subjects">;
}

export function ExamInterface({ topicId, subjectId }: ExamInterfaceProps) {
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examResult, setExamResult] = useState<ExamResultEntry | null>(null);
  const [examHistory, setExamHistory] = useState<ExamResultEntry[]>([]);
  const { user, isLoading: isUserLoading } = useCurrentUser();

  const generateExamAction = useAction(
    api.examActions.generateExam
  ) as unknown as (args: GenerateExamArgs) => Promise<GenerateExamResponse>;
  const submitAnswersAction = useAction(
    api.examActions.submitExamAnswers
  ) as unknown as (
    args: SubmitExamAnswersArgs
  ) => Promise<SubmitExamAnswersResponse>;
  const getExamResultsAction = useAction(
    api.examActions.getExamResults
  ) as unknown as (args: GetExamResultsArgs) => Promise<unknown>;
  const userId = user?._id ?? null;

  useEffect(() => {
    const loadExamHistory = async () => {
      if (!userId) {
        return;
      }
      try {
        const results = await getExamResultsAction({
          topicId,
          userId,
        });

        if (!Array.isArray(results)) {
          setExamHistory([]);
          return;
        }

        const typedHistory = toExamResultEntries(
          results as RawExamResultEntry[]
        );

        setExamHistory(typedHistory);
      } catch (error) {
        console.error("Error loading exam history:", error);
      }
    };

    loadExamHistory();
  }, [getExamResultsAction, topicId, userId]);

  const handleGenerateExam = async () => {
    if (!userId) {
      return;
    }

    try {
      setIsSubmitting(true);
      setExamResult(null);
      setAnswers({});

      const result = (await generateExamAction({
        topicId,
        subjectId,
        userId,
      })) as GenerateExamResponse;

      setCurrentExam({
        _id: result.examId,
        questions: result.questions,
        status: "pending",
        createdAt: Date.now(),
      });
    } catch (error) {
      console.error("Error generating exam:", error);
      alert(
        "Error al generar el examen. Asegúrate de que hay contenido disponible en los materiales del tema."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmitExam = async () => {
    if (!currentExam || !userId) return;

    const unansweredQuestions =
      currentExam.questions.length - Object.keys(answers).length;
    if (unansweredQuestions > 0) {
      alert(
        `Por favor responde todas las preguntas. Faltan ${unansweredQuestions} preguntas.`
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const formattedAnswers = Object.entries(answers).map(
        ([index, answer]) => ({
          questionIndex: parseInt(index, 10),
          answer,
        })
      );

      const result = (await submitAnswersAction({
        examId: currentExam._id,
        answers: formattedAnswers,
      })) as SubmitExamAnswersResponse;

      setCurrentExam((prev) =>
        prev ? { ...prev, status: "completed" } : null
      );

      setExamResult({
        exam: currentExam,
        result: {
          score: result.score,
          correctAnswers: result.correctAnswers,
          totalQuestions: result.totalQuestions,
          percentage: result.percentage,
          completedAt: Date.now(),
        },
      });

      setAnswers({});
      const updatedHistory = await getExamResultsAction({
        topicId,
        userId,
      });

      if (Array.isArray(updatedHistory)) {
        setExamHistory(
          toExamResultEntries(updatedHistory as RawExamResultEntry[])
        );
      } else {
        setExamHistory([]);
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("Error al enviar el examen. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewExam = () => {
    setCurrentExam(null);
    setExamResult(null);
    setAnswers({});
  };

  if (isUserLoading || user === undefined) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          Cargando información del usuario...
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          Debes iniciar sesión para acceder a los exámenes.
        </CardContent>
      </Card>
    );
  }

  // Show exam taking interface
  if (currentExam && currentExam.status === "pending") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileQuestion className="mr-2 h-5 w-5 text-primary" />
            Examen de Práctica
          </CardTitle>
          <CardDescription>
            Responde las siguientes {currentExam.questions.length} preguntas de
            opción múltiple
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {currentExam.questions.map((question, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">
                  {index + 1}. {question.question}
                </h3>
                {question.type === "multiple_choice" &&
                Array.isArray(question.options) ? (
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded"
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={answers[index] === option}
                          onChange={(e) =>
                            handleAnswerChange(index, e.target.value)
                          }
                          className="text-primary"
                        />
                        <span className="text-sm">
                          {String.fromCharCode(65 + optionIndex)}) {option}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Esta pregunta requiere interacción manual.
                  </p>
                )}
              </div>
            ))}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleNewExam}
                disabled={isSubmitting}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button onClick={handleSubmitExam} disabled={isSubmitting}>
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "Enviando..." : "Enviar Examen"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show exam results
  if (examResult) {
    const { result } = examResult;
    const isPassed = result.percentage >= 70;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileQuestion className="mr-2 h-5 w-5 text-primary" />
            Resultados del Examen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold">
              <span className={isPassed ? "text-green-600" : "text-red-600"}>
                {result.percentage}%
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-lg">
                {result.correctAnswers} de {result.totalQuestions} respuestas
                correctas
              </p>
              <p
                className={`text-sm ${isPassed ? "text-green-600" : "text-red-600"}`}
              >
                {isPassed
                  ? "¡Excelente trabajo!"
                  : "Sigue practicando para mejorar"}
              </p>
            </div>

            <div className="flex justify-center space-x-4 pt-4">
              <Button variant="outline" onClick={handleNewExam}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Examen
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show exam history/results
  if (examHistory && examHistory.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileQuestion className="mr-2 h-5 w-5 text-primary" />
            Exámenes de Práctica
          </CardTitle>
          <CardDescription>Historial de exámenes y resultados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Exam History */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Historial de Exámenes:</h4>
              {examHistory.map((examResult, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div>
                    <p className="text-sm font-medium">
                      Examen del{" "}
                      {new Date(
                        examResult.result.completedAt
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {examResult.result.correctAnswers}/
                      {examResult.result.totalQuestions} correctas
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-medium ${
                        examResult.result.percentage >= 70
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {examResult.result.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Generate New Exam Button */}
            <Button
              onClick={handleGenerateExam}
              disabled={isSubmitting}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              {isSubmitting ? "Generando..." : "Generar Nuevo Examen"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show initial interface (no exams yet)
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
              ¡Genera tu primer examen!
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Crea un examen personalizado de 10 preguntas basado en los
              materiales del tema con corrección automática.
            </p>
          </div>
          <Button
            onClick={handleGenerateExam}
            disabled={isSubmitting}
            className="mt-4"
          >
            <Plus className="mr-2 h-4 w-4" />
            {isSubmitting ? "Generando..." : "Generar Primer Examen"}
          </Button>
        </div>

        {/* Features list */}
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Características:
          </h4>
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
