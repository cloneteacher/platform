import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query para obtener todas las asignaturas de un profesor
export const getByTeacher = query({
  args: { teacherId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subjects")
      .withIndex("by_teacher", (q) => q.eq("teacherId", args.teacherId))
      .order("desc")
      .collect();
  },
});

// Query para obtener todas las asignaturas
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("subjects").order("desc").collect();
  },
});

// Query para obtener una asignatura por ID
export const getById = query({
  args: { subjectId: v.id("subjects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.subjectId);
  },
});

// Mutation para crear una asignatura
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    teacherId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("subjects", {
      name: args.name,
      description: args.description,
      teacherId: args.teacherId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mutation para actualizar una asignatura
export const update = mutation({
  args: {
    subjectId: v.id("subjects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { subjectId, ...updates } = args;
    const now = Date.now();
    
    await ctx.db.patch(subjectId, {
      ...updates,
      updatedAt: now,
    });
  },
});

// Mutation para eliminar una asignatura
export const remove = mutation({
  args: { subjectId: v.id("subjects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.subjectId);
  },
});

