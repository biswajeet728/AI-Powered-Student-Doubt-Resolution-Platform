import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
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
  const [streamingUserMessage, setStreamingUserMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const messages: ChatMessage[] = [
    ...(history || []),
    ...(streamingUserMessage
      ? [
          {
            id: "streaming-user",
            role: "USER" as const,
            content: streamingUserMessage,
            createdAt: new Date().toISOString(),
          },
        ]
      : []),
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

      setError(null);
      setStreamingUserMessage(message.trim());
      setIsStreaming(true);
      setStreamingContent("");

      try {
        const response = await sendChatMessage({
          doubtId,
          message: message.trim(),
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
        setStreamingUserMessage("");
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to send message";
        setError(msg);
        console.error("Chat streaming error:", err);
        setStreamingUserMessage("");
        setStreamingContent("");
      } finally {
        setIsStreaming(false);
      }
    },
    [doubtId, isStreaming, queryClient],
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
