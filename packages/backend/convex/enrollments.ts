import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query para obtener todas las inscripciones de una asignatura
export const getBySubject = query({
  args: { subjectId: v.id("subjects") },
  handler: async (ctx, args) => {
    const enrollments = await ctx.db
      .query("subjectEnrollments")
      .withIndex("by_subject", (q) => q.eq("subjectId", args.subjectId))
      .collect();

    // Obtener información de usuarios
    const enrollmentsWithUsers = await Promise.all(
      enrollments.map(async (enrollment) => {
        const user = await ctx.db.get(enrollment.userId);
        return {
          ...enrollment,
          user,
        };
      })
    );

    return enrollmentsWithUsers;
  },
});

// Query para obtener todas las asignaturas de un estudiante
export const getByStudent = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const enrollments = await ctx.db
      .query("subjectEnrollments")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Obtener información de asignaturas
    const enrollmentsWithSubjects = await Promise.all(
      enrollments.map(async (enrollment) => {
        const subject = await ctx.db.get(enrollment.subjectId);
        return {
          ...enrollment,
          subject,
        };
      })
    );

    return enrollmentsWithSubjects;
  },
});

// Query para verificar si un estudiante está inscrito en una asignatura
export const isEnrolled = query({
  args: {
    subjectId: v.id("subjects"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const enrollment = await ctx.db
      .query("subjectEnrollments")
      .withIndex("by_subject_and_user", (q) =>
        q.eq("subjectId", args.subjectId).eq("userId", args.userId)
      )
      .first();

    return enrollment !== null;
  },
});

// Mutation para inscribir un estudiante en una asignatura
export const enroll = mutation({
  args: {
    subjectId: v.id("subjects"),
    userId: v.id("users"),
    enrolledBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Verificar si ya está inscrito
    const existing = await ctx.db
      .query("subjectEnrollments")
      .withIndex("by_subject_and_user", (q) =>
        q.eq("subjectId", args.subjectId).eq("userId", args.userId)
      )
      .first();

    if (existing) {
      throw new Error("El estudiante ya está inscrito en esta asignatura");
    }

    return await ctx.db.insert("subjectEnrollments", {
      subjectId: args.subjectId,
      userId: args.userId,
      enrolledBy: args.enrolledBy,
      enrolledAt: Date.now(),
    });
  },
});

// Mutation para desinscribir un estudiante de una asignatura
export const unenroll = mutation({
  args: {
    enrollmentId: v.id("subjectEnrollments"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.enrollmentId);
  },
});

// Mutation para inscribir múltiples estudiantes en una asignatura
export const enrollMultiple = mutation({
  args: {
    subjectId: v.id("subjects"),
    userIds: v.array(v.id("users")),
    enrolledBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const results = [];
    const now = Date.now();

    for (const userId of args.userIds) {
      // Verificar si ya está inscrito
      const existing = await ctx.db
        .query("subjectEnrollments")
        .withIndex("by_subject_and_user", (q) =>
          q.eq("subjectId", args.subjectId).eq("userId", userId)
        )
        .first();

      if (!existing) {
        const id = await ctx.db.insert("subjectEnrollments", {
          subjectId: args.subjectId,
          userId: userId,
          enrolledBy: args.enrolledBy,
          enrolledAt: now,
        });
        results.push({ userId, enrolled: true, id });
      } else {
        results.push({ userId, enrolled: false, reason: "already_enrolled" });
      }
    }

    return results;
  },
});

