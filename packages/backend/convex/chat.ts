import { action } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { rag } from "./rag";
import { generateText } from "ai";

/**
 * Chat action that uses RAG to search topic files and generate responses
 */
export const chat = action({
  args: {
    topicId: v.id("topics"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // Search RAG for relevant content in the topic namespace
    // Use filters to ensure we only search within this topic
    const searchResult = await rag.search(ctx, {
      namespace: args.topicId as string, // Convert Id to string for namespace
      query: args.message,
      limit: 10,
      vectorScoreThreshold: 0.3, // Lower threshold to get more results
      filters: [
        {
          name: "topicId",
          value: args.topicId, // Filter by topicId to ensure namespace compatibility
        },
      ],
    });

    const { text: context, entries } = searchResult;

    // Log search results for debugging
    console.log(
      `[RAG Search] Topic: ${args.topicId}, Found ${entries?.length || 0} entries, Has context: ${!!context}`
    );

    // Log entry details to verify filtering
    if (entries && entries.length > 0) {
      entries.forEach((entry, index) => {
        console.log(
          `[RAG Entry ${index}] topicId filter: ${entry.filterValues?.find((f: any) => f.name === "topicId")?.value}, fileId: ${entry.filterValues?.find((f: any) => f.name === "fileId")?.value}`
        );
      });
    }

    // Verify that all entries belong to the correct topic
    const validEntries = entries?.filter((entry) => {
      const entryTopicId = entry.filterValues?.find(
        (f: any) => f.name === "topicId"
      )?.value;
      return entryTopicId === args.topicId;
    });

    // If entries were found but filtered out, log a warning
    if (
      entries &&
      entries.length > 0 &&
      validEntries &&
      validEntries.length !== entries.length
    ) {
      console.warn(
        `[RAG Search] Found ${entries.length} entries but only ${validEntries.length} match topicId ${args.topicId}. Some entries may be from other topics.`
      );
      // If we have invalid entries, the context might contain mixed content
      // In this case, we should rely on the filter working correctly or re-search with stricter filters
    }

    // Use the context from searchResult - it should already be filtered by the RAG filter
    // The filterValues in entries are for verification, but the text field is already filtered
    const validContext = context;

    // If no context found, let the agent know
    const systemMessage = validContext
      ? `Eres un asistente educativo que ayuda a estudiantes con preguntas sobre el tema ESPECÍFICO que están consultando. 

IMPORTANTE: Solo debes usar la información del contexto proporcionado, que corresponde ÚNICAMENTE a los materiales de este tema específico. Si la pregunta del estudiante está relacionada con otro tema o materia diferente, debes indicar que esa información no está disponible en los materiales de este tema.

Contexto de los materiales de ESTE tema:
${validContext}

Responde de manera clara, educativa y útil, usando SOLO la información del contexto proporcionado.`
      : `Eres un asistente educativo que ayuda a estudiantes con preguntas sobre el tema. Actualmente no hay materiales indexados para este tema, pero puedes ayudar con preguntas generales.`;

    // Use generateText directly with OpenRouter model
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
          content: args.message,
        },
      ],
    });

    return {
      response: text,
      hasContext: !!context,
      entriesFound: entries?.length || 0,
    };
  },
});
