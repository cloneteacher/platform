import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

// Query para obtener todos los profesores
export const getAllTeachers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "teacher"))
      .collect();
  },
});

// Query para obtener todos los estudiantes
export const getAllStudents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "student"))
      .collect();
  },
});

// Query para obtener todos los admins
export const getAllAdmins = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "admin"))
      .collect();
  },
});

// Mutation interna para crear un profesor (llamado desde el backend después de crearlo en Clerk)
export const createTeacher = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
  },
  handler: async (ctx, args) => {
    // Verificar si el usuario ya existe
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      throw new Error("El usuario ya existe");
    }

    // Crear el profesor
    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      role: "teacher",
    });
  },
});

// Query para obtener estadísticas generales
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const [teachers, students, subjects, topics] = await Promise.all([
      ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("role"), "teacher"))
        .collect(),
      ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("role"), "student"))
        .collect(),
      ctx.db.query("subjects").collect(),
      ctx.db.query("topics").collect(),
    ]);

    return {
      totalTeachers: teachers.length,
      totalStudents: students.length,
      totalSubjects: subjects.length,
      totalTopics: topics.length,
    };
  },
});
