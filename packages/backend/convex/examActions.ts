import {
  action,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server.js";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel.js";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { rag } from "./rag.js";
import { generateText } from "ai";
import { internal } from "./_generated/api.js";
import type { ActionCtx } from "./_generated/server.js";
import type { RegisteredAction } from "convex/server";

type ExamQuestion = {
  type: "multiple_choice" | "true_false" | "short_answer" | "essay";
  question: string;
  options?: string[];
  correctAnswer: string | boolean | Record<string, unknown>;
  points: number;
};

type ExamAnswer = {
  questionIndex: number;
  answer: string | boolean | string[];
};

const examQuestionValidator = v.object({
  type: v.union(
    v.literal("multiple_choice"),
    v.literal("true_false"),
    v.literal("short_answer"),
    v.literal("essay")
  ),
  question: v.string(),
  options: v.optional(v.array(v.string())),
  correctAnswer: v.union(v.string(), v.boolean(), v.object({})),
  points: v.number(),
});

const examQuestionsValidator = v.array(examQuestionValidator);

const examAnswerValidator = v.object({
  questionIndex: v.number(),
  answer: v.union(v.string(), v.boolean(), v.array(v.string())),
});

/**
 * Action to generate an exam with 10 multiple choice questions based on RAG content
 */
type GenerateExamArgs = {
  topicId: Id<"topics">;
  subjectId: Id<"subjects">;
  userId: Id<"users">;
} & Record<string, unknown>;

type GenerateExamResult = {
  examId: Id<"exams">;
  questions: ExamQuestion[];
  hasContext: boolean;
  entriesFound: number;
};

export const generateExam: RegisteredAction<
  "public",
  GenerateExamArgs,
  Promise<GenerateExamResult>
> = action({
  args: {
    topicId: v.id("topics"),
    subjectId: v.id("subjects"),
    userId: v.id("users"),
  },
  handler: async (
    ctx: ActionCtx,
    args: GenerateExamArgs
  ): Promise<GenerateExamResult> => {
    // Search RAG for relevant content in the topic namespace
    // Use a more general query and lower threshold to ensure we find content
    const searchResult = await rag.search(ctx, {
      namespace: args.topicId as string,
      query: "educational content topic material",
      limit: 20, // Increase limit to get more content
      vectorScoreThreshold: 0.1, // Lower threshold to be more permissive
      filters: [
        {
          name: "topicId",
          value: args.topicId,
        },
      ],
    });

    const { text: context, entries } = searchResult;

    console.log(
      `[Exam Generation] Topic: ${args.topicId}, Found ${entries?.length || 0} entries, Has context: ${!!context}`
    );

    // If no context found, throw an error
    if (!context) {
      throw new Error(
        "No hay contenido disponible en los materiales del tema para generar preguntas"
      );
    }

    // Generate 10 multiple choice questions using OpenRouter
    const systemMessage = `Eres un generador de exámenes educativos. Basándote en el siguiente contenido de los materiales del tema, genera exactamente 10 preguntas de opción múltiple (multiple choice) en español.

Cada pregunta debe:
- Ser clara y educativa
- Tener 4 opciones de respuesta (A, B, C, D)
- Tener una respuesta correcta claramente identificable
- Cubrir diferentes aspectos del contenido
- Ser de dificultad apropiada para estudiantes

Formato de respuesta (JSON array):
[
  {
    "type": "multiple_choice",
    "question": "Texto de la pregunta aquí",
    "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "correctAnswer": "Opción A", // La respuesta correcta
    "points": 1
  }
]

Contenido del tema:
${context}

Responde SOLO con el JSON array, sin texto adicional.`;

    const model = openrouter("openai/gpt-oss-20b");
    const { text } = await generateText({
      model,
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content:
            "Genera 10 preguntas de opción múltiple basadas en el contenido proporcionado.",
        },
      ],
    });

    // Parse the generated questions
    const cleanedText = (() => {
      if (!text) {
        return text;
      }

      const trimmed = text.trim();
      if (trimmed.startsWith("```")) {
        const match = trimmed.match(/```[a-zA-Z]*\n([\s\S]*?)```/);
        if (match && match[1]) {
          return match[1].trim();
        }
      }

      return trimmed;
    })();

    let questions: ExamQuestion[];
    try {
      questions = JSON.parse(cleanedText) as ExamQuestion[];
    } catch (error) {
      console.error("Error parsing generated questions:", text);
      throw new Error("Error al procesar las preguntas generadas");
    }

    // Validate questions format
    if (!Array.isArray(questions) || questions.length !== 10) {
      throw new Error("El formato de preguntas generado no es válido");
    }

    // Save exam to database
    const examId = await ctx.runMutation(
      internal.examActions.createExamDocument,
      {
        topicId: args.topicId,
        subjectId: args.subjectId,
        userId: args.userId,
        questions,
      }
    );

    return {
      examId,
      questions,
      hasContext: !!context,
      entriesFound: entries?.length || 0,
    };
  },
});

