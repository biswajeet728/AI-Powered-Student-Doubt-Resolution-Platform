import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useCallback,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";
import { getChatHistory, sendChatMessage } from "../actions/chat";

interface ChatMessage {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
}

export function useGetChatHistory(doubtId: string) {
  return useQuery({
    queryKey: ["chatHistory", doubtId],
    queryFn: async () => {
      const result = await getChatHistory({ doubtId });
      if (!result.success) throw new Error(result.error);
      return result.messages as ChatMessage[];
    },
    enabled: !!doubtId,
  });
}

export function useChat(doubtId: string) {
  const queryClient = useQueryClient();
  const { data: history, isLoading: isHistoryLoading } =
    useGetChatHistory(doubtId);

  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const abortRef = useRef<AbortController | null>(null);

  const [optimisticMessages, addOptimisticMessage] = useOptimistic<
    ChatMessage[],
    ChatMessage
  >(history || [], (current, newMessage) => [...current, newMessage]);

  const messages: ChatMessage[] = [
    ...optimisticMessages,
    ...(streamingContent
      ? [
          {
            id: "streaming-ai",
            role: "ASSISTANT" as const,
            content: streamingContent,
            createdAt: new Date().toISOString(),
          },
        ]
      : []),
  ];

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isStreaming) return;
      const trimmed = message.trim();

      setError(null);
      setIsStreaming(true);
      setStreamingContent("");

      startTransition(async () => {
        // Optimistic user bubble — visible for the whole transition.
        addOptimisticMessage({
          id: "optimistic-user",
          role: "USER",
          content: trimmed,
          createdAt: new Date().toISOString(),
        });

        try {
          const response = await sendChatMessage({
            doubtId,
            message: trimmed,
          });

          const reader = response.body!.getReader();
          const decoder = new TextDecoder();
          let fullContent = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            fullContent += chunk;
            setStreamingContent(fullContent);
          }

          await queryClient.invalidateQueries({
            queryKey: ["chatHistory", doubtId],
          });

          setStreamingContent("");
        } catch (err) {
          const msg =
            err instanceof Error ? err.message : "Failed to send message";
          setError(msg);
          console.error("Chat streaming error:", err);
          setStreamingContent("");
        } finally {
          setIsStreaming(false);
        }
      });
    },
    [doubtId, isStreaming, queryClient, addOptimisticMessage],
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return {
    messages,
    isHistoryLoading,
    isStreaming,
    error,
    sendMessage,
    stopStreaming,
  };
}
