import { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUser } from "@/lib/providers/user-context";
import { useChat } from "@/lib/hooks/use-chat";
import { ArrowUp, Bot, Loader, User } from "lucide-react";
import { Button } from "./ui/button";
import MarkdownRenderer from "./markdown-renderer";

export function ChatWithAiSheet() {
  const { chatWithAiSheet, closeChatSheet, chatDoubtId } = useUser();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, isHistoryLoading, isStreaming, error, sendMessage } =
    useChat(chatDoubtId || "");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  useEffect(() => {
    if (!chatWithAiSheet) {
      setInput("");
    }
  }, [chatWithAiSheet]);

  useEffect(() => {
    if (chatWithAiSheet) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [chatWithAiSheet]);

  useEffect(() => {
    if (!chatWithAiSheet) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        textareaRef.current?.focus();
        setInput((prev) => prev + e.key);
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [chatWithAiSheet]);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Sheet
      open={chatWithAiSheet}
      onOpenChange={(open) => {
        if (!open) closeChatSheet();
      }}
    >
      <SheetContent className="bg-[#2a2826] border-white/10 text-white min-w-full sm:min-w-200">
        <SheetHeader>
          <SheetTitle className="font-mono text-white">Chat with AI</SheetTitle>
          <SheetDescription className="font-mono text-white/50">
            Ask your questions and get help from our AI assistant.
          </SheetDescription>
        </SheetHeader>

        <hr className="border-white/10 w-full" />

        {/* Chat area — click anywhere to focus input */}
        <div
          className="px-4 flex-1 flex flex-col min-h-0 pb-3"
          onClick={() => textareaRef.current?.focus()}
        >
          {/* Messages — scrollable */}
          <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-3 pr-1">
            {/* Loading history */}
            {isHistoryLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-5 h-5 text-white/50 animate-spin" />
              </div>
            )}

            {/* Empty state */}
            {!isHistoryLoading && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Bot className="w-8 h-8 text-white/20" />
                <p className="font-mono text-xs text-white/30">
                  Ask a question about this doubt
                </p>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg) =>
              msg.role === "ASSISTANT" ? (
                <div key={msg.id} className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg max-w-[85%]">
                    <MarkdownRenderer content={msg.content} />

                    <small className="text-white/50 mt-1 block text-[11px] text-right">
                      {new Date(msg.createdAt).toLocaleDateString()}{" "}
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex items-start gap-2 self-end">
                  <div className="bg-amber-500/20 border border-amber-500/30 p-3 rounded-lg text-sm text-white max-w-[95%] whitespace-pre-wrap">
                    {msg.content}

                    {/* time hh:mm and date */}
                    <small className="text-white/50 mt-1 block text-[11px] text-right">
                      {new Date(msg.createdAt).toLocaleDateString()}{" "}
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-black" />
                  </div>
                </div>
              ),
            )}

            {/* Streaming indicator */}
            {isStreaming &&
              messages[messages.length - 1]?.role !== "ASSISTANT" && (
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="bg-white/10 p-3 rounded-lg">
                    <Loader className="w-4 h-4 text-white/50 animate-spin" />
                  </div>
                </div>
              )}

            {/* Error */}
            {error && (
              <div className="text-center text-xs text-red-400 font-mono py-2">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input — pinned at bottom */}
          <div className="shrink-0 pt-3">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 pl-5 pr-2 py-2 backdrop-blur">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                disabled={isStreaming}
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 resize-none outline-none border-none focus:ring-0 p-0 disabled:opacity-50"
              />
              <Button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-500 text-black hover:bg-amber-400 transition-colors shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isStreaming ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowUp className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