/**
 * Action to submit exam answers and calculate score
 */
type SubmitExamAnswersArgs = {
  examId: Id<"exams">;
  answers: ExamAnswer[];
} & Record<string, unknown>;

type SubmitExamAnswersResult = {
  resultId: Id<"examResults">;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
};

export const submitExamAnswers: RegisteredAction<
  "public",
  SubmitExamAnswersArgs,
  Promise<SubmitExamAnswersResult>
> = action({
  args: {
    examId: v.id("exams"),
    answers: v.array(examAnswerValidator),
  },
  handler: async (
    ctx: ActionCtx,
    args: SubmitExamAnswersArgs
  ): Promise<SubmitExamAnswersResult> => {
    const exam = (await ctx.runQuery(internal.examActions.getExamById, {
      examId: args.examId,
    })) as Doc<"exams"> | null;

    if (!exam) {
      throw new Error("Examen no encontrado");
    }

    if (exam.status === "completed") {
      throw new Error("Este examen ya ha sido completado");
    }

    // Calculate score
    let correctAnswers = 0;
    const questions = exam.questions as ExamQuestion[];
    const totalQuestions = questions.length;

    for (const userAnswer of args.answers) {
      const question = questions[userAnswer.questionIndex];
      if (question && question.correctAnswer === userAnswer.answer) {
        correctAnswers++;
      }
    }

    const score =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    const resultId = await ctx.runMutation(
      internal.examActions.recordExamResult,
      {
        examId: args.examId,
        topicId: exam.topicId,
        userId: exam.userId,
        answers: args.answers,
        score,
        totalQuestions,
      }
    );

    return {
      resultId,
      score,
      correctAnswers,
      totalQuestions,
      percentage: Math.round(score),
    };
  },
});

export const createExamDocument = internalMutation({
  args: {
    topicId: v.id("topics"),
    subjectId: v.id("subjects"),
    userId: v.id("users"),
    questions: examQuestionsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("exams", {
      topicId: args.topicId,
      subjectId: args.subjectId,
      userId: args.userId,
      questions: args.questions,
      createdAt: Date.now(),
      status: "pending",
    });
  },
});

export const getExamById = internalQuery({
  args: {
    examId: v.id("exams"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.examId);
  },
});

export const recordExamResult = internalMutation({
  args: {
    examId: v.id("exams"),
    topicId: v.id("topics"),
    userId: v.id("users"),
    answers: v.array(examAnswerValidator),
    score: v.number(),
    totalQuestions: v.number(),
  },
  handler: async (ctx, args) => {
    const resultId = await ctx.db.insert("examResults", {
      examId: args.examId,
      topicId: args.topicId,
      userId: args.userId,
      answers: args.answers,
      score: args.score,
      totalQuestions: args.totalQuestions,
      completedAt: Date.now(),
    });

    await ctx.db.patch(args.examId, {
      status: "completed",
    });

    return resultId;
  },
});

/**
 * Action to get exam results for a user and topic
 */
