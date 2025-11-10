"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Id } from "@workspace/backend/_generated/dataModel";
import { useAction } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";
import "katex/dist/katex.min.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  topicId: Id<"topics">;
}

// Typed markdown components (sin cambios)
const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-2 space-y-1 ml-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-2 space-y-1 ml-2">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: ({ className, children, ...props }) => {
    const isInline = !className?.includes("language-");
    return isInline ? (
      <code
        className="bg-muted-foreground/20 px-1.5 py-0.5 rounded text-xs font-mono"
        {...props}
      >
        {children}
      </code>
    ) : (
      <code
        className="block bg-muted-foreground/20 p-2 rounded text-xs font-mono overflow-x-auto mb-2"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-muted-foreground/20 p-2 rounded text-xs font-mono overflow-x-auto mb-2">
      {children}
    </pre>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  h1: ({ children }) => (
    <h1 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-bold mb-2 mt-2 first:mt-0">{children}</h3>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-muted-foreground/30 pl-3 italic my-2 text-muted-foreground">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline hover:text-primary/80"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="my-3 border-muted-foreground/30" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-2">
      <table className="min-w-full border-collapse border border-muted-foreground/30 text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-muted-foreground/10">{children}</thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  th: ({ children }) => (
    <th className="border border-muted-foreground/30 px-3 py-2 font-semibold text-left">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-muted-foreground/30 px-3 py-2">{children}</td>
  ),
  tr: ({ children }) => <tr>{children}</tr>,
};

// Helper function to convert text-based tables (sin cambios)
function convertTextTableToMarkdown(content: string): string {
  const lines = content.split("\n");
  const processedLines: string[] = [];
  let inTable = false;
  let tableLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) {
      processedLines.push("");
      continue;
    }

    const pipeCount = (line.match(/\|/g) || []).length;
    const looksLikeTable = pipeCount >= 2 && line.trim().startsWith("|");

    if (looksLikeTable) {
      if (!inTable) {
        inTable = true;
        tableLines = [];
      }
      tableLines.push(line.trim());
    } else {
      if (inTable && tableLines.length > 0) {
        if (tableLines.length >= 2) {
          // --- FIX START ---
          // Accedemos a los elementos del array, no al array completo
          const firstLine = tableLines[0];
          const secondLine = tableLines[1];
          // --- FIX END ---

          if (firstLine && secondLine) {
            const columnCount = (firstLine.match(/\|/g) || []).length - 1;

            // --- FIX START ---
            // 'secondLine' ahora es un string, por lo que .test() es válido
            const isSeparator = /^[\|\s\-\=]+$/.test(secondLine);
            // --- FIX END ---

            if (!isSeparator && columnCount > 0) {
              const separator = "|" + " --- |".repeat(columnCount);
              tableLines.splice(1, 0, separator);
            }
          }
          processedLines.push(...tableLines);
        } else {
          processedLines.push(...tableLines);
        }
        tableLines = [];
        inTable = false;
      }
      processedLines.push(line);
    }
  }

  // Handle table at end of content
  if (inTable && tableLines.length > 0) {
    if (tableLines.length >= 2) {
      // --- FIX START ---
      const firstLine = tableLines[0];
      const secondLine = tableLines[1];
      // --- FIX END ---
      if (firstLine && secondLine) {
        const columnCount = (firstLine.match(/\|/g) || []).length - 1;
        // --- FIX START ---
        const isSeparator = /^[\|\s\-\=]+$/.test(secondLine);
        // --- FIX END ---
        if (!isSeparator && columnCount > 0) {
          const separator = "|" + " --- |".repeat(columnCount);
          tableLines.splice(1, 0, separator);
        }
      }
    }
    processedLines.push(...tableLines);
  }

  return processedLines.join("\n");
}

function preprocessMathContent(content: string): string {
  let processed = convertTextTableToMarkdown(content);

  const codeBlocks: string[] = [];
  const codeBlockRegex = /(```[\s\S]*?```|`[^`]*`)/g;
  processed = processed.replace(codeBlockRegex, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // Fix: Prevent numbered titles like "1. Las plantas" from being interpreted as ordered lists
  // We escape the dot after a number at the start of a line if it's followed by a capital letter
  // This pattern matches: number + dot + space + capital letter (likely a title, not a list)
  processed = processed.replace(/^(\d+)\.\s+([A-ZÁÉÍÓÚÑ])/gm, "$1\\. $2");

  processed = processed.replace(/\\\((.*?)\\\)/g, "$$1$");

  const latexCommands = [
    "frac",
    "sqrt",
    "cdot",
    "times",
    "in",
    "rightarrow",
    "leftrightarrow",
    "mathbb",
  ];

  latexCommands.forEach((cmd) => {
    const regex = new RegExp(
      `(?<!\\$)\\s*(\\\\${cmd}(\\{.*?\\})?(\\{.*?\\})?)\\s*(?!\\$)`,
      "g"
    );
    processed = processed.replace(regex, " $$1$ ");
  });

  // --- FIX START ---
  // Añadimos un fallback a un string vacío ('') para evitar el tipo 'undefined'
  processed = processed.replace(/__CODE_BLOCK_(\d+)__/g, (_, index) => {
    return codeBlocks[parseInt(index, 10)] || "";
  });
  // --- FIX END ---

  return processed;
}
// --- FIN DE LA SECCIÓN CORREGIDA ---

export function ChatInterface({ topicId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "¡Hola! Soy tu asistente de estudio. Puedo ayudarte con preguntas sobre este tema basándome en los materiales disponibles. ¿Qué te gustaría saber?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatAction = useAction(api.chat.chat);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      const result = await chatAction({
        topicId,
        message: currentInput,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling chat:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100lvh-320px)]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
            )}
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {message.role === "assistant" ? (
                <div className="text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeKatex]}
                    components={markdownComponents}
                  >
                    {preprocessMathContent(message.content)}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
            {message.role === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="w-5 h-5 text-foreground" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="bg-muted rounded-lg px-4 py-2">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
