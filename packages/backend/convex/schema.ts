import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    clerkId: v.string(), // ID de Clerk para la relación
    role: v.union(
      v.literal("admin"),
      v.literal("teacher"),
      v.literal("student")
    ),
  }).index("by_clerk_id", ["clerkId"]),

  subjects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    teacherId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_teacher", ["teacherId"]),

  topics: defineTable({
    subjectId: v.id("subjects"),
    name: v.string(),
    description: v.optional(v.string()),
    teacherId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_subject", ["subjectId"])
    .index("by_teacher", ["teacherId"]),

  topicFiles: defineTable({
    topicId: v.id("topics"),
    subjectId: v.id("subjects"),
    teacherId: v.id("users"),
    fileName: v.string(),
    fileType: v.string(), // e.g., "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    storageId: v.id("_storage"), // Referencia a Convex file storage
    uploadedAt: v.number(),
    indexedAt: v.optional(v.number()), // Timestamp cuando se indexó en RAG
  })
    .index("by_topic", ["topicId"])
    .index("by_subject", ["subjectId"])
    .index("by_teacher", ["teacherId"]),

  exams: defineTable({
    topicId: v.id("topics"),
    subjectId: v.id("subjects"),
    userId: v.id("users"),
    questions: v.array(
      v.object({
        type: v.union(
          v.literal("multiple_choice"),
          v.literal("true_false"),
          v.literal("short_answer"),
          v.literal("essay")
        ),
        question: v.string(),
        options: v.optional(v.array(v.string())), // Solo para multiple_choice
        correctAnswer: v.union(v.string(), v.boolean(), v.object({})), // Respuesta correcta o criterios de evaluación
        points: v.number(),
      })
    ),
    createdAt: v.number(),
    status: v.union(v.literal("pending"), v.literal("completed")),
  })
    .index("by_topic", ["topicId"])
    .index("by_user", ["userId"]),

  examResults: defineTable({
    examId: v.id("exams"),
    topicId: v.id("topics"),
    userId: v.id("users"),
    answers: v.array(
      v.object({
        questionIndex: v.number(),
        answer: v.union(v.string(), v.boolean(), v.array(v.string())), // Respuesta del estudiante
      })
    ),
    score: v.number(),
    totalQuestions: v.number(),
    completedAt: v.number(),
  })
    .index("by_exam", ["examId"])
    .index("by_topic", ["topicId"])
    .index("by_user", ["userId"]),

  subjectEnrollments: defineTable({
    subjectId: v.id("subjects"),
    userId: v.id("users"), // Estudiante
    enrolledAt: v.number(),
    enrolledBy: v.id("users"), // Profesor o admin que lo asignó
  })
    .index("by_subject", ["subjectId"])
    .index("by_user", ["userId"])
    .index("by_subject_and_user", ["subjectId", "userId"]),
});
