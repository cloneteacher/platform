import { RAG } from "@convex-dev/rag";
import { components } from "./_generated/api";
import { Id } from "./_generated/dataModel";

type FilterTypes = {
  topicId: Id<"topics">;
  fileId: Id<"topicFiles">;
};

// Inline types matching AI SDK v5's EmbeddingModelV2<string> exactly.
type JSONValue =
  | null
  | string
  | number
  | boolean
  | { [key: string]: JSONValue }
  | JSONValue[];
type SharedV2ProviderOptions = Record<string, Record<string, JSONValue>>;
type SharedV2ProviderMetadata = Record<string, Record<string, JSONValue>>;
type SharedV2Headers = Record<string, string>;

type EmbeddingModelV2Embedding = number[];

type EmbeddingModelV2 = {
  readonly specificationVersion: "v2";
  readonly provider: string;
  readonly modelId: string;
  readonly maxEmbeddingsPerCall: number | undefined;
  readonly supportsParallelCalls: boolean;
  doEmbed: (options: {
    values: string[];
    abortSignal?: AbortSignal;
    providerOptions?: SharedV2ProviderOptions;
    headers?: Record<string, string | undefined>;
  }) => Promise<{
    embeddings: EmbeddingModelV2Embedding[];
    usage?: { tokens: number };
    providerMetadata?: SharedV2ProviderMetadata;
    response?: { headers?: SharedV2Headers; body?: unknown };
  }>;
};

// Raw OpenRouter doEmbed (pure fetch, full V2 spec).
const openRouterDoEmbed: EmbeddingModelV2["doEmbed"] = async ({
  values: texts,
  headers: extraHeaders,
}) => {
  if (texts.length === 0) {
    return { embeddings: [], usage: { tokens: 0 } };
  }

  const response = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "",
      "X-Title": "",
      ...Object.fromEntries(
        Object.entries(extraHeaders || {}).filter(([, v]) => v !== undefined)
      ),
    },
    body: JSON.stringify({
      model: "qwen/qwen3-embedding-8b",
      input: texts.map((t) => t.trim() || "<empty>"),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(
      `OpenRouter embeddings failed: ${response.status} - ${error}`
    );
  }

  const body = await response.json();
  const embeddings = body.data.map((item: any) => item.embedding as number[]);
  const tokens = body.usage?.total_tokens || 0;

  return {
    embeddings,
    usage: { tokens },
    // Mock minimal providerMetadata/response if needed; RAG ignores.
  };
};

// Embedder as exact EmbeddingModelV2<string>.
const embedder: EmbeddingModelV2 = {
  specificationVersion: "v2",
  provider: "openrouter",
  modelId: "qwen/qwen3-embedding-8b",
  maxEmbeddingsPerCall: 2048,
  supportsParallelCalls: true,
  doEmbed: openRouterDoEmbed,
};

// Init RAG.
export const rag = new RAG<FilterTypes>(components.rag, {
  textEmbeddingModel: embedder,
  embeddingDimension: 4096, // qwen3-embedding-8b has 4096 dimensions
  filterNames: ["topicId", "fileId"],
});
