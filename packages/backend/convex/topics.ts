import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query para obtener todos los temas de una asignatura
export const getBySubject = query({
  args: { subjectId: v.id("subjects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("topics")
      .withIndex("by_subject", (q) => q.eq("subjectId", args.subjectId))
      .order("desc")
      .collect();
  },
});

// Query para obtener todos los temas de un profesor
export const getByTeacher = query({
  args: { teacherId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("topics")
      .withIndex("by_teacher", (q) => q.eq("teacherId", args.teacherId))
      .order("desc")
      .collect();
  },
});

// Query para obtener un tema por ID
export const getById = query({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.topicId);
  },
});

// Mutation para crear un tema
export const create = mutation({
  args: {
    subjectId: v.id("subjects"),
    name: v.string(),
    description: v.optional(v.string()),
    teacherId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("topics", {
      subjectId: args.subjectId,
      name: args.name,
      description: args.description,
      teacherId: args.teacherId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mutation para actualizar un tema
export const update = mutation({
  args: {
    topicId: v.id("topics"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { topicId, ...updates } = args;
    const now = Date.now();
    
    await ctx.db.patch(topicId, {
      ...updates,
      updatedAt: now,
    });
  },
});

// Mutation para eliminar un tema
export const remove = mutation({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.topicId);
  },
});

