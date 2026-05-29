"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/language/useLanguage";
import { useRouter, useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { sendMessage } from "@/services/chat.service";
import { getConversation } from "@/services/chatHistory.service";
import { ChatResponse } from "@/lib/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content?: string;
  response?: ChatResponse;
}
export default function ChatConversationPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const conversationId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load conversation on mount or when conversationId changes
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    (async () => {
      try {
        const detail = await getConversation(conversationId);
        const loaded: Message[] = detail.messages.map((msg) => ({
          id: msg.id || Math.random().toString(),
          role: msg.role,
          content: msg.role === "user" ? msg.content : undefined,
          response: msg.role === "assistant" ? {
            formatted_response: msg.formatted_response || { type: "text", content: msg.content || "" },
            sql_query: msg.sql_query || null,
            timestamp: msg.created_at,
          } : undefined,
        }));
        setMessages(loaded);
      } catch {
        setMessages([]);
      }
    })();
  }, [conversationId]);

  const handleSelectConversation = useCallback((id: string) => {
    if (id === conversationId) return;
    router.push(`/chat/${id}`);
  }, [router, conversationId]);

  const handleNewConversation = useCallback(() => {
    router.push("/chat");
  }, [router]);

  const handleSend = async (question: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await sendMessage(question, conversationId);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        response,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        response: {
          error: t("chat.error"),
          timestamp: new Date().toISOString(),
        },
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <ChatSidebar
          currentConversationId={conversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          refreshTrigger={refreshTrigger}
        />

        {/* Chat area */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto px-4">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto py-6 space-y-2 flex flex-col-reverse">
            <div ref={bottomRef} />

            {loading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
                response={msg.response}
              />
            )).reverse()}

            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-3">
                  <div className="text-4xl">💬</div>
                  <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    {t("chat.title")}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
                    {t("chat.description")}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="pb-4 flex-shrink-0 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <ChatInput onSend={handleSend} loading={loading} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