export const getExamsByTopicAndUser = internalQuery({
  args: {
    topicId: v.id("topics"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exams")
      .withIndex("by_topic", (q) => q.eq("topicId", args.topicId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
  },
});

export const getExamResultsByExamId = internalQuery({
  args: {
    examId: v.id("exams"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("examResults")
      .withIndex("by_exam", (q) => q.eq("examId", args.examId))
      .collect();
  },
});

type ExamResultEntry = {
  exam: Doc<"exams">;
  result: Doc<"examResults">;
};

type NormalizableAnswer =
  | string
  | boolean
  | string[]
  | Record<string, unknown>
  | null
  | undefined;

type ExamReviewQuestion = {
  questionIndex: number;
  question: string;
  options: string[];
  correctAnswer: ExamQuestion["correctAnswer"];
  studentAnswer: string | boolean | string[] | null;
  isCorrect: boolean;
};

type StudentExamHistoryEntry = {
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
  questions: ExamReviewQuestion[];
  student?: {
    _id: Id<"users">;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
};

const normalizeAnswer = (value: NormalizableAnswer): string => {
  if (typeof value === "string") {
    return value.trim().toLowerCase();
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "string" ? item.trim().toLowerCase() : String(item)
      )
      .sort()
      .join("|");
  }

  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }

  return "";
};

type GetExamResultsArgs = {
  topicId: Id<"topics">;
  userId: Id<"users">;
} & Record<string, unknown>;

export const getExamResults: RegisteredAction<
  "public",
  GetExamResultsArgs,
  Promise<ExamResultEntry[]>
> = action({
  args: {
    topicId: v.id("topics"),
    userId: v.id("users"),
  },
  handler: async (
    ctx: ActionCtx,
    args: GetExamResultsArgs
  ): Promise<ExamResultEntry[]> => {
    // Get all completed exams for this user and topic
    const exams: Doc<"exams">[] = await ctx.runQuery(
      internal.examActions.getExamsByTopicAndUser,
      {
        topicId: args.topicId,
        userId: args.userId,
      }
    );

    // Get results for these exams
    const results: ExamResultEntry[] = [];
    for (const exam of exams) {
      const examResults = (await ctx.runQuery(
        internal.examActions.getExamResultsByExamId,
        {
          examId: exam._id,
        }
      )) as Doc<"examResults">[];

      const firstResult = examResults[0];
      if (!firstResult) {
        continue;
      }

      results.push({
        exam,
        result: firstResult, // Assuming one result per exam
      });
    }

    return results;
  },
});

export const getStudentExamHistory = query({
  args: {
    userId: v.id("users"),
    subjectId: v.optional(v.id("subjects")),
    topicId: v.optional(v.id("topics")),
  },
  handler: async (ctx, args): Promise<StudentExamHistoryEntry[]> => {
    const examResults = await ctx.db
      .query("examResults")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    const subjectCache = new Map<Id<"subjects">, Doc<"subjects"> | null>();
    const topicCache = new Map<Id<"topics">, Doc<"topics"> | null>();

    const entries: StudentExamHistoryEntry[] = [];

    for (const result of examResults) {
      const exam = await ctx.db.get(result.examId);
      if (!exam) {
        continue;
      }

      if (args.subjectId && exam.subjectId !== args.subjectId) {
        continue;
      }

      if (args.topicId && exam.topicId !== args.topicId) {
        continue;
      }

      let subject = subjectCache.get(exam.subjectId);
      if (subject === undefined) {
        subject = (await ctx.db.get(exam.subjectId)) as Doc<"subjects"> | null;
        subjectCache.set(exam.subjectId, subject ?? null);
      }

      let topic = topicCache.get(exam.topicId);
      if (topic === undefined) {
        topic = (await ctx.db.get(exam.topicId)) as Doc<"topics"> | null;
        topicCache.set(exam.topicId, topic ?? null);
      }

      const questions = Array.isArray(exam.questions)
        ? (exam.questions as ExamQuestion[])
        : [];

      const answers = Array.isArray(result.answers)
        ? (result.answers as ExamAnswer[])
        : [];

      const reviewQuestions = questions.map((question, index) => {
        const studentAnswer = answers.find(
          (answer) => answer.questionIndex === index
        );

        const studentValue = studentAnswer?.answer ?? null;
        const isCorrect = studentAnswer
          ? normalizeAnswer(studentAnswer.answer) ===
            normalizeAnswer(question.correctAnswer as NormalizableAnswer)
          : false;

        return {
          questionIndex: index,
          question: question.question,
          options: Array.isArray(question.options) ? question.options : [],
          correctAnswer: question.correctAnswer,
          studentAnswer: studentValue,
          isCorrect,
        } satisfies ExamReviewQuestion;
      });

      const score = Number(result.score ?? 0);
      const totalQuestions = Number(result.totalQuestions ?? 0);
      const percentage = Math.round(score);
      const correctAnswers = Math.round((score / 100) * totalQuestions);

      entries.push({
        exam: {
          _id: exam._id,
          createdAt: exam.createdAt,
          subjectId: exam.subjectId,
          topicId: exam.topicId,
        },
        subject: subject
          ? {
              _id: subject._id,
              name: subject.name,
            }
          : null,
        topic: topic
          ? {
              _id: topic._id,
              name: topic.name,
            }
          : null,
        result: {
          _id: result._id,
          score,
          totalQuestions,
          percentage,
          correctAnswers,
          completedAt: result.completedAt,
        },
        questions: reviewQuestions,
      });
    }

    return entries.sort((a, b) => b.result.completedAt - a.result.completedAt);
  },
});

/**
 * Query to get all exam results for a topic (for teachers)
 */
export const getExamResultsByTopic = query({
  args: {
    topicId: v.id("topics"),
  },
  handler: async (ctx, args): Promise<StudentExamHistoryEntry[]> => {
    // Get all exam results for this topic
    const examResults = await ctx.db
      .query("examResults")
      .withIndex("by_topic", (q) => q.eq("topicId", args.topicId))
      .order("desc")
      .collect();

    const subjectCache = new Map<Id<"subjects">, Doc<"subjects"> | null>();
    const topicCache = new Map<Id<"topics">, Doc<"topics"> | null>();
    const userCache = new Map<Id<"users">, Doc<"users"> | null>();

    const entries: StudentExamHistoryEntry[] = [];

    for (const result of examResults) {
      const exam = await ctx.db.get(result.examId);
      if (!exam) {
        continue;
      }

      let subject = subjectCache.get(exam.subjectId);
      if (subject === undefined) {
        subject = (await ctx.db.get(exam.subjectId)) as Doc<"subjects"> | null;
        subjectCache.set(exam.subjectId, subject ?? null);
      }

      let topic = topicCache.get(exam.topicId);
      if (topic === undefined) {
        topic = (await ctx.db.get(exam.topicId)) as Doc<"topics"> | null;
        topicCache.set(exam.topicId, topic ?? null);
      }

      let user = userCache.get(result.userId);
      if (user === undefined) {
        user = (await ctx.db.get(result.userId)) as Doc<"users"> | null;
        userCache.set(result.userId, user ?? null);
      }

      const questions = Array.isArray(exam.questions)
        ? (exam.questions as ExamQuestion[])
        : [];

      const answers = Array.isArray(result.answers)
        ? (result.answers as ExamAnswer[])
        : [];

      const reviewQuestions = questions.map((question, index) => {
        const studentAnswer = answers.find(
          (answer) => answer.questionIndex === index
        );

        const studentValue = studentAnswer?.answer ?? null;
        const isCorrect = studentAnswer
          ? normalizeAnswer(studentAnswer.answer) ===
            normalizeAnswer(question.correctAnswer as NormalizableAnswer)
          : false;

        return {
          questionIndex: index,
          question: question.question,
          options: Array.isArray(question.options) ? question.options : [],
          correctAnswer: question.correctAnswer,
          studentAnswer: studentValue,
          isCorrect,
        } satisfies ExamReviewQuestion;
      });

      const score = Number(result.score ?? 0);
      const totalQuestions = Number(result.totalQuestions ?? 0);
      const percentage = Math.round(score);
      const correctAnswers = Math.round((score / 100) * totalQuestions);

      entries.push({
        exam: {
          _id: exam._id,
          createdAt: exam.createdAt,
          subjectId: exam.subjectId,
          topicId: exam.topicId,
        },
        subject: subject
          ? {
              _id: subject._id,
              name: subject.name,
            }
          : null,
        topic: topic
          ? {
              _id: topic._id,
              name: topic.name,
            }
          : null,
        result: {
          _id: result._id,
          score,
          totalQuestions,
          percentage,
          correctAnswers,
          completedAt: result.completedAt,
        },
        questions: reviewQuestions,
        // Add student info for teacher view
        student: user
          ? {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            }
          : null,
      });
    }

    return entries.sort((a, b) => b.result.completedAt - a.result.completedAt);
  },
});
