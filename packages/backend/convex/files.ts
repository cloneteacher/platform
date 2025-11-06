import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query para obtener todos los archivos de un tema
export const getByTopic = query({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    const files = await ctx.db
      .query("topicFiles")
      .withIndex("by_topic", (q) => q.eq("topicId", args.topicId))
      .order("desc")
      .collect();

    // Obtener URLs de los archivos
    const filesWithUrls = await Promise.all(
      files.map(async (file) => {
        const url = await ctx.storage.getUrl(file.storageId);
        return {
          ...file,
          url,
        };
      })
    );

    return filesWithUrls;
  },
});

// Query para obtener todos los archivos de una asignatura
export const getBySubject = query({
  args: { subjectId: v.id("subjects") },
  handler: async (ctx, args) => {
    const files = await ctx.db
      .query("topicFiles")
      .withIndex("by_subject", (q) => q.eq("subjectId", args.subjectId))
      .order("desc")
      .collect();

    // Obtener URLs de los archivos
    const filesWithUrls = await Promise.all(
      files.map(async (file) => {
        const url = await ctx.storage.getUrl(file.storageId);
        return {
          ...file,
          url,
        };
      })
    );

    return filesWithUrls;
  },
});

// Query para obtener un archivo por ID
export const getById = query({
  args: { fileId: v.id("topicFiles") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file) return null;

    const url = await ctx.storage.getUrl(file.storageId);
    return {
      ...file,
      url,
    };
  },
});

// Mutation para generar URL de subida
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Mutation para crear registro de archivo después de subida
export const create = mutation({
  args: {
    topicId: v.id("topics"),
    subjectId: v.id("subjects"),
    teacherId: v.id("users"),
    fileName: v.string(),
    fileType: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("topicFiles", {
      topicId: args.topicId,
      subjectId: args.subjectId,
      teacherId: args.teacherId,
      fileName: args.fileName,
      fileType: args.fileType,
      storageId: args.storageId,
      uploadedAt: Date.now(),
    });
  },
});

// Mutation para eliminar un archivo
export const remove = mutation({
  args: { fileId: v.id("topicFiles") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new Error("Archivo no encontrado");
    }

    // Eliminar el archivo del storage
    await ctx.storage.delete(file.storageId);
    
    // Eliminar el registro de la base de datos
    await ctx.db.delete(args.fileId);
  },
});

