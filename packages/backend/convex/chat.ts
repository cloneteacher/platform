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

    // If no context found, let the agent know
    const systemMessage = context
      ? `Eres un asistente educativo que ayuda a estudiantes con preguntas sobre el tema. Usa el siguiente contexto de los materiales del tema para responder la pregunta del estudiante. Si la información no está en el contexto, di que no tienes esa información específica en los materiales disponibles.

Contexto de los materiales:
${context}

Responde de manera clara, educativa y útil.`
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
