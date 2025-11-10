"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Id, Doc } from "./_generated/dataModel";
import { internal, components } from "./_generated/api";
import { rag } from "./rag";
import pdfParse from "pdf-parse-new";
import mammoth from "mammoth";

/**
 * Extract text from a file based on its MIME type
 */
async function extractTextFromFile(
  storageId: Id<"_storage">,
  fileType: string,
  ctx: any
): Promise<string> {
  // Get file from storage
  const fileBlob = await ctx.storage.get(storageId);
  if (!fileBlob) {
    throw new Error("File not found in storage");
  }

  const arrayBuffer = await fileBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Extract text based on file type
  if (fileType === "text/plain" || fileType === "text/txt") {
    return buffer.toString("utf-8");
  } else if (fileType === "application/pdf") {
    const result = await pdfParse(buffer, {
      verbosityLevel: 0,
    });
    return result.text;
  } else if (
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileType === "application/msword"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }
}

/**
 * Index a single file into RAG
 */
export const indexFile = internalAction({
  args: {
    fileId: v.id("topicFiles"),
    topicId: v.id("topics"),
    fileName: v.string(),
    fileType: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    try {
      // Extract text from file
      const text = await extractTextFromFile(
        args.storageId,
        args.fileType,
        ctx
      );

      if (!text || text.trim().length === 0) {
        console.warn(`No text extracted from file ${args.fileName}`);
        return { success: false, reason: "No text content" };
      }

      // Add to RAG with topicId as namespace
      await rag.add(ctx, {
        namespace: args.topicId as string, // Convert Id to string for namespace
        key: args.fileId as string, // Use fileId as key for uniqueness
        text: text,
        // Add metadata for filtering if needed
        filterValues: [
          {
            name: "topicId",
            value: args.topicId,
          },
          {
            name: "fileId",
            value: args.fileId,
          },
        ],
      });

      // Mark file as indexed in database
      await ctx.runMutation(internal.files.markAsIndexed, {
        fileId: args.fileId,
      });

      return { success: true };
    } catch (error) {
      console.error(`Error indexing file ${args.fileName}:`, error);
      return {
        success: false,
        reason: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

/**
 * Remove embeddings for a file from RAG
 */
export const removeFileEmbeddings = internalAction({
  args: {
    fileId: v.id("topicFiles"),
    topicId: v.id("topics"),
  },
  handler: async (ctx, args) => {
    try {
      // First, get the namespaceId from the namespace string
      // The RAG component stores namespaces with the topicId as the namespace string
      const namespace = await ctx.runQuery(components.rag.namespaces.get, {
        namespace: args.topicId as string,
        dimension: 4096, // qwen3-embedding-8b has 4096 dimensions
        filterNames: ["topicId", "fileId"],
        modelId: "qwen/qwen3-embedding-8b",
      });

      if (!namespace) {
        // Namespace doesn't exist, nothing to delete
        console.warn(
          `Namespace not found for topic ${args.topicId}, skipping deletion`
        );
        return { success: true };
      }

      // Delete embeddings from RAG using the fileId as key and the namespaceId
      await ctx.runAction(components.rag.entries.deleteByKeySync, {
        namespaceId: namespace.namespaceId,
        key: args.fileId as string,
      });
      return { success: true };
    } catch (error) {
      console.error(
        `Error removing embeddings for file ${args.fileId}:`,
        error
      );
      return {
        success: false,
        reason: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

/**
 * Index all files for a topic
 */
export const indexTopicFiles = internalAction({
  args: {
    topicId: v.id("topics"),
  },
  handler: async (
    ctx,
    args
  ): Promise<
    Array<{ fileId: Id<"topicFiles">; success: boolean; reason?: string }>
  > => {
    // Get all files for this topic using internal query
    const files: Doc<"topicFiles">[] = await ctx.runQuery(
      internal.fileQueries.getFilesByTopic,
      {
        topicId: args.topicId,
      }
    );

    const results: Array<{
      fileId: Id<"topicFiles">;
      success: boolean;
      reason?: string;
    }> = [];
    for (const file of files) {
      const result: { success: boolean; reason?: string } = await ctx.runAction(
        internal.fileIndexing.indexFile,
        {
          fileId: file._id,
          topicId: args.topicId,
          fileName: file.fileName,
          fileType: file.fileType,
          storageId: file.storageId,
        }
      );
      results.push({ fileId: file._id, ...result });
    }

    return results;
  },
});
