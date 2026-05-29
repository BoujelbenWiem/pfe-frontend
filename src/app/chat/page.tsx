"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/language/useLanguage";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { sendMessage } from "@/services/chat.service";
import { ChatResponse } from "@/lib/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content?: string;
  response?: ChatResponse;
}
export default function ChatPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConversation = useCallback((id: string) => {
    router.push(`/chat/${id}`);
  }, [router]);

  const handleNewConversation = useCallback(() => {
    router.push("/chat");
    setMessages([]);
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
      const response = await sendMessage(question, null);
      // If backend returns a conversation_id (new conversation created), navigate to it
      if (response.conversation_id) {
        router.push(`/chat/${response.conversation_id}`);
        setRefreshTrigger((prev) => prev + 1);
      }
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
          currentConversationId={null}
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
